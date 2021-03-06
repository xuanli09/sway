## Classes
<dl>
<dt><a href="#Operation">Operation</a></dt>
<dd></dd>
<dt><a href="#Parameter">Parameter</a></dt>
<dd></dd>
<dt><a href="#ParameterValue">ParameterValue</a></dt>
<dd></dd>
<dt><a href="#Path">Path</a></dt>
<dd></dd>
<dt><a href="#Response">Response</a></dt>
<dd></dd>
<dt><a href="#SwaggerApi">SwaggerApi</a></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#create">create(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Creates a SwaggerApi object from its Swagger definition(s).</p>
</dd>
</dl>
## Typedefs
<dl>
<dt><a href="#validatorCallback">validatorCallback</a> ⇒ <code>object</code></dt>
<dd><p>Callback used for validation.</p>
</dd>
</dl>
<a name="Operation"></a>
## Operation
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| api | <code>[SwaggerApi](#SwaggerApi)</code> | The Swagger API object |
| definition | <code>object</code> | The operation definition |
| method | <code>string</code> | The HTTP method for this operation |
| pathObject | <code>[Path](#Path)</code> | The Path object |
| parameterObjects | <code>[Array.&lt;Parameter&gt;](#Parameter)</code> | The Parameter objects |
| ptr | <code>string</code> | The JSON Pointer to the operation |
| securityDefinitions | <code>object</code> | The security definitions used by this operation |


* [Operation](#Operation)
  * [new Operation(api, pathObject, method, ptr, definition, consumes, produces)](#new_Operation_new)
  * [.getParameters()](#Operation+getParameters) ⇒ <code>[Array.&lt;Parameter&gt;](#Parameter)</code>
  * [.getResponse([statusCode])](#Operation+getResponse) ⇒ <code>[Response](#Response)</code>
  * [.getResponses()](#Operation+getResponses) ⇒ <code>[Array.&lt;Response&gt;](#Response)</code>
  * [.validateRequest(req)](#Operation+validateRequest) ⇒ <code>object</code>
  * [.validateResponse(statusCode, headers, body, [encoding])](#Operation+validateResponse) ⇒ <code>object</code>

<a name="new_Operation_new"></a>
### new Operation(api, pathObject, method, ptr, definition, consumes, produces)
The Swagger Operation object.

**Note:** Do not use directly.

**Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
                      object.


| Param | Type | Description |
| --- | --- | --- |
| api | <code>[SwaggerApi](#SwaggerApi)</code> | The Swagger API object |
| pathObject | <code>[Path](#Path)</code> | The Path object |
| method | <code>string</code> | The operation method |
| ptr | <code>string</code> | The JSON Pointer to the operation |
| definition | <code>object</code> | The operation definition |
| consumes | <code>Array.&lt;string&gt;</code> | The mime types this operation consumes |
| produces | <code>Array.&lt;string&gt;</code> | The mime types this operation produces |

<a name="Operation+getParameters"></a>
### operation.getParameters() ⇒ <code>[Array.&lt;Parameter&gt;](#Parameter)</code>
Returns all parameters for the operation.

**Kind**: instance method of <code>[Operation](#Operation)</code>  
**Returns**: <code>[Array.&lt;Parameter&gt;](#Parameter)</code> - All parameters for the operation.  
<a name="Operation+getResponse"></a>
### operation.getResponse([statusCode]) ⇒ <code>[Response](#Response)</code>
Returns the response for the requested status code or the default response *(if available)* if none is provided.

**Kind**: instance method of <code>[Operation](#Operation)</code>  
**Returns**: <code>[Response](#Response)</code> - The response or undefined if one cannot be found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [statusCode] | <code>number</code> &#124; <code>string</code> | <code>&#x27;default&#x27;</code> | The status code |

<a name="Operation+getResponses"></a>
### operation.getResponses() ⇒ <code>[Array.&lt;Response&gt;](#Response)</code>
Returns all responses for the operation.

**Kind**: instance method of <code>[Operation](#Operation)</code>  
**Returns**: <code>[Array.&lt;Response&gt;](#Response)</code> - All responses for the operation.  
<a name="Operation+validateRequest"></a>
### operation.validateRequest(req) ⇒ <code>object</code>
Validates the request.

**Note:** Below is the list of `req` properties used *(req should be an `http.ClientRequest` or equivalent)*:

* `body`: Used for `body` and `formData` parameters
* `files`: Used for `formData` parameters whose `type` is `file`
* `headers`: Used for `header` parameters and consumes
* `query`: Used for `query` parameters
* `url`: used for `path` parameters

For `path` parameters, we will use the operation's `regexp` property to parse out path parameters using the `url`
property.

*(See: [https://nodejs.org/api/http.html#http_class_http_clientrequest](https://nodejs.org/api/http.html#http_class_http_clientrequest))*

**Kind**: instance method of <code>[Operation](#Operation)</code>  
**Returns**: <code>object</code> - The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
                  of these property values should be an array of objects that have at minimum the following
                  properties:

                    * code: The code used to identify the error/warning
                    * [errors]: The error(s) encountered during validation
                      * code: The code used to identify the error/warning
                      * [in]: The parameter location when the errors is a parameter validation error
                      * message: The human readable message for the error/warning
                      * [name]: The parameter name when the error is a parameter validation error
                      * path: The path to the failure or [] for the value itself being invalid
                    * message: The human readable message for the error/warning

                  Any other properties can be added to the error/warning objects as well but these must be there.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The http client request *(or equivalent)* |

<a name="Operation+validateResponse"></a>
### operation.validateResponse(statusCode, headers, body, [encoding]) ⇒ <code>object</code>
Validates the response.

**Note:** We are not using an `http.ServerResponse` or equivalent because to do so would require an opinionated
          interaction flow and we do not want to have to impose any restrictions.  We also do not validate the
          `Content-Type` or body for void, 204 or 304 responses.

**Kind**: instance method of <code>[Operation](#Operation)</code>  
**Returns**: <code>object</code> - The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
                  of these property values should be an array of objects that have at minimum the following
                  properties:

                    * code: The code used to identify the error/warning
                    * [errors]: The nested error(s) encountered during validation
                      * code: The code used to identify the error/warning
                      * message: The human readable message for the error/warning
                      * path: The path to the failure or [] for the value itself being invalid
                    * message: The human readable message for the error/warning
                    * [name]: The header name when the error is a header validation error
                    * [path]: The array of path segments to portion of the document associated with the error/warning

                  Any other properties can be added to the error/warning objects as well but these must be there.  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> | The response status code *(`undefined` will map to the `default` response)* |
| headers | <code>object</code> | The response headers |
| body | <code>\*</code> | The response body |
| [encoding] | <code>string</code> | The encoding of the body when the body is a `Buffer` |

<a name="Parameter"></a>
## Parameter
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| definition | <code>object</code> | The parameter definition |
| operationObject | <code>[Operation](#Operation)</code> | The Operation object (Can be undefined for path-level parameters) |
| pathObject | <code>[Path](#Path)</code> | The Path object |
| ptr | <code>string</code> | The JSON Pointer to the parameter definition |
| schema | <code>object</code> | The JSON Schema for the parameter |


* [Parameter](#Parameter)
  * [new Parameter(opOrPath, ptr, definition, schema)](#new_Parameter_new)
  * [.getSample()](#Parameter+getSample) ⇒ <code>\*</code>
  * [.getSchema()](#Parameter+getSchema) ⇒ <code>object</code>
  * [.getValue(req)](#Parameter+getValue) ⇒ <code>[ParameterValue](#ParameterValue)</code>

<a name="new_Parameter_new"></a>
### new Parameter(opOrPath, ptr, definition, schema)
The Swagger Parameter object.

**Note:** Do not use directly.

**Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
object.


| Param | Type | Description |
| --- | --- | --- |
| opOrPath | <code>[Operation](#Operation)</code> &#124; <code>[Path](#Path)</code> | The Operation or Path object |
| ptr | <code>string</code> | The JSON Pointer to the parameter |
| definition | <code>object</code> | The parameter definition |
| schema | <code>object</code> | The JSON Schema for the parameter |

<a name="Parameter+getSample"></a>
### parameter.getSample() ⇒ <code>\*</code>
Returns a sample value for the parameter based on its schema;

**Kind**: instance method of <code>[Parameter](#Parameter)</code>  
**Returns**: <code>\*</code> - The sample value  
<a name="Parameter+getSchema"></a>
### parameter.getSchema() ⇒ <code>object</code>
Returns the computed JSON Schema for this parameter object.

**Kind**: instance method of <code>[Parameter](#Parameter)</code>  
**Returns**: <code>object</code> - The JSON Schema  
<a name="Parameter+getValue"></a>
### parameter.getValue(req) ⇒ <code>[ParameterValue](#ParameterValue)</code>
Returns the parameter value from the request.

**Note:** Below is the list of `req` properties used *(req should be an `http.ClientRequest` or equivalent)*:

* `body`: Used for `body` and `formData` parameters
* `files`: Used for `formData` parameters whose `type` is `file`
* `headers`: Used for `header` parameters
* `query`: Used for `query` parameters
* `url`: used for `path` parameters

For `path` parameters, we will use the operation's `regexp` property to parse out path parameters using the `url`
property.

*(See: [https://nodejs.org/api/http.html#http_class_http_clientrequest](https://nodejs.org/api/http.html#http_class_http_clientrequest))*

**Kind**: instance method of <code>[Parameter](#Parameter)</code>  
**Returns**: <code>[ParameterValue](#ParameterValue)</code> - The parameter value object  
**Throws**:

- <code>Error</code> If the `in` value of the parameter's schema is not valid or if the `req` property to retrieve the
                parameter is missing.


| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The http client request *(or equivalent)* |

<a name="ParameterValue"></a>
## ParameterValue
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | The error(s) encountered during processing/validating the paramter value |
| parameterObject | <code>[Parameter](#Parameter)</code> | The Parameter object |
| raw | <code>\*</code> | The original parameter value *(Does not take default values into account)* |
| valid | <code>boolean</code> | Whether or not this parameter is valid based on its JSON Schema |
| value | <code>\*</code> | The processed value *(Takes default values into account and does type coercion when necessary                       and possible)*.  This can the original value in the event that processing the value is                       impossible *(missing schema type)* or `undefined` if processing the value failed *(invalid                       types, etc.)*. |

<a name="new_ParameterValue_new"></a>
### new ParameterValue(parameter, raw)
Object representing a parameter value.

**Note:** Do not use directly.


| Param | Type | Description |
| --- | --- | --- |
| parameter | <code>[Parameter](#Parameter)</code> | The Parameter Object |
| raw | <code>\*</code> | The original/raw value |

<a name="Path"></a>
## Path
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| api | <code>[SwaggerApi](#SwaggerApi)</code> | The Swagger API object |
| definition | <code>object</code> | The path definition |
| operationObjects | <code>[Array.&lt;Operation&gt;](#Operation)</code> | The operation objects |
| parameterObjects | <code>[Array.&lt;Parameter&gt;](#Parameter)</code> | The path-level parameter objects |
| path | <code>string</code> | The path string |
| ptr | <code>ptr</code> | The JSON Pointer to the path |
| regexp | <code>regexp</code> | The regexp used to match request paths against this path |


* [Path](#Path)
  * [new Path(api, path, ptr, definition, regexp)](#new_Path_new)
  * [.getOperation(method)](#Path+getOperation) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
  * [.getOperations()](#Path+getOperations) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
  * [.getOperationsByTag(tag)](#Path+getOperationsByTag) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
  * [.getParameters()](#Path+getParameters) ⇒ <code>[Array.&lt;Parameter&gt;](#Parameter)</code>

<a name="new_Path_new"></a>
### new Path(api, path, ptr, definition, regexp)
The Path object.

**Note:** Do not use directly.

**Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
                      object.


| Param | Type | Description |
| --- | --- | --- |
| api | <code>[SwaggerApi](#SwaggerApi)</code> | The Swagger API object |
| path | <code>string</code> | The path string |
| ptr | <code>ptr</code> | The JSON Pointer to the path |
| definition | <code>object</code> | The path definition |
| regexp | <code>regexp</code> | The regexp used to match request paths against this path |

<a name="Path+getOperation"></a>
### path.getOperation(method) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
Return the operation for this path and method.

**Kind**: instance method of <code>[Path](#Path)</code>  
**Returns**: <code>[Array.&lt;Operation&gt;](#Operation)</code> - The Operation objects for this path and method or undefined if there is no operation for the
                       provided method.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The method |

<a name="Path+getOperations"></a>
### path.getOperations() ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
Return the operations for this path.

**Kind**: instance method of <code>[Path](#Path)</code>  
**Returns**: <code>[Array.&lt;Operation&gt;](#Operation)</code> - The Operation objects for this path.  
<a name="Path+getOperationsByTag"></a>
### path.getOperationsByTag(tag) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
Return the operations for this path and tag.

**Kind**: instance method of <code>[Path](#Path)</code>  
**Returns**: <code>[Array.&lt;Operation&gt;](#Operation)</code> - The Operation objects for this path and tag  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag |

<a name="Path+getParameters"></a>
### path.getParameters() ⇒ <code>[Array.&lt;Parameter&gt;](#Parameter)</code>
Return the parameters for this path.

**Kind**: instance method of <code>[Path](#Path)</code>  
**Returns**: <code>[Array.&lt;Parameter&gt;](#Parameter)</code> - The Parameter objects for this path.  
<a name="Response"></a>
## Response
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| definition | <code>object</code> | The response definition |
| operationObject | <code>[Operation](#Operation)</code> | The Operation object |
| ptr | <code>string</code> | The JSON Pointer to the response definition |
| statusCode | <code>string</code> | The status code |


* [Response](#Response)
  * [new Response(operation, ptr, definition, statusCode)](#new_Response_new)
  * [.getExample([mimeType])](#Response+getExample) ⇒ <code>string</code>
  * [.getSample()](#Response+getSample) ⇒ <code>\*</code>
  * [.validateResponse(headers, body, [encoding])](#Response+validateResponse) ⇒ <code>object</code>

<a name="new_Response_new"></a>
### new Response(operation, ptr, definition, statusCode)
The Swagger Response object.

**Note:** Do not use directly.

**Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
object.


| Param | Type | Description |
| --- | --- | --- |
| operation | <code>[Operation](#Operation)</code> | The Operation object |
| ptr | <code>string</code> | The JSON Pointer to the response |
| definition | <code>object</code> | The parameter definition |
| statusCode | <code>string</code> | The status code |

<a name="Response+getExample"></a>
### response.getExample([mimeType]) ⇒ <code>string</code>
Returns the response example for the mime-type.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>string</code> - The response example as a string or `undefined` if the response code and/or mime-type is missing  

| Param | Type | Description |
| --- | --- | --- |
| [mimeType] | <code>string</code> | The mime type |

<a name="Response+getSample"></a>
### response.getSample() ⇒ <code>\*</code>
Returns a sample value.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>\*</code> - The sample value for the response, which can be undefined if the response schema is not provided  
<a name="Response+validateResponse"></a>
### response.validateResponse(headers, body, [encoding]) ⇒ <code>object</code>
Validates the response.

**Note:** We are not using an `http.ServerResponse` or equivalent because to do so would require an opinionated
          interaction flow and we do not want to have to impose any restrictions.  We also do not validate the
          `Content-Type` or body for void, 204 or 304 responses.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
                  of these property values should be an array of objects that have at minimum the following
                  properties:

                    * code: The code used to identify the error/warning
                    * [errors]: The nested error(s) encountered during validation
                      * code: The code used to identify the error/warning
                      * message: The human readable message for the error/warning
                      * path: The path to the failure or [] for the value itself being invalid
                    * message: The human readable message for the error/warning
                    * [name]: The header name when the error is a header validation error
                    * [path]: The array of path segments to portion of the document associated with the error/warning

                  Any other properties can be added to the error/warning objects as well but these must be there.  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | The response headers |
| body | <code>\*</code> | The response body |
| [encoding] | <code>string</code> | The encoding of the body when the body is a `Buffer` |

<a name="SwaggerApi"></a>
## SwaggerApi
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| customValidators | <code>Array.&lt;function()&gt;</code> | The array of custom validators |
| definition | <code>object</code> | The API definition |
| documentation | <code>string</code> | The URL to the Swagger documentation |
| errors | <code>Array.&lt;object&gt;</code> | The validation errors or undefined if validation has not run |
| pathObjects | <code>[Array.&lt;Path&gt;](#Path)</code> | The unique path objects |
| options | <code>object</code> | The options passed to the constructor |
| references | <code>object</code> | The reference metadata |
| resolved | <code>object</code> | The fully resolved API definition |
| version | <code>string</code> | The Swagger API version |
| warnings | <code>Array.&lt;object&gt;</code> | The validation warnings or undefined if validation has not run |


* [SwaggerApi](#SwaggerApi)
  * [new SwaggerApi(plugin, definition, resolved, references, options)](#new_SwaggerApi_new)
  * [.getOperation(pathOrReq, [method])](#SwaggerApi+getOperation) ⇒ <code>[Operation](#Operation)</code>
  * [.getOperations([path])](#SwaggerApi+getOperations) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
  * [.getOperationsByTag([tag])](#SwaggerApi+getOperationsByTag) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
  * [.getPath(pathOrReq)](#SwaggerApi+getPath) ⇒ <code>[Path](#Path)</code>
  * [.getPaths()](#SwaggerApi+getPaths) ⇒ <code>[Array.&lt;Path&gt;](#Path)</code>
  * [.registerValidator(validator)](#SwaggerApi+registerValidator)
  * [.validate()](#SwaggerApi+validate) ⇒ <code>object</code>

<a name="new_SwaggerApi_new"></a>
### new SwaggerApi(plugin, definition, resolved, references, options)
The Swagger API object.

**Note:** Do not use directly.

**Extra Properties:** Other than the documented properties, this object also exposes all properties of the definition
                      object.


| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>object</code> | The Swagger version plugin |
| definition | <code>object</code> | The Swagger definition |
| resolved | <code>object</code> | The fully resolved Swagger definition |
| references | <code>object</code> | The location and resolution of the resolved references in the Swagger definition |
| options | <code>object</code> | The options passed to swaggerApi.create |
| [options.customValidators] | <code>[Array.&lt;validatorCallback&gt;](#validatorCallback)</code> | The custom validators |

<a name="SwaggerApi+getOperation"></a>
### swaggerApi.getOperation(pathOrReq, [method]) ⇒ <code>[Operation](#Operation)</code>
Returns the operation for the given path and operation.

**Note:** Below is the list of `reqOrPath` properties used when `reqOrPath` is an `http.ClientRequest`
          *(or equivalent)*:

* `method`
* `url`

*(See: [https://nodejs.org/api/http.html#http_class_http_clientrequest](https://nodejs.org/api/http.html#http_class_http_clientrequest))*

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>[Operation](#Operation)</code> - The operation for the provided path and method or undefined if there is no operation for that
                     path and method combination.  

| Param | Type | Description |
| --- | --- | --- |
| pathOrReq | <code>string</code> &#124; <code>object</code> | The Swagger path string or the http client request *(or equivalent)* |
| [method] | <code>string</code> | The Swagger operation method |

<a name="SwaggerApi+getOperations"></a>
### swaggerApi.getOperations([path]) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
Returns all operations for the provided path or all operations in the API.

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>[Array.&lt;Operation&gt;](#Operation)</code> - All operations for the provided path or all API operations.  

| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | The Swagger path |

<a name="SwaggerApi+getOperationsByTag"></a>
### swaggerApi.getOperationsByTag([tag]) ⇒ <code>[Array.&lt;Operation&gt;](#Operation)</code>
Returns all operations for the provided tag.

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>[Array.&lt;Operation&gt;](#Operation)</code> - All operations for the provided tag.  

| Param | Type | Description |
| --- | --- | --- |
| [tag] | <code>string</code> | The Swagger tag |

<a name="SwaggerApi+getPath"></a>
### swaggerApi.getPath(pathOrReq) ⇒ <code>[Path](#Path)</code>
Returns the path object for the given path or request.

**Note:** Below is the list of `reqOrPath` properties used when `reqOrPath` is an `http.ClientRequest`
          *(or equivalent)*:

* `url`

*(See: [https://nodejs.org/api/http.html#http_class_http_clientrequest](https://nodejs.org/api/http.html#http_class_http_clientrequest))*

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>[Path](#Path)</code> - The corresponding Path object for the requested path or request.  

| Param | Type | Description |
| --- | --- | --- |
| pathOrReq | <code>string</code> &#124; <code>object</code> | The Swagger path string or the http client request *(or equivalent)* |

<a name="SwaggerApi+getPaths"></a>
### swaggerApi.getPaths() ⇒ <code>[Array.&lt;Path&gt;](#Path)</code>
Returns all path objects for the Swagger API.

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>[Array.&lt;Path&gt;](#Path)</code> - The Path objects  
<a name="SwaggerApi+registerValidator"></a>
### swaggerApi.registerValidator(validator)
Registers a validator.

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Throws**:

- <code>TypeError</code> If the validator is not a function


| Param | Type | Description |
| --- | --- | --- |
| validator | <code>[validatorCallback](#validatorCallback)</code> | The validator |

<a name="SwaggerApi+validate"></a>
### swaggerApi.validate() ⇒ <code>object</code>
Performs validation of the Swagger API document(s).

**Kind**: instance method of <code>[SwaggerApi](#SwaggerApi)</code>  
**Returns**: <code>object</code> - The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
                  of these property values should be an array of objects that have at minimum the following
                  properties:

                    * code: The code used to identify the error/warning
                    * [errors]: The nested error(s) encountered during validation
                      * code: The code used to identify the error/warning
                      * message: The human readable message for the error/warning
                      * path: The path to the failure or [] for the value itself being invalid
                    * message: The human readable message for the error/warning
                    * [name]: The header name when the error is a header validation error
                    * path: The array of path segments to portion of the document associated with the error/warning

                  Any other properties can be added to the error/warning objects as well but these must be there.  
<a name="create"></a>
## create(options) ⇒ <code>Promise</code>
Creates a SwaggerApi object from its Swagger definition(s).

**Kind**: global function  
**Returns**: <code>Promise</code> - the promise  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options for loading the definition(s) |
| options.definition | <code>object</code> &#124; <code>string</code> | The Swagger definition location or structure |
| [options.jsonRefs] | <code>object</code> | The options to pass to json-refs |
| [options.customValidators] | <code>[Array.&lt;validatorCallback&gt;](#validatorCallback)</code> | The custom validators |

**Example**  
```js
SwaggerApi.create({definition: 'http://petstore.swagger.io/v2/swagger.yaml'})
  .then(function (api) {
    console.log('Documentation URL: ', api.documentation);
  }, function (err) {
    console.error(err.stack);
  });
```
<a name="validatorCallback"></a>
## validatorCallback ⇒ <code>object</code>
Callback used for validation.

**Kind**: global typedef  
**Returns**: <code>object</code> - The validation results.  This object should contain two properties: `errors` and `warnings`.  Each
                  of these property values should be an array of objects that have at minimum the following
                  properties:

                    * code: The code used to identify the error/warning
                    * message: The human readable message for the error/warning
                    * path: The array of path segments to portion of the document associated with the error/warning

                  Any other properties can be added to the error/warning objects as well but these must be there.  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>[SwaggerApi](#SwaggerApi)</code> | The Swagger API object |

