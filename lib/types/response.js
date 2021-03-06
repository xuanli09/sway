/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var _ = require('lodash');
var debug = require('debug')('sway:response');
var sHelpers = require('../helpers');
var YAML = require('js-yaml');

var jsonValidator;

/**
 * The Swagger Response object.
 *
 * **Note:** Do not use directly.
 *
 * **Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
 * object.
 *
 * @param {Operation} operation - The Operation object
 * @param {string} ptr - The JSON Pointer to the response
 * @param {object} definition - The parameter definition
 * @param {string} statusCode - The status code
 *
 * @property {object} definition - The response definition
 * @property {Operation} operationObject - The Operation object
 * @property {string} ptr - The JSON Pointer to the response definition
 * @property {string} statusCode - The status code
 *
 * @constructor
 */
function Response (operation, ptr, definition, statusCode) {
  jsonValidator = sHelpers.createJSONValidator({
                                                 formatValidators: operation.api.plugin.customFormatValidators
                                               });

  this.definition = definition;
  this.operationObject = operation;
  this.ptr = ptr;
  this.statusCode = statusCode;

  // Assign Swagger definition properties to the parameter for easy access
  _.assign(this, definition);

  debug('Found %s response at %s', statusCode, ptr);
}

/**
 * Returns the response example for the mime-type.
 *
 * @param {string} [mimeType] - The mime type
 *
 * @returns {string} The response example as a string or `undefined` if the response code and/or mime-type is missing
 */
Response.prototype.getExample = function (mimeType) {
  var example;

  if (_.isPlainObject(this.definition.examples)) {
    example = this.definition.examples[mimeType];
  }

  if (!_.isUndefined(example) && !_.isString(example)) {
    if (mimeType === 'application/json') {
      example = JSON.stringify(example, null, 2);
    } else if (mimeType === 'application/x-yaml') {
      example = YAML.safeDump(example, {indent: 2});
    }
  }

  return example;
};

/**
 * Returns a sample value.
 *
 * @returns {*} The sample value for the response, which can be undefined if the response schema is not provided
 */
Response.prototype.getSample = function () {
  var sample;

  if (!_.isUndefined(this.definition.schema)) {
    sample = this.operationObject.api.plugin.getSample(this.definition.schema);
  }

  return sample;
};

/**
 * Validates the response.
 *
 * **Note:** We are not using an `http.ServerResponse` or equivalent because to do so would require an opinionated
 *           interaction flow and we do not want to have to impose any restrictions.  We also do not validate the
 *           `Content-Type` or body for void, 204 or 304 responses.
 *
 * @param {object} headers - The response headers
 * @param {*} body - The response body
 * @param {string} [encoding] - The encoding of the body when the body is a `Buffer`
 *
 * @returns {object} The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
 *                   of these property values should be an array of objects that have at minimum the following
 *                   properties:
 *
 *                     * code: The code used to identify the error/warning
 *                     * [errors]: The nested error(s) encountered during validation
 *                       * code: The code used to identify the error/warning
 *                       * message: The human readable message for the error/warning
 *                       * path: The path to the failure or [] for the value itself being invalid
 *                     * message: The human readable message for the error/warning
 *                     * [name]: The header name when the error is a header validation error
 *                     * [path]: The array of path segments to portion of the document associated with the error/warning
 *
 *                   Any other properties can be added to the error/warning objects as well but these must be there.
 */
Response.prototype.validateResponse = function (headers, body, encoding) {
  var results = {
    errors: [],
    warnings: []
  };
  var that = this;
  var bodyValue;
  var bvResults;

  // Validate the Content-Type except for void responses, 204 responses and 304 responses as they have no body
  if (!_.isUndefined(this.definition.schema) && _.indexOf(['204', '304'], this.statusCode) === -1) {
    sHelpers.validateContentType(headers['content-type'], this.operationObject.produces, results);
  }

  // Validate the response headers
  _.forEach(this.headers, function (schema, name) {
    var headerValue;
    var hvResults;

    try {
      headerValue = that.operationObject.api.plugin.convertValue(schema,
                                                 {
                                                   collectionFormat: schema.collectionFormat
                                                 },
                                                 // Most Node.js environment lowercase the header but just in case...
                                                 headers[name.toLowerCase()] || headers[name] || schema.default);
    } catch (err) {
      results.errors.push({
                            code: 'INVALID_RESPONSE_HEADER',
                            errors: err.errors || [
                              {
                                code: err.code,
                                message: err.message,
                                path: err.path
                              }
                            ],
                            message: 'Invalid header (' + name + '): ' + err.message,
                            name: name,
                            path: err.path
                          });
    }

    // Due to ambiguity in the Swagger 2.0 Specification (https://github.com/swagger-api/swagger-spec/issues/321), it
    // is probably not a good idea to do requiredness checks for response headers.  This means we will validate
    // existing headers but will not throw an error if a header is defined in a response schema but not in the response.
    //
    // We also do not want to validate date objects because it is redundant.  If we have already converted the value
    // from a string+format to a date, we know it passes schema validation.
    if (!_.isUndefined(headerValue) && !_.isDate(headerValue)) {
      hvResults = sHelpers.validateAgainstSchema(jsonValidator, schema, headerValue);

      if (hvResults.errors.length > 0) {
        results.errors.push({
                              code: 'INVALID_RESPONSE_HEADER',
                              errors: hvResults.errors,
                              // Report the actual error if there is only one error.  Otherwise, report a JSON Schema
                              // validation error.
                              message: 'Invalid header (' + name + '): ' + (hvResults.errors.length > 1 ?
                                                                            'Value failed JSON Schema validation' :
                                                                            hvResults.errors[0].message),
                              name: name,
                              path: []
                            });
      }
    }
  });

  // Validate response for non-void responses
  if (!_.isUndefined(this.definition.schema) && _.indexOf(['204', '304'], this.statusCode) === -1) {
    try {
      bodyValue = that.operationObject.api.plugin.convertValue(this.definition.schema, {
        encoding: encoding
      }, body);
      bvResults = sHelpers.validateAgainstSchema(jsonValidator, this.definition.schema, bodyValue);
    } catch (err) {
      bvResults = {
        errors: [
          {
            code: err.code,
            message: err.message,
            path: err.path
          }
        ]
      };
    }

    if (bvResults.errors.length > 0) {
      results.errors.push({
                            code: 'INVALID_RESPONSE_BODY',
                            errors: bvResults.errors,
                            message: 'Invalid body: ' + (bvResults.errors.length > 1 ?
                                                           'Value failed JSON Schema validation' :
                                                           bvResults.errors[0].message),
                            path: []
                          });
    }
  }

  return results;
};

module.exports = Response;
