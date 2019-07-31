(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["scientific-scientific-module"],{

/***/ "./node_modules/graphql-tag/src/index.js":
/*!***********************************************!*\
  !*** ./node_modules/graphql-tag/src/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var parser = __webpack_require__(/*! graphql/language/parser */ "./node_modules/graphql/language/parser.mjs");

var parse = parser.parse;

// Strip insignificant whitespace
// Note that this could do a lot more, such as reorder fields etc.
function normalize(string) {
  return string.replace(/[\s,]+/g, ' ').trim();
}

// A map docString -> graphql document
var docCache = {};

// A map fragmentName -> [normalized source]
var fragmentSourceMap = {};

function cacheKeyFromLoc(loc) {
  return normalize(loc.source.body.substring(loc.start, loc.end));
}

// For testing.
function resetCaches() {
  docCache = {};
  fragmentSourceMap = {};
}

// Take a unstripped parsed document (query/mutation or even fragment), and
// check all fragment definitions, checking for name->source uniqueness.
// We also want to make sure only unique fragments exist in the document.
var printFragmentWarnings = true;
function processFragments(ast) {
  var astFragmentMap = {};
  var definitions = [];

  for (var i = 0; i < ast.definitions.length; i++) {
    var fragmentDefinition = ast.definitions[i];

    if (fragmentDefinition.kind === 'FragmentDefinition') {
      var fragmentName = fragmentDefinition.name.value;
      var sourceKey = cacheKeyFromLoc(fragmentDefinition.loc);

      // We know something about this fragment
      if (fragmentSourceMap.hasOwnProperty(fragmentName) && !fragmentSourceMap[fragmentName][sourceKey]) {

        // this is a problem because the app developer is trying to register another fragment with
        // the same name as one previously registered. So, we tell them about it.
        if (printFragmentWarnings) {
          console.warn("Warning: fragment with name " + fragmentName + " already exists.\n"
            + "graphql-tag enforces all fragment names across your application to be unique; read more about\n"
            + "this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names");
        }

        fragmentSourceMap[fragmentName][sourceKey] = true;

      } else if (!fragmentSourceMap.hasOwnProperty(fragmentName)) {
        fragmentSourceMap[fragmentName] = {};
        fragmentSourceMap[fragmentName][sourceKey] = true;
      }

      if (!astFragmentMap[sourceKey]) {
        astFragmentMap[sourceKey] = true;
        definitions.push(fragmentDefinition);
      }
    } else {
      definitions.push(fragmentDefinition);
    }
  }

  ast.definitions = definitions;
  return ast;
}

function disableFragmentWarnings() {
  printFragmentWarnings = false;
}

function stripLoc(doc, removeLocAtThisLevel) {
  var docType = Object.prototype.toString.call(doc);

  if (docType === '[object Array]') {
    return doc.map(function (d) {
      return stripLoc(d, removeLocAtThisLevel);
    });
  }

  if (docType !== '[object Object]') {
    throw new Error('Unexpected input.');
  }

  // We don't want to remove the root loc field so we can use it
  // for fragment substitution (see below)
  if (removeLocAtThisLevel && doc.loc) {
    delete doc.loc;
  }

  // https://github.com/apollographql/graphql-tag/issues/40
  if (doc.loc) {
    delete doc.loc.startToken;
    delete doc.loc.endToken;
  }

  var keys = Object.keys(doc);
  var key;
  var value;
  var valueType;

  for (key in keys) {
    if (keys.hasOwnProperty(key)) {
      value = doc[keys[key]];
      valueType = Object.prototype.toString.call(value);

      if (valueType === '[object Object]' || valueType === '[object Array]') {
        doc[keys[key]] = stripLoc(value, true);
      }
    }
  }

  return doc;
}

var experimentalFragmentVariables = false;
function parseDocument(doc) {
  var cacheKey = normalize(doc);

  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }

  var parsed = parse(doc, { experimentalFragmentVariables: experimentalFragmentVariables });
  if (!parsed || parsed.kind !== 'Document') {
    throw new Error('Not a valid GraphQL document.');
  }

  // check that all "new" fragments inside the documents are consistent with
  // existing fragments of the same name
  parsed = processFragments(parsed);
  parsed = stripLoc(parsed, false);
  docCache[cacheKey] = parsed;

  return parsed;
}

function enableExperimentalFragmentVariables() {
  experimentalFragmentVariables = true;
}

function disableExperimentalFragmentVariables() {
  experimentalFragmentVariables = false;
}

// XXX This should eventually disallow arbitrary string interpolation, like Relay does
function gql(/* arguments */) {
  var args = Array.prototype.slice.call(arguments);

  var literals = args[0];

  // We always get literals[0] and then matching post literals for each arg given
  var result = (typeof(literals) === "string") ? literals : literals[0];

  for (var i = 1; i < args.length; i++) {
    if (args[i] && args[i].kind && args[i].kind === 'Document') {
      result += args[i].loc.source.body;
    } else {
      result += args[i];
    }

    result += literals[i];
  }

  return parseDocument(result);
}

// Support typescript, which isn't as nice as Babel about default exports
gql.default = gql;
gql.resetCaches = resetCaches;
gql.disableFragmentWarnings = disableFragmentWarnings;
gql.enableExperimentalFragmentVariables = enableExperimentalFragmentVariables;
gql.disableExperimentalFragmentVariables = disableExperimentalFragmentVariables;

module.exports = gql;


/***/ }),

/***/ "./node_modules/graphql/error/GraphQLError.mjs":
/*!*****************************************************!*\
  !*** ./node_modules/graphql/error/GraphQLError.mjs ***!
  \*****************************************************/
/*! exports provided: GraphQLError, printError */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphQLError", function() { return GraphQLError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printError", function() { return printError; });
/* harmony import */ var _jsutils_isObjectLike__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsutils/isObjectLike */ "./node_modules/graphql/jsutils/isObjectLike.mjs");
/* harmony import */ var _language_location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../language/location */ "./node_modules/graphql/language/location.mjs");
/* harmony import */ var _language_printLocation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../language/printLocation */ "./node_modules/graphql/language/printLocation.mjs");



/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */

function GraphQLError( // eslint-disable-line no-redeclare
message, nodes, source, positions, path, originalError, extensions) {
  // Compute list of blame nodes.
  var _nodes = Array.isArray(nodes) ? nodes.length !== 0 ? nodes : undefined : nodes ? [nodes] : undefined; // Compute locations in the source for the given nodes/positions.


  var _source = source;

  if (!_source && _nodes) {
    var node = _nodes[0];
    _source = node && node.loc && node.loc.source;
  }

  var _positions = positions;

  if (!_positions && _nodes) {
    _positions = _nodes.reduce(function (list, node) {
      if (node.loc) {
        list.push(node.loc.start);
      }

      return list;
    }, []);
  }

  if (_positions && _positions.length === 0) {
    _positions = undefined;
  }

  var _locations;

  if (positions && source) {
    _locations = positions.map(function (pos) {
      return Object(_language_location__WEBPACK_IMPORTED_MODULE_1__["getLocation"])(source, pos);
    });
  } else if (_nodes) {
    _locations = _nodes.reduce(function (list, node) {
      if (node.loc) {
        list.push(Object(_language_location__WEBPACK_IMPORTED_MODULE_1__["getLocation"])(node.loc.source, node.loc.start));
      }

      return list;
    }, []);
  }

  var _extensions = extensions;

  if (_extensions == null && originalError != null) {
    var originalExtensions = originalError.extensions;

    if (Object(_jsutils_isObjectLike__WEBPACK_IMPORTED_MODULE_0__["default"])(originalExtensions)) {
      _extensions = originalExtensions;
    }
  }

  Object.defineProperties(this, {
    message: {
      value: message,
      // By being enumerable, JSON.stringify will include `message` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true,
      writable: true
    },
    locations: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: _locations || undefined,
      // By being enumerable, JSON.stringify will include `locations` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: Boolean(_locations)
    },
    path: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: path || undefined,
      // By being enumerable, JSON.stringify will include `path` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: Boolean(path)
    },
    nodes: {
      value: _nodes || undefined
    },
    source: {
      value: _source || undefined
    },
    positions: {
      value: _positions || undefined
    },
    originalError: {
      value: originalError
    },
    extensions: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: _extensions || undefined,
      // By being enumerable, JSON.stringify will include `path` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: Boolean(_extensions)
    }
  }); // Include (non-enumerable) stack trace.

  if (originalError && originalError.stack) {
    Object.defineProperty(this, 'stack', {
      value: originalError.stack,
      writable: true,
      configurable: true
    });
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLError);
  } else {
    Object.defineProperty(this, 'stack', {
      value: Error().stack,
      writable: true,
      configurable: true
    });
  }
}
GraphQLError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: GraphQLError
  },
  name: {
    value: 'GraphQLError'
  },
  toString: {
    value: function toString() {
      return printError(this);
    }
  }
});
/**
 * Prints a GraphQLError to a string, representing useful location information
 * about the error's position in the source.
 */

function printError(error) {
  var output = error.message;

  if (error.nodes) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = error.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;

        if (node.loc) {
          output += '\n\n' + Object(_language_printLocation__WEBPACK_IMPORTED_MODULE_2__["printLocation"])(node.loc);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (error.source && error.locations) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = error.locations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var location = _step2.value;
        output += '\n\n' + Object(_language_printLocation__WEBPACK_IMPORTED_MODULE_2__["printSourceLocation"])(error.source, location);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  return output;
}


/***/ }),

/***/ "./node_modules/graphql/error/syntaxError.mjs":
/*!****************************************************!*\
  !*** ./node_modules/graphql/error/syntaxError.mjs ***!
  \****************************************************/
/*! exports provided: syntaxError */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syntaxError", function() { return syntaxError; });
/* harmony import */ var _GraphQLError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphQLError */ "./node_modules/graphql/error/GraphQLError.mjs");

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

function syntaxError(source, position, description) {
  return new _GraphQLError__WEBPACK_IMPORTED_MODULE_0__["GraphQLError"]("Syntax Error: ".concat(description), undefined, source, [position]);
}


/***/ }),

/***/ "./node_modules/graphql/jsutils/defineToJSON.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/graphql/jsutils/defineToJSON.mjs ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return defineToJSON; });
/* harmony import */ var _nodejsCustomInspectSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nodejsCustomInspectSymbol */ "./node_modules/graphql/jsutils/nodejsCustomInspectSymbol.mjs");

/**
 * The `defineToJSON()` function defines toJSON() and inspect() prototype
 * methods, if no function provided they become aliases for toString().
 */

function defineToJSON( // eslint-disable-next-line flowtype/no-weak-types
classObject) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : classObject.prototype.toString;
  classObject.prototype.toJSON = fn;
  classObject.prototype.inspect = fn;

  if (_nodejsCustomInspectSymbol__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    classObject.prototype[_nodejsCustomInspectSymbol__WEBPACK_IMPORTED_MODULE_0__["default"]] = fn;
  }
}


/***/ }),

/***/ "./node_modules/graphql/jsutils/defineToStringTag.mjs":
/*!************************************************************!*\
  !*** ./node_modules/graphql/jsutils/defineToStringTag.mjs ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return defineToStringTag; });
/**
 * The `defineToStringTag()` function checks first to see if the runtime
 * supports the `Symbol` class and then if the `Symbol.toStringTag` constant
 * is defined as a `Symbol` instance. If both conditions are met, the
 * Symbol.toStringTag property is defined as a getter that returns the
 * supplied class constructor's name.
 *
 * @method defineToStringTag
 *
 * @param {Class<any>} classObject a class such as Object, String, Number but
 * typically one of your own creation through the class keyword; `class A {}`,
 * for example.
 */
function defineToStringTag(classObject) {
  if (typeof Symbol === 'function' && Symbol.toStringTag) {
    Object.defineProperty(classObject.prototype, Symbol.toStringTag, {
      get: function get() {
        return this.constructor.name;
      }
    });
  }
}


/***/ }),

/***/ "./node_modules/graphql/jsutils/invariant.mjs":
/*!****************************************************!*\
  !*** ./node_modules/graphql/jsutils/invariant.mjs ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return invariant; });
function invariant(condition, message) {
  var booleanCondition = Boolean(condition);
  /* istanbul ignore else */

  if (!booleanCondition) {
    throw new Error(message);
  }
}


/***/ }),

/***/ "./node_modules/graphql/jsutils/isObjectLike.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/graphql/jsutils/isObjectLike.mjs ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return isObjectLike; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */
function isObjectLike(value) {
  return _typeof(value) == 'object' && value !== null;
}


/***/ }),

/***/ "./node_modules/graphql/language/directiveLocation.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/graphql/language/directiveLocation.mjs ***!
  \*************************************************************/
/*! exports provided: DirectiveLocation */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DirectiveLocation", function() { return DirectiveLocation; });
/**
 * The set of allowed directive location values.
 */
var DirectiveLocation = Object.freeze({
  // Request Definitions
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
  VARIABLE_DEFINITION: 'VARIABLE_DEFINITION',
  // Type System Definitions
  SCHEMA: 'SCHEMA',
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  FIELD_DEFINITION: 'FIELD_DEFINITION',
  ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  ENUM_VALUE: 'ENUM_VALUE',
  INPUT_OBJECT: 'INPUT_OBJECT',
  INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
});
/**
 * The enum type representing the directive location values.
 */


/***/ }),

/***/ "./node_modules/graphql/language/kinds.mjs":
/*!*************************************************!*\
  !*** ./node_modules/graphql/language/kinds.mjs ***!
  \*************************************************/
/*! exports provided: Kind */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Kind", function() { return Kind; });
/**
 * The set of allowed kind values for AST nodes.
 */
var Kind = Object.freeze({
  // Name
  NAME: 'Name',
  // Document
  DOCUMENT: 'Document',
  OPERATION_DEFINITION: 'OperationDefinition',
  VARIABLE_DEFINITION: 'VariableDefinition',
  SELECTION_SET: 'SelectionSet',
  FIELD: 'Field',
  ARGUMENT: 'Argument',
  // Fragments
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  FRAGMENT_DEFINITION: 'FragmentDefinition',
  // Values
  VARIABLE: 'Variable',
  INT: 'IntValue',
  FLOAT: 'FloatValue',
  STRING: 'StringValue',
  BOOLEAN: 'BooleanValue',
  NULL: 'NullValue',
  ENUM: 'EnumValue',
  LIST: 'ListValue',
  OBJECT: 'ObjectValue',
  OBJECT_FIELD: 'ObjectField',
  // Directives
  DIRECTIVE: 'Directive',
  // Types
  NAMED_TYPE: 'NamedType',
  LIST_TYPE: 'ListType',
  NON_NULL_TYPE: 'NonNullType',
  // Type System Definitions
  SCHEMA_DEFINITION: 'SchemaDefinition',
  OPERATION_TYPE_DEFINITION: 'OperationTypeDefinition',
  // Type Definitions
  SCALAR_TYPE_DEFINITION: 'ScalarTypeDefinition',
  OBJECT_TYPE_DEFINITION: 'ObjectTypeDefinition',
  FIELD_DEFINITION: 'FieldDefinition',
  INPUT_VALUE_DEFINITION: 'InputValueDefinition',
  INTERFACE_TYPE_DEFINITION: 'InterfaceTypeDefinition',
  UNION_TYPE_DEFINITION: 'UnionTypeDefinition',
  ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
  ENUM_VALUE_DEFINITION: 'EnumValueDefinition',
  INPUT_OBJECT_TYPE_DEFINITION: 'InputObjectTypeDefinition',
  // Directive Definitions
  DIRECTIVE_DEFINITION: 'DirectiveDefinition',
  // Type System Extensions
  SCHEMA_EXTENSION: 'SchemaExtension',
  // Type Extensions
  SCALAR_TYPE_EXTENSION: 'ScalarTypeExtension',
  OBJECT_TYPE_EXTENSION: 'ObjectTypeExtension',
  INTERFACE_TYPE_EXTENSION: 'InterfaceTypeExtension',
  UNION_TYPE_EXTENSION: 'UnionTypeExtension',
  ENUM_TYPE_EXTENSION: 'EnumTypeExtension',
  INPUT_OBJECT_TYPE_EXTENSION: 'InputObjectTypeExtension'
});
/**
 * The enum type representing the possible kind values of AST nodes.
 */


/***/ }),

/***/ "./node_modules/graphql/language/lexer.mjs":
/*!*************************************************!*\
  !*** ./node_modules/graphql/language/lexer.mjs ***!
  \*************************************************/
/*! exports provided: createLexer, isPunctuatorToken, getTokenDesc */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLexer", function() { return createLexer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPunctuatorToken", function() { return isPunctuatorToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTokenDesc", function() { return getTokenDesc; });
/* harmony import */ var _jsutils_defineToJSON__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsutils/defineToJSON */ "./node_modules/graphql/jsutils/defineToJSON.mjs");
/* harmony import */ var _tokenKind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokenKind */ "./node_modules/graphql/language/tokenKind.mjs");
/* harmony import */ var _error_syntaxError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../error/syntaxError */ "./node_modules/graphql/error/syntaxError.mjs");
/* harmony import */ var _blockString__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./blockString */ "./node_modules/graphql/language/blockString.mjs");




/**
 * Given a Source object, this returns a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */

function createLexer(source, options) {
  var startOfFileToken = new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].SOF, 0, 0, 0, 0, null);
  var lexer = {
    source: source,
    options: options,
    lastToken: startOfFileToken,
    token: startOfFileToken,
    line: 1,
    lineStart: 0,
    advance: advanceLexer,
    lookahead: lookahead
  };
  return lexer;
}

function advanceLexer() {
  this.lastToken = this.token;
  var token = this.token = this.lookahead();
  return token;
}

function lookahead() {
  var token = this.token;

  if (token.kind !== _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].EOF) {
    do {
      // Note: next is only mutable during parsing, so we cast to allow this.
      token = token.next || (token.next = readToken(this, token));
    } while (token.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].COMMENT);
  }

  return token;
}
/**
 * The return type of createLexer.
 */


// @internal
function isPunctuatorToken(token) {
  var kind = token.kind;
  return kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BANG || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].DOLLAR || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].AMP || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PAREN_L || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PAREN_R || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].SPREAD || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].COLON || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].EQUALS || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].AT || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACKET_L || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACKET_R || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACE_L || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PIPE || kind === _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACE_R;
}
/**
 * A helper function to describe a token as a string for debugging
 */

function getTokenDesc(token) {
  var value = token.value;
  return value ? "".concat(token.kind, " \"").concat(value, "\"") : token.kind;
}
/**
 * Helper function for constructing the Token object.
 */

function Tok(kind, start, end, line, column, prev, value) {
  this.kind = kind;
  this.start = start;
  this.end = end;
  this.line = line;
  this.column = column;
  this.value = value;
  this.prev = prev;
  this.next = null;
} // Print a simplified form when appearing in JSON/util.inspect.


Object(_jsutils_defineToJSON__WEBPACK_IMPORTED_MODULE_0__["default"])(Tok, function () {
  return {
    kind: this.kind,
    value: this.value,
    line: this.line,
    column: this.column
  };
});

function printCharCode(code) {
  return (// NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].EOF : // Trust JSON for ASCII.
    code < 0x007f ? JSON.stringify(String.fromCharCode(code)) : // Otherwise print the escaped form.
    "\"\\u".concat(('00' + code.toString(16).toUpperCase()).slice(-4), "\"")
  );
}
/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace until it finds the next lexable token, then lexes
 * punctuators immediately or calls the appropriate helper function for more
 * complicated tokens.
 */


function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;
  var pos = positionAfterWhitespace(body, prev.end, lexer);
  var line = lexer.line;
  var col = 1 + pos - lexer.lineStart;

  if (pos >= bodyLength) {
    return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].EOF, bodyLength, bodyLength, line, col, prev);
  }

  var code = body.charCodeAt(pos); // SourceCharacter

  switch (code) {
    // !
    case 33:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BANG, pos, pos + 1, line, col, prev);
    // #

    case 35:
      return readComment(source, pos, line, col, prev);
    // $

    case 36:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].DOLLAR, pos, pos + 1, line, col, prev);
    // &

    case 38:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].AMP, pos, pos + 1, line, col, prev);
    // (

    case 40:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PAREN_L, pos, pos + 1, line, col, prev);
    // )

    case 41:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PAREN_R, pos, pos + 1, line, col, prev);
    // .

    case 46:
      if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
        return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].SPREAD, pos, pos + 3, line, col, prev);
      }

      break;
    // :

    case 58:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].COLON, pos, pos + 1, line, col, prev);
    // =

    case 61:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].EQUALS, pos, pos + 1, line, col, prev);
    // @

    case 64:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].AT, pos, pos + 1, line, col, prev);
    // [

    case 91:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACKET_L, pos, pos + 1, line, col, prev);
    // ]

    case 93:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACKET_R, pos, pos + 1, line, col, prev);
    // {

    case 123:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACE_L, pos, pos + 1, line, col, prev);
    // |

    case 124:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].PIPE, pos, pos + 1, line, col, prev);
    // }

    case 125:
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BRACE_R, pos, pos + 1, line, col, prev);
    // A-Z _ a-z

    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
    case 90:
    case 95:
    case 97:
    case 98:
    case 99:
    case 100:
    case 101:
    case 102:
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
    case 108:
    case 109:
    case 110:
    case 111:
    case 112:
    case 113:
    case 114:
    case 115:
    case 116:
    case 117:
    case 118:
    case 119:
    case 120:
    case 121:
    case 122:
      return readName(source, pos, line, col, prev);
    // - 0-9

    case 45:
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return readNumber(source, pos, code, line, col, prev);
    // "

    case 34:
      if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
        return readBlockString(source, pos, line, col, prev, lexer);
      }

      return readString(source, pos, line, col, prev);
  }

  throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, pos, unexpectedCharacterMessage(code));
}
/**
 * Report a message that an unexpected character was encountered.
 */


function unexpectedCharacterMessage(code) {
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
    return "Cannot contain the invalid character ".concat(printCharCode(code), ".");
  }

  if (code === 39) {
    // '
    return 'Unexpected single quote character (\'), did you mean to use a double quote (")?';
  }

  return "Cannot parse the unexpected character ".concat(printCharCode(code), ".");
}
/**
 * Reads from body starting at startPosition until it finds a non-whitespace
 * character, then returns the position of that character for lexing.
 */


function positionAfterWhitespace(body, startPosition, lexer) {
  var bodyLength = body.length;
  var position = startPosition;

  while (position < bodyLength) {
    var code = body.charCodeAt(position); // tab | space | comma | BOM

    if (code === 9 || code === 32 || code === 44 || code === 0xfeff) {
      ++position;
    } else if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }

      ++lexer.line;
      lexer.lineStart = position;
    } else {
      break;
    }
  }

  return position;
}
/**
 * Reads a comment token from the source file.
 *
 * #[\u0009\u0020-\uFFFF]*
 */


function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code;
  var position = start;

  do {
    code = body.charCodeAt(++position);
  } while (!isNaN(code) && ( // SourceCharacter but not LineTerminator
  code > 0x001f || code === 0x0009));

  return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
}
/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */


function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = body.charCodeAt(++position);
  }

  if (code === 48) {
    // 0
    code = body.charCodeAt(++position);

    if (code >= 48 && code <= 57) {
      throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid number, unexpected digit after 0: ".concat(printCharCode(code), "."));
    }
  } else {
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 46) {
    // .
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;
    code = body.charCodeAt(++position);

    if (code === 43 || code === 45) {
      // + -
      code = body.charCodeAt(++position);
    }

    position = readDigits(source, position, code);
  }

  return new Tok(isFloat ? _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].FLOAT : _tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].INT, start, position, line, col, prev, body.slice(start, position));
}
/**
 * Returns the new position in the source after reading digits.
 */


function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;

  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = body.charCodeAt(++position);
    } while (code >= 48 && code <= 57); // 0 - 9


    return position;
  }

  throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
}
/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */


function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position)) && // not LineTerminator
  code !== 0x000a && code !== 0x000d) {
    // Closing Quote (")
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].STRING, start, position + 1, line, col, prev, value);
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009) {
      throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    ++position;

    if (code === 92) {
      // \
      value += body.slice(chunkStart, position - 1);
      code = body.charCodeAt(position);

      switch (code) {
        case 34:
          value += '"';
          break;

        case 47:
          value += '/';
          break;

        case 92:
          value += '\\';
          break;

        case 98:
          value += '\b';
          break;

        case 102:
          value += '\f';
          break;

        case 110:
          value += '\n';
          break;

        case 114:
          value += '\r';
          break;

        case 116:
          value += '\t';
          break;

        case 117:
          {
            // uXXXX
            var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));

            if (charCode < 0) {
              var invalidSequence = body.slice(position + 1, position + 5);
              throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid character escape sequence: \\u".concat(invalidSequence, "."));
            }

            value += String.fromCharCode(charCode);
            position += 4;
            break;
          }

        default:
          throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid character escape sequence: \\".concat(String.fromCharCode(code), "."));
      }

      ++position;
      chunkStart = position;
    }
  }

  throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, 'Unterminated string.');
}
/**
 * Reads a block string token from the source file.
 *
 * """("?"?(\\"""|\\(?!=""")|[^"\\]))*"""
 */


function readBlockString(source, start, line, col, prev, lexer) {
  var body = source.body;
  var position = start + 3;
  var chunkStart = position;
  var code = 0;
  var rawValue = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
    // Closing Triple-Quote (""")
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      rawValue += body.slice(chunkStart, position);
      return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].BLOCK_STRING, start, position + 3, line, col, prev, Object(_blockString__WEBPACK_IMPORTED_MODULE_3__["dedentBlockStringValue"])(rawValue));
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
      throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }

      ++lexer.line;
      lexer.lineStart = position;
    } else if ( // Escape Triple-Quote (\""")
    code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
    } else {
      ++position;
    }
  }

  throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_2__["syntaxError"])(source, position, 'Unterminated string.');
}
/**
 * Converts four hexadecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */


function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */


function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 // 0-9
  : a >= 65 && a <= 70 ? a - 55 // A-F
  : a >= 97 && a <= 102 ? a - 87 // a-f
  : -1;
}
/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */


function readName(source, start, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var position = start + 1;
  var code = 0;

  while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122) // a-z
  ) {
    ++position;
  }

  return new Tok(_tokenKind__WEBPACK_IMPORTED_MODULE_1__["TokenKind"].NAME, start, position, line, col, prev, body.slice(start, position));
}


/***/ }),

/***/ "./node_modules/graphql/language/location.mjs":
/*!****************************************************!*\
  !*** ./node_modules/graphql/language/location.mjs ***!
  \****************************************************/
/*! exports provided: getLocation */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLocation", function() { return getLocation; });
/**
 * Represents a location in a Source.
 */

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */
function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match;

  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }

  return {
    line: line,
    column: column
  };
}


/***/ }),

/***/ "./node_modules/graphql/language/parser.mjs":
/*!**************************************************!*\
  !*** ./node_modules/graphql/language/parser.mjs ***!
  \**************************************************/
/*! exports provided: parse, parseValue, parseType, parseConstValue, parseTypeReference, parseNamedType */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseValue", function() { return parseValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseType", function() { return parseType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseConstValue", function() { return parseConstValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseTypeReference", function() { return parseTypeReference; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseNamedType", function() { return parseNamedType; });
/* harmony import */ var _jsutils_inspect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsutils/inspect */ "./node_modules/graphql/jsutils/inspect.mjs");
/* harmony import */ var _jsutils_defineToJSON__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsutils/defineToJSON */ "./node_modules/graphql/jsutils/defineToJSON.mjs");
/* harmony import */ var _source__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./source */ "./node_modules/graphql/language/source.mjs");
/* harmony import */ var _error_syntaxError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error/syntaxError */ "./node_modules/graphql/error/syntaxError.mjs");
/* harmony import */ var _tokenKind__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tokenKind */ "./node_modules/graphql/language/tokenKind.mjs");
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lexer */ "./node_modules/graphql/language/lexer.mjs");
/* harmony import */ var _kinds__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./kinds */ "./node_modules/graphql/language/kinds.mjs");
/* harmony import */ var _directiveLocation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./directiveLocation */ "./node_modules/graphql/language/directiveLocation.mjs");








/**
 * Configuration options to control parser behavior
 */

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */
function parse(source, options) {
  var sourceObj = typeof source === 'string' ? new _source__WEBPACK_IMPORTED_MODULE_2__["Source"](source) : source;

  if (!(sourceObj instanceof _source__WEBPACK_IMPORTED_MODULE_2__["Source"])) {
    throw new TypeError("Must provide Source. Received: ".concat(Object(_jsutils_inspect__WEBPACK_IMPORTED_MODULE_0__["default"])(sourceObj)));
  }

  var lexer = Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["createLexer"])(sourceObj, options || {});
  return parseDocument(lexer);
}
/**
 * Given a string containing a GraphQL value (ex. `[42]`), parse the AST for
 * that value.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Values directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: valueFromAST().
 */

function parseValue(source, options) {
  var sourceObj = typeof source === 'string' ? new _source__WEBPACK_IMPORTED_MODULE_2__["Source"](source) : source;
  var lexer = Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["createLexer"])(sourceObj, options || {});
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].SOF);
  var value = parseValueLiteral(lexer, false);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EOF);
  return value;
}
/**
 * Given a string containing a GraphQL Type (ex. `[Int!]`), parse the AST for
 * that type.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Types directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: typeFromAST().
 */

function parseType(source, options) {
  var sourceObj = typeof source === 'string' ? new _source__WEBPACK_IMPORTED_MODULE_2__["Source"](source) : source;
  var lexer = Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["createLexer"])(sourceObj, options || {});
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].SOF);
  var type = parseTypeReference(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EOF);
  return type;
}
/**
 * Converts a name lex token into a name parse node.
 */

function parseName(lexer) {
  var token = expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].NAME,
    value: token.value,
    loc: loc(lexer, token)
  };
} // Implements the parsing rules in the Document section.

/**
 * Document : Definition+
 */


function parseDocument(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].DOCUMENT,
    definitions: many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].SOF, parseDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EOF),
    loc: loc(lexer, start)
  };
}
/**
 * Definition :
 *   - ExecutableDefinition
 *   - TypeSystemDefinition
 *   - TypeSystemExtension
 */


function parseDefinition(lexer) {
  if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME)) {
    switch (lexer.token.value) {
      case 'query':
      case 'mutation':
      case 'subscription':
      case 'fragment':
        return parseExecutableDefinition(lexer);

      case 'schema':
      case 'scalar':
      case 'type':
      case 'interface':
      case 'union':
      case 'enum':
      case 'input':
      case 'directive':
        return parseTypeSystemDefinition(lexer);

      case 'extend':
        return parseTypeSystemExtension(lexer);
    }
  } else if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L)) {
    return parseExecutableDefinition(lexer);
  } else if (peekDescription(lexer)) {
    return parseTypeSystemDefinition(lexer);
  }

  throw unexpected(lexer);
}
/**
 * ExecutableDefinition :
 *   - OperationDefinition
 *   - FragmentDefinition
 */


function parseExecutableDefinition(lexer) {
  if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME)) {
    switch (lexer.token.value) {
      case 'query':
      case 'mutation':
      case 'subscription':
        return parseOperationDefinition(lexer);

      case 'fragment':
        return parseFragmentDefinition(lexer);
    }
  } else if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L)) {
    return parseOperationDefinition(lexer);
  }

  throw unexpected(lexer);
} // Implements the parsing rules in the Operations section.

/**
 * OperationDefinition :
 *  - SelectionSet
 *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
 */


function parseOperationDefinition(lexer) {
  var start = lexer.token;

  if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L)) {
    return {
      kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OPERATION_DEFINITION,
      operation: 'query',
      name: undefined,
      variableDefinitions: [],
      directives: [],
      selectionSet: parseSelectionSet(lexer),
      loc: loc(lexer, start)
    };
  }

  var operation = parseOperationType(lexer);
  var name;

  if (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME)) {
    name = parseName(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OPERATION_DEFINITION,
    operation: operation,
    name: name,
    variableDefinitions: parseVariableDefinitions(lexer),
    directives: parseDirectives(lexer, false),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}
/**
 * OperationType : one of query mutation subscription
 */


function parseOperationType(lexer) {
  var operationToken = expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME);

  switch (operationToken.value) {
    case 'query':
      return 'query';

    case 'mutation':
      return 'mutation';

    case 'subscription':
      return 'subscription';
  }

  throw unexpected(lexer, operationToken);
}
/**
 * VariableDefinitions : ( VariableDefinition+ )
 */


function parseVariableDefinitions(lexer) {
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L, parseVariableDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_R) : [];
}
/**
 * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
 */


function parseVariableDefinition(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].VARIABLE_DEFINITION,
    variable: parseVariable(lexer),
    type: (expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON), parseTypeReference(lexer)),
    defaultValue: expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EQUALS) ? parseValueLiteral(lexer, true) : undefined,
    directives: parseDirectives(lexer, true),
    loc: loc(lexer, start)
  };
}
/**
 * Variable : $ Name
 */


function parseVariable(lexer) {
  var start = lexer.token;
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].DOLLAR);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].VARIABLE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
}
/**
 * SelectionSet : { Selection+ }
 */


function parseSelectionSet(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].SELECTION_SET,
    selections: many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseSelection, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R),
    loc: loc(lexer, start)
  };
}
/**
 * Selection :
 *   - Field
 *   - FragmentSpread
 *   - InlineFragment
 */


function parseSelection(lexer) {
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].SPREAD) ? parseFragment(lexer) : parseField(lexer);
}
/**
 * Field : Alias? Name Arguments? Directives? SelectionSet?
 *
 * Alias : Name :
 */


function parseField(lexer) {
  var start = lexer.token;
  var nameOrAlias = parseName(lexer);
  var alias;
  var name;

  if (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON)) {
    alias = nameOrAlias;
    name = parseName(lexer);
  } else {
    name = nameOrAlias;
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FIELD,
    alias: alias,
    name: name,
    arguments: parseArguments(lexer, false),
    directives: parseDirectives(lexer, false),
    selectionSet: peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) ? parseSelectionSet(lexer) : undefined,
    loc: loc(lexer, start)
  };
}
/**
 * Arguments[Const] : ( Argument[?Const]+ )
 */


function parseArguments(lexer, isConst) {
  var item = isConst ? parseConstArgument : parseArgument;
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L, item, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_R) : [];
}
/**
 * Argument[Const] : Name : Value[?Const]
 */


function parseArgument(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ARGUMENT,
    name: name,
    value: parseValueLiteral(lexer, false),
    loc: loc(lexer, start)
  };
}

function parseConstArgument(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ARGUMENT,
    name: parseName(lexer),
    value: (expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON), parseConstValue(lexer)),
    loc: loc(lexer, start)
  };
} // Implements the parsing rules in the Fragments section.

/**
 * Corresponds to both FragmentSpread and InlineFragment in the spec.
 *
 * FragmentSpread : ... FragmentName Directives?
 *
 * InlineFragment : ... TypeCondition? Directives? SelectionSet
 */


function parseFragment(lexer) {
  var start = lexer.token;
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].SPREAD);
  var hasTypeCondition = expectOptionalKeyword(lexer, 'on');

  if (!hasTypeCondition && peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME)) {
    return {
      kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FRAGMENT_SPREAD,
      name: parseFragmentName(lexer),
      directives: parseDirectives(lexer, false),
      loc: loc(lexer, start)
    };
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INLINE_FRAGMENT,
    typeCondition: hasTypeCondition ? parseNamedType(lexer) : undefined,
    directives: parseDirectives(lexer, false),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}
/**
 * FragmentDefinition :
 *   - fragment FragmentName on TypeCondition Directives? SelectionSet
 *
 * TypeCondition : NamedType
 */


function parseFragmentDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'fragment'); // Experimental support for defining variables within fragments changes
  // the grammar of FragmentDefinition:
  //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

  if (lexer.options.experimentalFragmentVariables) {
    return {
      kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FRAGMENT_DEFINITION,
      name: parseFragmentName(lexer),
      variableDefinitions: parseVariableDefinitions(lexer),
      typeCondition: (expectKeyword(lexer, 'on'), parseNamedType(lexer)),
      directives: parseDirectives(lexer, false),
      selectionSet: parseSelectionSet(lexer),
      loc: loc(lexer, start)
    };
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FRAGMENT_DEFINITION,
    name: parseFragmentName(lexer),
    typeCondition: (expectKeyword(lexer, 'on'), parseNamedType(lexer)),
    directives: parseDirectives(lexer, false),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}
/**
 * FragmentName : Name but not `on`
 */


function parseFragmentName(lexer) {
  if (lexer.token.value === 'on') {
    throw unexpected(lexer);
  }

  return parseName(lexer);
} // Implements the parsing rules in the Values section.

/**
 * Value[Const] :
 *   - [~Const] Variable
 *   - IntValue
 *   - FloatValue
 *   - StringValue
 *   - BooleanValue
 *   - NullValue
 *   - EnumValue
 *   - ListValue[?Const]
 *   - ObjectValue[?Const]
 *
 * BooleanValue : one of `true` `false`
 *
 * NullValue : `null`
 *
 * EnumValue : Name but not `true`, `false` or `null`
 */


function parseValueLiteral(lexer, isConst) {
  var token = lexer.token;

  switch (token.kind) {
    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACKET_L:
      return parseList(lexer, isConst);

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L:
      return parseObject(lexer, isConst);

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].INT:
      lexer.advance();
      return {
        kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INT,
        value: token.value,
        loc: loc(lexer, token)
      };

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].FLOAT:
      lexer.advance();
      return {
        kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FLOAT,
        value: token.value,
        loc: loc(lexer, token)
      };

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].STRING:
    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BLOCK_STRING:
      return parseStringLiteral(lexer);

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME:
      if (token.value === 'true' || token.value === 'false') {
        lexer.advance();
        return {
          kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].BOOLEAN,
          value: token.value === 'true',
          loc: loc(lexer, token)
        };
      } else if (token.value === 'null') {
        lexer.advance();
        return {
          kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].NULL,
          loc: loc(lexer, token)
        };
      }

      lexer.advance();
      return {
        kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ENUM,
        value: token.value,
        loc: loc(lexer, token)
      };

    case _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].DOLLAR:
      if (!isConst) {
        return parseVariable(lexer);
      }

      break;
  }

  throw unexpected(lexer);
}

function parseStringLiteral(lexer) {
  var token = lexer.token;
  lexer.advance();
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].STRING,
    value: token.value,
    block: token.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BLOCK_STRING,
    loc: loc(lexer, token)
  };
}

function parseConstValue(lexer) {
  return parseValueLiteral(lexer, true);
}

function parseValueValue(lexer) {
  return parseValueLiteral(lexer, false);
}
/**
 * ListValue[Const] :
 *   - [ ]
 *   - [ Value[?Const]+ ]
 */


function parseList(lexer, isConst) {
  var start = lexer.token;
  var item = isConst ? parseConstValue : parseValueValue;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].LIST,
    values: any(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACKET_L, item, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACKET_R),
    loc: loc(lexer, start)
  };
}
/**
 * ObjectValue[Const] :
 *   - { }
 *   - { ObjectField[?Const]+ }
 */


function parseObject(lexer, isConst) {
  var start = lexer.token;

  var item = function item() {
    return parseObjectField(lexer, isConst);
  };

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OBJECT,
    fields: any(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, item, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R),
    loc: loc(lexer, start)
  };
}
/**
 * ObjectField[Const] : Name : Value[?Const]
 */


function parseObjectField(lexer, isConst) {
  var start = lexer.token;
  var name = parseName(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OBJECT_FIELD,
    name: name,
    value: parseValueLiteral(lexer, isConst),
    loc: loc(lexer, start)
  };
} // Implements the parsing rules in the Directives section.

/**
 * Directives[Const] : Directive[?Const]+
 */


function parseDirectives(lexer, isConst) {
  var directives = [];

  while (peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].AT)) {
    directives.push(parseDirective(lexer, isConst));
  }

  return directives;
}
/**
 * Directive[Const] : @ Name Arguments[?Const]?
 */


function parseDirective(lexer, isConst) {
  var start = lexer.token;
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].AT);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].DIRECTIVE,
    name: parseName(lexer),
    arguments: parseArguments(lexer, isConst),
    loc: loc(lexer, start)
  };
} // Implements the parsing rules in the Types section.

/**
 * Type :
 *   - NamedType
 *   - ListType
 *   - NonNullType
 */


function parseTypeReference(lexer) {
  var start = lexer.token;
  var type;

  if (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACKET_L)) {
    type = parseTypeReference(lexer);
    expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACKET_R);
    type = {
      kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].LIST_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  } else {
    type = parseNamedType(lexer);
  }

  if (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BANG)) {
    return {
      kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].NON_NULL_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  }

  return type;
}
/**
 * NamedType : Name
 */

function parseNamedType(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].NAMED_TYPE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
} // Implements the parsing rules in the Type Definition section.

/**
 * TypeSystemDefinition :
 *   - SchemaDefinition
 *   - TypeDefinition
 *   - DirectiveDefinition
 *
 * TypeDefinition :
 *   - ScalarTypeDefinition
 *   - ObjectTypeDefinition
 *   - InterfaceTypeDefinition
 *   - UnionTypeDefinition
 *   - EnumTypeDefinition
 *   - InputObjectTypeDefinition
 */

function parseTypeSystemDefinition(lexer) {
  // Many definitions begin with a description and require a lookahead.
  var keywordToken = peekDescription(lexer) ? lexer.lookahead() : lexer.token;

  if (keywordToken.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME) {
    switch (keywordToken.value) {
      case 'schema':
        return parseSchemaDefinition(lexer);

      case 'scalar':
        return parseScalarTypeDefinition(lexer);

      case 'type':
        return parseObjectTypeDefinition(lexer);

      case 'interface':
        return parseInterfaceTypeDefinition(lexer);

      case 'union':
        return parseUnionTypeDefinition(lexer);

      case 'enum':
        return parseEnumTypeDefinition(lexer);

      case 'input':
        return parseInputObjectTypeDefinition(lexer);

      case 'directive':
        return parseDirectiveDefinition(lexer);
    }
  }

  throw unexpected(lexer, keywordToken);
}

function peekDescription(lexer) {
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].STRING) || peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BLOCK_STRING);
}
/**
 * Description : StringValue
 */


function parseDescription(lexer) {
  if (peekDescription(lexer)) {
    return parseStringLiteral(lexer);
  }
}
/**
 * SchemaDefinition : schema Directives[Const]? { OperationTypeDefinition+ }
 */


function parseSchemaDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'schema');
  var directives = parseDirectives(lexer, true);
  var operationTypes = many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseOperationTypeDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].SCHEMA_DEFINITION,
    directives: directives,
    operationTypes: operationTypes,
    loc: loc(lexer, start)
  };
}
/**
 * OperationTypeDefinition : OperationType : NamedType
 */


function parseOperationTypeDefinition(lexer) {
  var start = lexer.token;
  var operation = parseOperationType(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON);
  var type = parseNamedType(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OPERATION_TYPE_DEFINITION,
    operation: operation,
    type: type,
    loc: loc(lexer, start)
  };
}
/**
 * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
 */


function parseScalarTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'scalar');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].SCALAR_TYPE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}
/**
 * ObjectTypeDefinition :
 *   Description?
 *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
 */


function parseObjectTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'type');
  var name = parseName(lexer);
  var interfaces = parseImplementsInterfaces(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseFieldsDefinition(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OBJECT_TYPE_DEFINITION,
    description: description,
    name: name,
    interfaces: interfaces,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * ImplementsInterfaces :
 *   - implements `&`? NamedType
 *   - ImplementsInterfaces & NamedType
 */


function parseImplementsInterfaces(lexer) {
  var types = [];

  if (expectOptionalKeyword(lexer, 'implements')) {
    // Optional leading ampersand
    expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].AMP);

    do {
      types.push(parseNamedType(lexer));
    } while (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].AMP) || // Legacy support for the SDL?
    lexer.options.allowLegacySDLImplementsInterfaces && peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME));
  }

  return types;
}
/**
 * FieldsDefinition : { FieldDefinition+ }
 */


function parseFieldsDefinition(lexer) {
  // Legacy support for the SDL?
  if (lexer.options.allowLegacySDLEmptyFields && peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) && lexer.lookahead().kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R) {
    lexer.advance();
    lexer.advance();
    return [];
  }

  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseFieldDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R) : [];
}
/**
 * FieldDefinition :
 *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
 */


function parseFieldDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON);
  var type = parseTypeReference(lexer);
  var directives = parseDirectives(lexer, true);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].FIELD_DEFINITION,
    description: description,
    name: name,
    arguments: args,
    type: type,
    directives: directives,
    loc: loc(lexer, start)
  };
}
/**
 * ArgumentsDefinition : ( InputValueDefinition+ )
 */


function parseArgumentDefs(lexer) {
  if (!peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L)) {
    return [];
  }

  return many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_L, parseInputValueDef, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PAREN_R);
}
/**
 * InputValueDefinition :
 *   - Description? Name : Type DefaultValue? Directives[Const]?
 */


function parseInputValueDef(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  var name = parseName(lexer);
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].COLON);
  var type = parseTypeReference(lexer);
  var defaultValue;

  if (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EQUALS)) {
    defaultValue = parseConstValue(lexer);
  }

  var directives = parseDirectives(lexer, true);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INPUT_VALUE_DEFINITION,
    description: description,
    name: name,
    type: type,
    defaultValue: defaultValue,
    directives: directives,
    loc: loc(lexer, start)
  };
}
/**
 * InterfaceTypeDefinition :
 *   - Description? interface Name Directives[Const]? FieldsDefinition?
 */


function parseInterfaceTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'interface');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseFieldsDefinition(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INTERFACE_TYPE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * UnionTypeDefinition :
 *   - Description? union Name Directives[Const]? UnionMemberTypes?
 */


function parseUnionTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'union');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var types = parseUnionMemberTypes(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].UNION_TYPE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    types: types,
    loc: loc(lexer, start)
  };
}
/**
 * UnionMemberTypes :
 *   - = `|`? NamedType
 *   - UnionMemberTypes | NamedType
 */


function parseUnionMemberTypes(lexer) {
  var types = [];

  if (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].EQUALS)) {
    // Optional leading pipe
    expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PIPE);

    do {
      types.push(parseNamedType(lexer));
    } while (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PIPE));
  }

  return types;
}
/**
 * EnumTypeDefinition :
 *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
 */


function parseEnumTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'enum');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var values = parseEnumValuesDefinition(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ENUM_TYPE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    values: values,
    loc: loc(lexer, start)
  };
}
/**
 * EnumValuesDefinition : { EnumValueDefinition+ }
 */


function parseEnumValuesDefinition(lexer) {
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseEnumValueDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R) : [];
}
/**
 * EnumValueDefinition : Description? EnumValue Directives[Const]?
 *
 * EnumValue : Name
 */


function parseEnumValueDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ENUM_VALUE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}
/**
 * InputObjectTypeDefinition :
 *   - Description? input Name Directives[Const]? InputFieldsDefinition?
 */


function parseInputObjectTypeDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'input');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseInputFieldsDefinition(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INPUT_OBJECT_TYPE_DEFINITION,
    description: description,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * InputFieldsDefinition : { InputValueDefinition+ }
 */


function parseInputFieldsDefinition(lexer) {
  return peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseInputValueDef, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R) : [];
}
/**
 * TypeSystemExtension :
 *   - SchemaExtension
 *   - TypeExtension
 *
 * TypeExtension :
 *   - ScalarTypeExtension
 *   - ObjectTypeExtension
 *   - InterfaceTypeExtension
 *   - UnionTypeExtension
 *   - EnumTypeExtension
 *   - InputObjectTypeDefinition
 */


function parseTypeSystemExtension(lexer) {
  var keywordToken = lexer.lookahead();

  if (keywordToken.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME) {
    switch (keywordToken.value) {
      case 'schema':
        return parseSchemaExtension(lexer);

      case 'scalar':
        return parseScalarTypeExtension(lexer);

      case 'type':
        return parseObjectTypeExtension(lexer);

      case 'interface':
        return parseInterfaceTypeExtension(lexer);

      case 'union':
        return parseUnionTypeExtension(lexer);

      case 'enum':
        return parseEnumTypeExtension(lexer);

      case 'input':
        return parseInputObjectTypeExtension(lexer);
    }
  }

  throw unexpected(lexer, keywordToken);
}
/**
 * SchemaExtension :
 *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
 *  - extend schema Directives[Const]
 */


function parseSchemaExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'schema');
  var directives = parseDirectives(lexer, true);
  var operationTypes = peek(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L) ? many(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_L, parseOperationTypeDefinition, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].BRACE_R) : [];

  if (directives.length === 0 && operationTypes.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].SCHEMA_EXTENSION,
    directives: directives,
    operationTypes: operationTypes,
    loc: loc(lexer, start)
  };
}
/**
 * ScalarTypeExtension :
 *   - extend scalar Name Directives[Const]
 */


function parseScalarTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'scalar');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);

  if (directives.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].SCALAR_TYPE_EXTENSION,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}
/**
 * ObjectTypeExtension :
 *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
 *  - extend type Name ImplementsInterfaces? Directives[Const]
 *  - extend type Name ImplementsInterfaces
 */


function parseObjectTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'type');
  var name = parseName(lexer);
  var interfaces = parseImplementsInterfaces(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseFieldsDefinition(lexer);

  if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].OBJECT_TYPE_EXTENSION,
    name: name,
    interfaces: interfaces,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * InterfaceTypeExtension :
 *   - extend interface Name Directives[Const]? FieldsDefinition
 *   - extend interface Name Directives[Const]
 */


function parseInterfaceTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'interface');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseFieldsDefinition(lexer);

  if (directives.length === 0 && fields.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INTERFACE_TYPE_EXTENSION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * UnionTypeExtension :
 *   - extend union Name Directives[Const]? UnionMemberTypes
 *   - extend union Name Directives[Const]
 */


function parseUnionTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'union');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var types = parseUnionMemberTypes(lexer);

  if (directives.length === 0 && types.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].UNION_TYPE_EXTENSION,
    name: name,
    directives: directives,
    types: types,
    loc: loc(lexer, start)
  };
}
/**
 * EnumTypeExtension :
 *   - extend enum Name Directives[Const]? EnumValuesDefinition
 *   - extend enum Name Directives[Const]
 */


function parseEnumTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'enum');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var values = parseEnumValuesDefinition(lexer);

  if (directives.length === 0 && values.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].ENUM_TYPE_EXTENSION,
    name: name,
    directives: directives,
    values: values,
    loc: loc(lexer, start)
  };
}
/**
 * InputObjectTypeExtension :
 *   - extend input Name Directives[Const]? InputFieldsDefinition
 *   - extend input Name Directives[Const]
 */


function parseInputObjectTypeExtension(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  expectKeyword(lexer, 'input');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer, true);
  var fields = parseInputFieldsDefinition(lexer);

  if (directives.length === 0 && fields.length === 0) {
    throw unexpected(lexer);
  }

  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].INPUT_OBJECT_TYPE_EXTENSION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}
/**
 * DirectiveDefinition :
 *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
 */


function parseDirectiveDefinition(lexer) {
  var start = lexer.token;
  var description = parseDescription(lexer);
  expectKeyword(lexer, 'directive');
  expectToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].AT);
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  var repeatable = expectOptionalKeyword(lexer, 'repeatable');
  expectKeyword(lexer, 'on');
  var locations = parseDirectiveLocations(lexer);
  return {
    kind: _kinds__WEBPACK_IMPORTED_MODULE_6__["Kind"].DIRECTIVE_DEFINITION,
    description: description,
    name: name,
    arguments: args,
    repeatable: repeatable,
    locations: locations,
    loc: loc(lexer, start)
  };
}
/**
 * DirectiveLocations :
 *   - `|`? DirectiveLocation
 *   - DirectiveLocations | DirectiveLocation
 */


function parseDirectiveLocations(lexer) {
  // Optional leading pipe
  expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PIPE);
  var locations = [];

  do {
    locations.push(parseDirectiveLocation(lexer));
  } while (expectOptionalToken(lexer, _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].PIPE));

  return locations;
}
/*
 * DirectiveLocation :
 *   - ExecutableDirectiveLocation
 *   - TypeSystemDirectiveLocation
 *
 * ExecutableDirectiveLocation : one of
 *   `QUERY`
 *   `MUTATION`
 *   `SUBSCRIPTION`
 *   `FIELD`
 *   `FRAGMENT_DEFINITION`
 *   `FRAGMENT_SPREAD`
 *   `INLINE_FRAGMENT`
 *
 * TypeSystemDirectiveLocation : one of
 *   `SCHEMA`
 *   `SCALAR`
 *   `OBJECT`
 *   `FIELD_DEFINITION`
 *   `ARGUMENT_DEFINITION`
 *   `INTERFACE`
 *   `UNION`
 *   `ENUM`
 *   `ENUM_VALUE`
 *   `INPUT_OBJECT`
 *   `INPUT_FIELD_DEFINITION`
 */


function parseDirectiveLocation(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);

  if (_directiveLocation__WEBPACK_IMPORTED_MODULE_7__["DirectiveLocation"][name.value] !== undefined) {
    return name;
  }

  throw unexpected(lexer, start);
} // Core parsing utility functions

/**
 * Returns a location object, used to identify the place in
 * the source that created a given parsed object.
 */


function loc(lexer, startToken) {
  if (!lexer.options.noLocation) {
    return new Loc(startToken, lexer.lastToken, lexer.source);
  }
}

function Loc(startToken, endToken, source) {
  this.start = startToken.start;
  this.end = endToken.end;
  this.startToken = startToken;
  this.endToken = endToken;
  this.source = source;
} // Print a simplified form when appearing in JSON/util.inspect.


Object(_jsutils_defineToJSON__WEBPACK_IMPORTED_MODULE_1__["default"])(Loc, function () {
  return {
    start: this.start,
    end: this.end
  };
});
/**
 * Determines if the next token is of a given kind
 */

function peek(lexer, kind) {
  return lexer.token.kind === kind;
}
/**
 * If the next token is of the given kind, return that token after advancing
 * the lexer. Otherwise, do not change the parser state and throw an error.
 */


function expectToken(lexer, kind) {
  var token = lexer.token;

  if (token.kind === kind) {
    lexer.advance();
    return token;
  }

  throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_3__["syntaxError"])(lexer.source, token.start, "Expected ".concat(kind, ", found ").concat(Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["getTokenDesc"])(token)));
}
/**
 * If the next token is of the given kind, return that token after advancing
 * the lexer. Otherwise, do not change the parser state and return undefined.
 */


function expectOptionalToken(lexer, kind) {
  var token = lexer.token;

  if (token.kind === kind) {
    lexer.advance();
    return token;
  }

  return undefined;
}
/**
 * If the next token is a given keyword, advance the lexer.
 * Otherwise, do not change the parser state and throw an error.
 */


function expectKeyword(lexer, value) {
  var token = lexer.token;

  if (token.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME && token.value === value) {
    lexer.advance();
  } else {
    throw Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_3__["syntaxError"])(lexer.source, token.start, "Expected \"".concat(value, "\", found ").concat(Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["getTokenDesc"])(token)));
  }
}
/**
 * If the next token is a given keyword, return "true" after advancing
 * the lexer. Otherwise, do not change the parser state and return "false".
 */


function expectOptionalKeyword(lexer, value) {
  var token = lexer.token;

  if (token.kind === _tokenKind__WEBPACK_IMPORTED_MODULE_4__["TokenKind"].NAME && token.value === value) {
    lexer.advance();
    return true;
  }

  return false;
}
/**
 * Helper function for creating an error when an unexpected lexed token
 * is encountered.
 */


function unexpected(lexer, atToken) {
  var token = atToken || lexer.token;
  return Object(_error_syntaxError__WEBPACK_IMPORTED_MODULE_3__["syntaxError"])(lexer.source, token.start, "Unexpected ".concat(Object(_lexer__WEBPACK_IMPORTED_MODULE_5__["getTokenDesc"])(token)));
}
/**
 * Returns a possibly empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */


function any(lexer, openKind, parseFn, closeKind) {
  expectToken(lexer, openKind);
  var nodes = [];

  while (!expectOptionalToken(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }

  return nodes;
}
/**
 * Returns a non-empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */


function many(lexer, openKind, parseFn, closeKind) {
  expectToken(lexer, openKind);
  var nodes = [parseFn(lexer)];

  while (!expectOptionalToken(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }

  return nodes;
}


/***/ }),

/***/ "./node_modules/graphql/language/printLocation.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/graphql/language/printLocation.mjs ***!
  \*********************************************************/
/*! exports provided: printLocation, printSourceLocation */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printLocation", function() { return printLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printSourceLocation", function() { return printSourceLocation; });
/* harmony import */ var _language_location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../language/location */ "./node_modules/graphql/language/location.mjs");

/**
 * Render a helpful description of the location in the GraphQL Source document.
 */

function printLocation(location) {
  return printSourceLocation(location.source, Object(_language_location__WEBPACK_IMPORTED_MODULE_0__["getLocation"])(location.source, location.start));
}
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */

function printSourceLocation(source, sourceLocation) {
  var firstLineColumnOffset = source.locationOffset.column - 1;
  var body = whitespace(firstLineColumnOffset) + source.body;
  var lineIndex = sourceLocation.line - 1;
  var lineOffset = source.locationOffset.line - 1;
  var lineNum = sourceLocation.line + lineOffset;
  var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  var columnNum = sourceLocation.column + columnOffset;
  var locationStr = "".concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
  var lines = body.split(/\r\n|[\n\r]/g);
  var locationLine = lines[lineIndex]; // Special case for minified documents

  if (locationLine.length > 120) {
    var sublineIndex = Math.floor(columnNum / 80);
    var sublineColumnNum = columnNum % 80;
    var sublines = [];

    for (var i = 0; i < locationLine.length; i += 80) {
      sublines.push(locationLine.slice(i, i + 80));
    }

    return locationStr + printPrefixedLines([["".concat(lineNum), sublines[0]]].concat(sublines.slice(1, sublineIndex + 1).map(function (subline) {
      return ['', subline];
    }), [[' ', whitespace(sublineColumnNum - 1) + '^'], ['', sublines[sublineIndex + 1]]]));
  }

  return locationStr + printPrefixedLines([// Lines specified like this: ["prefix", "string"],
  ["".concat(lineNum - 1), lines[lineIndex - 1]], ["".concat(lineNum), locationLine], ['', whitespace(columnNum - 1) + '^'], ["".concat(lineNum + 1), lines[lineIndex + 1]]]);
}

function printPrefixedLines(lines) {
  var existingLines = lines.filter(function (_ref) {
    var _ = _ref[0],
        line = _ref[1];
    return line !== undefined;
  });
  var padLen = Math.max.apply(Math, existingLines.map(function (_ref2) {
    var prefix = _ref2[0];
    return prefix.length;
  }));
  return existingLines.map(function (_ref3) {
    var prefix = _ref3[0],
        line = _ref3[1];
    return lpad(padLen, prefix) + ' | ' + line;
  }).join('\n');
}

function whitespace(len) {
  return Array(len + 1).join(' ');
}

function lpad(len, str) {
  return whitespace(len - str.length) + str;
}


/***/ }),

/***/ "./node_modules/graphql/language/source.mjs":
/*!**************************************************!*\
  !*** ./node_modules/graphql/language/source.mjs ***!
  \**************************************************/
/*! exports provided: Source */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Source", function() { return Source; });
/* harmony import */ var _jsutils_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsutils/invariant */ "./node_modules/graphql/jsutils/invariant.mjs");
/* harmony import */ var _jsutils_defineToStringTag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsutils/defineToStringTag */ "./node_modules/graphql/jsutils/defineToStringTag.mjs");



/**
 * A representation of source input to GraphQL.
 * `name` and `locationOffset` are optional. They are useful for clients who
 * store GraphQL documents in source files; for example, if the GraphQL input
 * starts at line 40 in a file named Foo.graphql, it might be useful for name to
 * be "Foo.graphql" and location to be `{ line: 40, column: 0 }`.
 * line and column in locationOffset are 1-indexed
 */
var Source = function Source(body, name, locationOffset) {
  this.body = body;
  this.name = name || 'GraphQL request';
  this.locationOffset = locationOffset || {
    line: 1,
    column: 1
  };
  !(this.locationOffset.line > 0) ? Object(_jsutils_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(0, 'line in locationOffset is 1-indexed and must be positive') : void 0;
  !(this.locationOffset.column > 0) ? Object(_jsutils_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(0, 'column in locationOffset is 1-indexed and must be positive') : void 0;
}; // Conditionally apply `[Symbol.toStringTag]` if `Symbol`s are supported

Object(_jsutils_defineToStringTag__WEBPACK_IMPORTED_MODULE_1__["default"])(Source);


/***/ }),

/***/ "./node_modules/graphql/language/tokenKind.mjs":
/*!*****************************************************!*\
  !*** ./node_modules/graphql/language/tokenKind.mjs ***!
  \*****************************************************/
/*! exports provided: TokenKind */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenKind", function() { return TokenKind; });
/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */
var TokenKind = Object.freeze({
  SOF: '<SOF>',
  EOF: '<EOF>',
  BANG: '!',
  DOLLAR: '$',
  AMP: '&',
  PAREN_L: '(',
  PAREN_R: ')',
  SPREAD: '...',
  COLON: ':',
  EQUALS: '=',
  AT: '@',
  BRACKET_L: '[',
  BRACKET_R: ']',
  BRACE_L: '{',
  PIPE: '|',
  BRACE_R: '}',
  NAME: 'Name',
  INT: 'Int',
  FLOAT: 'Float',
  STRING: 'String',
  BLOCK_STRING: 'BlockString',
  COMMENT: 'Comment'
});
/**
 * The enum type representing the token kinds values.
 */


/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.html":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.html ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span>\n    <h5>Challenges</h5>\n    <p>Challenges are the different tests that the community uses to benchmark their participants within a benchmarking event</p>\n    <p><b>Summary Table across all challenges in the Event</b></p>\n    \n    <div>      \n\n        <div class=\"oeb-table\" attr.data-benchmarkingevent=\"{{beventsid}}\" data-mode=\"dev\"></div>\n        <br>             \n        <button mat-raised-button type=\"submit\" (click)='filterChallenges()' matTooltip=\"Reload chart after selecting Challenges\"\n        matTooltipPosition=\"right\">Reload chart</button>\n    </div>\n    \n</span>\n<br>\n<span *ngIf='challengeGraphql; else loading'>\n    <br>\n    <br>\n    <p><b>Benchmarking Challenges List</b></p>\n    <hr>\n\n    <br>\n    <span *ngIf='challengeGraphql; else loading'>\n        <table datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"challengeTrigger\" class=\"row-border hover\">\n        <thead>\n            <tr>\n            <th> <ng-container [ngTemplateOutlet]=\"selectAll\"></ng-container></th>\n            <th>Acronym( Chart )</th>\n            <th>Name</th>\n            \n            </tr>\n        </thead>\n        <tbody>\n            <tr *ngFor=\"let b of challengeGraphql.getChallenges\">\n                <td><mat-checkbox color=\"primary\"  id=\"{{b._id}}\" value=\"{{b._id}}\" (change)=\"toogle($event, b._id)\"></mat-checkbox></td>\n                <td><a routerLink=\"{{b._id}}\" name=\"{{b._id}}\" matTooltip=\"{{b._id}}\" matTooltipPosition=\"right\">[{{b.acronym}}]</a></td>\n                <td>{{ b.name}}</td>\n                \n            <!-- <td>{{ d.type }}</td> -->\n            </tr>\n        </tbody>\n        </table>\n        \n        <!-- <p> here : {{selectedChallenges}}</p> -->\n    </span>\n\n\n<!-- <mat-paginator [length]=length [pageIndex]=pageIndex [pageSize]=pageSize [pageSizeOptions]=[10,20] (page)=\"changePage($event)\">\n        </mat-paginator> -->\n\n\n\n\n\n\n</span>\n\n\n\n\n<ng-template #loading>loading...</ng-template>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-detail/benchmarking-detail.component.html":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/scientific/benchmarking-detail/benchmarking-detail.component.html ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span *ngIf=\"challengesGraphql; else loading\">\n    <span *ngFor=\"let c of challengesGraphql.getChallenges\">\n        <div>\n            <h3>{{c.name}} ( {{c.acronym}} )</h3>\n        </div>\n        <hr>\n        <p>\n            In order to facilitate the interpretation of benchmarking results OpenEbench offers several ways to visualize metrics: <br>\n            In this 2D plot two metrics from challenge ({{c.acronym}}) are represented in the X and Y axis, showing the results from the participants in this challenge.\n            The gray line represents the pareto frontier, which runs over the participants showing the best efficiency and the arrow in the plot represents the optimal corner.\n            <br>\n            The blue selection list can be used to switch between the different classification methods / visualization modes (square quartiles, diagonal quartiles and k-means clustering) \n            Along with the chart these results are also transformed to a table which separates the participants in different groups.\n\n        </p>\n\n        <p>{{c.metrics_categories[1][metrics_id]}}</p>\n        <div class=\"break\">\n            <div attr.data-id=\"{{c._id}}\" attr.metric_x=\"{{c.metrics_categories[0].metrics[0].metrics_id}}\"\n                attr.metric_y=\"{{c.metrics_categories[0].metrics[1].metrics_id}}\" data-mode=\"dev\" toTable=\"true\" class=\"benchmarkingChart\" ></div>\n        </div>\n    </span>\n\n\n</span>\n<ng-template #loading>loading...</ng-template>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-list/benchmarking-list.component.html":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/scientific/benchmarking-list/benchmarking-list.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span *ngIf='communitiesGraphql; else loading'>\n  <div *ngFor=\"let c of communitiesGraphql.getCommunities\">\n    <h3>\n      {{c.name}} ( {{c.acronym}} )\n    </h3>\n    <p>\n      {{c.description}}\n    </p>\n  </div>\n\n\n</span>\n<mat-tab-group>\n    <mat-tab label=\"Benchmarking Events\" style=\"background-color: rgb(167, 42, 42)\">\n        <br>\n        <h3>Benchmarking Event</h3>\n        <p>\n            A benchmarking event corresponds to a benchmarking experiment which is held at a certain date. It starts when the organizing community opens one or more challenges by providing participants with some input data and allows to submit their predictions.\n            Once the event is closed, the benchmark is performed and the metrics are computed. This usually occurs, recursively (every week,month and year...)\n        </p>\n        <span *ngIf='bEventsGraphql; else loading'>\n      <!-- <span *ngIf=\"tools.length!=0; else toolNotFound\"> -->\n      <mat-accordion>\n        <mat-expansion-panel *ngFor=\"let b of bEventsGraphql.getBenchmarkingEvents\" >\n            <!-- (opened)=\"openChallenges(b._id)\" -->\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n              <!-- <a class=\"left\" routerLink=\"{{b._id}}\" name=\"{{b._id}}\" matTooltip=\"{{b._id}} details\"\n                  matTooltipPosition=\"right\">{{b.name}}</a> -->\n              {{b.name}}\n            </mat-panel-title>\n            <mat-panel-description>\n              <span class=\"right\" *ngIf=\"b.challenges\">challenges : {{b.challenges.length}}</span>\n        </mat-panel-description>\n        </mat-expansion-panel-header>\n        <!-- <router-outlet [testid]=\"b._id\"></router-outlet> -->\n        <app-benchmarking-challenge-list [beventsid]=\"b._id\"></app-benchmarking-challenge-list>\n        </mat-expansion-panel>\n        </mat-accordion>\n        </span>\n    </mat-tab>\n    <mat-tab label=\"Datasets\">\n        <br>\n        <h3>Datasets</h3>\n        <p>\n            There are four types of datasets considered in OpenEBench:\n        </p>\n        <ul>\n            <li> <b>Input datasets</b> are provided by the community for the participants to test their methods/tools.</li>\n            <li><b>Reference datasets</b> are the Gold Standard datasets that are also provided by the community but are not visible.\n            </li>\n            <li><b>Participant datasets</b> are uploaded by the participants to be benchmarked against the reference datasets.</li>\n            <li><b>Assessment datasets</b> contain information about the results of metrics applied to a certain prediction.</li>\n            <li><b>Aggregation datasets</b> are obtained by summarizing or computing statistics on assessment datasets.</li>\n        </ul>\n        <br>\n\n        <span *ngIf='datasetsGraphql; else loading'>\n      <table datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"datasetTrigger\" class=\"row-border hover\">\n        <thead>\n          <tr>\n            <th>Name</th>\n            <th>Type</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let d of datasetsGraphql.getDatasets\">\n            <td>{{ d.name }}</td>\n            <td>{{ d.type }}</td>\n          </tr>\n        </tbody>\n      </table>\n    </span>\n    </mat-tab>\n    <mat-tab label=\"Participants\">\n        <br>\n        <h3>Participants</h3>\n        <p>\n            Participants are the users who upload their predictions to take part in the benchmarking event.\n        </p>\n        <span *ngIf='toolsGraphql; else loading'>\n      <table datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"toolTrigger\" class=\"row-border hover\">\n        <thead>\n          <tr>\n            <th>Name</th>\n            <th>Description</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let t of toolsGraphql.getTools\">\n            <td>{{ t.name }}</td>\n            <td>{{ t.description }}</td>\n          </tr>\n        </tbody>\n      </table>\n    </span>\n        <!-- </span> -->\n    </mat-tab>\n</mat-tab-group>\n\n<ng-template #loading>loading...</ng-template>\n<ng-template #notfound>Event not found</ng-template>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/scientific/scientific-list/scientific-list.component.html":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/scientific/scientific-list/scientific-list.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"menu-margin\">\n\n\n    <p>Unbiased and objective evaluations of bioinformatics resources are challenging to set up and can only be effective when built and implemented around community driven efforts. Thus, in <b>OpenEBench</b> we gather several community initiatives which\n        establish standards and automated services to facilitate scientific benchmarking.</p>\n    <p>These efforts provide a way for software developers to implement more efficient methods, tools and web services by comparing their performance on previously agreed datasets and metrics with other similar resources and, more importantly, help end-users\n        that tend to have difficulties in choosing the right tool for the problem at hand, and are not necessarily aware of the latest developments in each of the fields of the bioinformatics methods they need to use.</p>\n\n\n    <h3>Communities</h3>\n\n    <span class=\"flex-container\" *ngIf='communitiesGraphql; else loading'>\n\n    <mat-card *ngFor=\"let c of communitiesGraphql.getCommunities\" class=\"communities-card\">\n\n      <mat-card-actions>\n        <p><a routerLink=\"{{c._id}}\" name=\"{{c._id}}\" matTooltip=\"{{c._id}} details\"\n            matTooltipPosition=\"right\">{{c.acronym}}</a></p>\n        <mat-card-subtitle>{{c.name}}</mat-card-subtitle>\n        <!-- <p><a target='_blank' href=\"{{c.links[0].uri}}\">Website</a></p> -->\n        <span *ngIf=\"c.links\">\n          <span *ngFor=\"let link of c.links\">\n            <span *ngIf=\"link.label !='other'\"><a target='_blank' href=\"{{link.uri}}\">{{link.label}} </a></span><br>\n    <span *ngIf=\"link.label =='other'\"><img src=\"{{link.uri}}\" alt=\"\" width=\"100\"></span>\n    </span>\n    </span>\n\n    <!-- <button mat-button>SHARE</button> -->\n\n    </mat-card-actions>\n    </mat-card>\n\n    </span>\n</div>\n\n\n\n\n<ng-template #loading>loading...</ng-template>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/scientific/scientific.component.html":
/*!********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/scientific/scientific.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.css":
/*!**************************************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.css ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NjaWVudGlmaWMvYmVuY2htYXJraW5nLWNoYWxsZW5nZS1saXN0L2JlbmNobWFya2luZy1jaGFsbGVuZ2UtbGlzdC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.ts":
/*!*************************************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.ts ***!
  \*************************************************************************************************/
/*! exports provided: BenchmarkingChallengeListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BenchmarkingChallengeListComponent", function() { return BenchmarkingChallengeListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _shared_benchmarkingTable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/benchmarkingTable.js */ "./src/app/scientific/shared/benchmarkingTable.js");
/* harmony import */ var _shared_benchmarkingTable_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shared_benchmarkingTable_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var apollo_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apollo-angular */ "./node_modules/apollo-angular/fesm2015/ng.apollo.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");








/**
 * benchmarking challenge list component
 */
let BenchmarkingChallengeListComponent = class BenchmarkingChallengeListComponent {
    /**
     * constructor
     */
    constructor(route, formBuilder, apollo) {
        this.route = route;
        this.formBuilder = formBuilder;
        this.apollo = apollo;
        this.challengeTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_7__["Subject"]();
        this.dtOptions = {};
        this.getChallenges = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default.a `
  query getChallenges($benchmarking_event_id: String!){
    getChallenges(challengeFilters:{benchmarking_event_id: $benchmarking_event_id}) {
     _id
     name
     orig_id
     acronym
    }
  }
`;
        /**
         * loading property for graphql
         */
        this.loading = true;
    }
    /**
     * initializer
     */
    ngOnInit() {
        this.selectedChallenges = [];
        // console.log(this.testid);
        // this.beventsid = this.getParam('beventsid');
        this.apollo.watchQuery({
            query: this.getChallenges,
            variables: { benchmarking_event_id: this.beventsid }
        })
            .valueChanges.subscribe(result => {
            this.challengeGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
            setTimeout(() => {
                this.challengeTrigger.next();
            });
        });
    }
    /**
     * toogle sellec<
     */
    toogle(event, value) {
        if (event.checked) {
            this.selectedChallenges.push(value);
        }
        if (!event.checked) {
            const index = this.selectedChallenges.indexOf(value);
            if (index > -1) {
                this.selectedChallenges.splice(index, 1);
            }
        }
        const div = $('.oeb-table').attr('data-benchmarkingevent');
        this.classifier = div + '0';
    }
    filterChallenges() {
        Object(_shared_benchmarkingTable_js__WEBPACK_IMPORTED_MODULE_3__["run_summary_table"])(this.selectedChallenges, this.classifier);
    }
    /**
     * after view init life cycle
     */
    ngAfterViewInit() {
        setTimeout(() => {
            Object(_shared_benchmarkingTable_js__WEBPACK_IMPORTED_MODULE_3__["run_summary_table"])();
        }, 1000);
    }
    deselectAll() {
        this.selectedChallenges = [];
    }
    /**
     * helper method to get params
     */
    getParam(param) {
        return this.route.snapshot.paramMap.get(param);
    }
};
BenchmarkingChallengeListComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"] },
    { type: apollo_angular__WEBPACK_IMPORTED_MODULE_5__["Apollo"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
], BenchmarkingChallengeListComponent.prototype, "beventsid", void 0);
BenchmarkingChallengeListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-benchmarking-challenge-list',
        template: __webpack_require__(/*! raw-loader!./benchmarking-challenge-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.html"),
        styles: [__webpack_require__(/*! ./benchmarking-challenge-list.component.css */ "./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.css")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
        apollo_angular__WEBPACK_IMPORTED_MODULE_5__["Apollo"]])
], BenchmarkingChallengeListComponent);



/***/ }),

/***/ "./src/app/scientific/benchmarking-detail/benchmarking-detail.component.css":
/*!**********************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-detail/benchmarking-detail.component.css ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* .break {\n    margin: 0 -20% 0 -20%;\n} */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2NpZW50aWZpYy9iZW5jaG1hcmtpbmctZGV0YWlsL2JlbmNobWFya2luZy1kZXRhaWwuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRyIsImZpbGUiOiJzcmMvYXBwL3NjaWVudGlmaWMvYmVuY2htYXJraW5nLWRldGFpbC9iZW5jaG1hcmtpbmctZGV0YWlsLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAuYnJlYWsge1xuICAgIG1hcmdpbjogMCAtMjAlIDAgLTIwJTtcbn0gKi8iXX0= */"

/***/ }),

/***/ "./src/app/scientific/benchmarking-detail/benchmarking-detail.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-detail/benchmarking-detail.component.ts ***!
  \*********************************************************************************/
/*! exports provided: BenchmarkingDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BenchmarkingDetailComponent", function() { return BenchmarkingDetailComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_benchmarkingChart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/benchmarkingChart.js */ "./src/app/scientific/shared/benchmarkingChart.js");
/* harmony import */ var _shared_benchmarkingChart_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shared_benchmarkingChart_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var apollo_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apollo-angular */ "./node_modules/apollo-angular/fesm2015/ng.apollo.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_5__);



// declare let loadurl: any;




/**
 * benchmarking details
 */
let BenchmarkingDetailComponent = class BenchmarkingDetailComponent {
    /**
     * constructor
     */
    constructor(route, router, apollo) {
        this.route = route;
        this.router = router;
        this.apollo = apollo;
        /**
         * loading property for graphql
         */
        this.loading = true;
        this.getChallenges = graphql_tag__WEBPACK_IMPORTED_MODULE_5___default.a `
  query getChallenges($id: String!){
    getChallenges(challengeFilters:{id:$id}){
      _id
      name
      acronym
      metrics_categories {
        metrics {
          metrics_id
          tool_id
        }
      }
    }
  }
`;
    }
    /**
     * initializer
     */
    ngOnInit() {
        this.id = this.getParam('bchallengeid');
        // this.scientificService.getChallenge(this.id).subscribe(res => this.bm = res);
        this.apollo.watchQuery({
            query: this.getChallenges,
            variables: { id: this.id }
        })
            .valueChanges.subscribe(result => {
            this.challengesGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
        });
        setTimeout(() => {
            Object(_shared_benchmarkingChart_js__WEBPACK_IMPORTED_MODULE_2__["loadurl"])();
        }, 500);
    }
    /**
     * helper method get param
     */
    getParam(param) {
        return this.route.snapshot.paramMap.get(param);
    }
};
BenchmarkingDetailComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
    { type: apollo_angular__WEBPACK_IMPORTED_MODULE_4__["Apollo"] }
];
BenchmarkingDetailComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-benchmarking-detail',
        template: __webpack_require__(/*! raw-loader!./benchmarking-detail.component.html */ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-detail/benchmarking-detail.component.html"),
        styles: [__webpack_require__(/*! ./benchmarking-detail.component.css */ "./src/app/scientific/benchmarking-detail/benchmarking-detail.component.css")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
        _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
        apollo_angular__WEBPACK_IMPORTED_MODULE_4__["Apollo"]])
], BenchmarkingDetailComponent);



/***/ }),

/***/ "./src/app/scientific/benchmarking-list/benchmarking-list.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-list/benchmarking-list.component.css ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".right{\n    float:right;\n}\n\n.left{\n    float:left;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2NpZW50aWZpYy9iZW5jaG1hcmtpbmctbGlzdC9iZW5jaG1hcmtpbmctbGlzdC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksV0FBVztBQUNmOztBQUVBO0lBQ0ksVUFBVTtBQUNkIiwiZmlsZSI6InNyYy9hcHAvc2NpZW50aWZpYy9iZW5jaG1hcmtpbmctbGlzdC9iZW5jaG1hcmtpbmctbGlzdC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnJpZ2h0e1xuICAgIGZsb2F0OnJpZ2h0O1xufVxuXG4ubGVmdHtcbiAgICBmbG9hdDpsZWZ0O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/scientific/benchmarking-list/benchmarking-list.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/scientific/benchmarking-list/benchmarking-list.component.ts ***!
  \*****************************************************************************/
/*! exports provided: BenchmarkingListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BenchmarkingListComponent", function() { return BenchmarkingListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var apollo_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-angular */ "./node_modules/apollo-angular/fesm2015/ng.apollo.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");







/**
 * component
 */
let BenchmarkingListComponent = class BenchmarkingListComponent {
    constructor(route, router, apollo) {
        this.route = route;
        this.router = router;
        this.apollo = apollo;
        this.datasetTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
        this.toolTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
        this.dtOptions = {};
        /**
         * loading property for graphql
         */
        this.loading = true;
        this.getCommunities = graphql_tag__WEBPACK_IMPORTED_MODULE_4___default.a `
    query getCommunities($community_id: String!){
      getCommunities (communityFilters:{id:$community_id}){
        name
        acronym
        description
        status
      }
    }
  `;
        this.getBenchmarkingEvents = graphql_tag__WEBPACK_IMPORTED_MODULE_4___default.a `
    query getBenchmarkingEvents($community_id: String!){
      getBenchmarkingEvents(benchmarkingEventFilters: {community_id: $community_id}) {
        _id
        name
        url
        challenges {
          _id
          name
          url
        }
      }
    }
  `;
        this.getDatasets = graphql_tag__WEBPACK_IMPORTED_MODULE_4___default.a `
    query getDatasets($community_id: String!){
      getDatasets (datasetFilters: {community_id: $community_id , visibility: "public"}) {
        name
        type
      }
    }
  `;
        this.getTools = graphql_tag__WEBPACK_IMPORTED_MODULE_4___default.a `
  query getTools($community_id: String!){
    getTools(toolFilters:{community_id: $community_id}) {
      _id
      name
      status
      description
    }
  }
`;
    }
    /**
     * initializer
     */
    ngOnInit() {
        this.id = this.getParam('id');
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
        this.apollo.watchQuery({
            query: this.getBenchmarkingEvents,
            variables: { community_id: this.id }
        })
            .valueChanges.subscribe(result => {
            this.bEventsGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
        });
        this.apollo.watchQuery({
            query: this.getCommunities,
            variables: { community_id: this.id }
        })
            .valueChanges.subscribe(result => {
            this.communitiesGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
        });
        this.apollo.watchQuery({
            query: this.getDatasets,
            variables: { community_id: this.id }
        })
            .valueChanges.subscribe(result => {
            this.datasetsGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
            setTimeout(() => {
                this.datasetTrigger.next();
            });
        });
        this.apollo.watchQuery({
            query: this.getTools,
            variables: { community_id: this.id }
        })
            .valueChanges.subscribe(result => {
            this.toolsGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
            setTimeout(() => {
                this.toolTrigger.next();
            });
        });
        this.currentUrl = this.router.url;
    }
    /**
     * helper method to get params
     */
    getParam(param) {
        return this.route.snapshot.paramMap.get(param);
    }
};
BenchmarkingListComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: apollo_angular__WEBPACK_IMPORTED_MODULE_3__["Apollo"] }
];
BenchmarkingListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-benchmarking-list',
        template: __webpack_require__(/*! raw-loader!./benchmarking-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/scientific/benchmarking-list/benchmarking-list.component.html"),
        styles: [__webpack_require__(/*! ./benchmarking-list.component.css */ "./src/app/scientific/benchmarking-list/benchmarking-list.component.css")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
        apollo_angular__WEBPACK_IMPORTED_MODULE_3__["Apollo"]])
], BenchmarkingListComponent);



/***/ }),

/***/ "./src/app/scientific/scientific-list/scientific-list.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/scientific/scientific-list/scientific-list.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "*{\n    \n}\n\n.flex-container{\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: left;\n    \n}\n\n.communities-card {\n    font-size: 14px;\n    padding-top: 0px;\n    padding-bottom: 0px;\n    width: 220px;\n    height : 220px;\n    margin: 5px;    \n    /* background-image: linear-gradient(rgba(255,255,255,0.89), rgba(255,255,255,0.89)), url('../../../assets/img/opeb_tooltip.gif'); */\n    background-size: cover;\n    text-align: justify;\n}\n\n.communities-card > p {    \n    \n    overflow: hidden;   \n}\n\nmat-card-subtitle {\n    font-size: 12px;\n}\n\n  \n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2NpZW50aWZpYy9zY2llbnRpZmljLWxpc3Qvc2NpZW50aWZpYy1saXN0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsZUFBZTtJQUNmLHFCQUFxQjs7QUFFekI7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixZQUFZO0lBQ1osY0FBYztJQUNkLFdBQVc7SUFDWCxvSUFBb0k7SUFDcEksc0JBQXNCO0lBQ3RCLG1CQUFtQjtBQUN2Qjs7QUFFQTs7SUFFSSxnQkFBZ0I7QUFDcEI7O0FBQ0E7SUFDSSxlQUFlO0FBQ25CIiwiZmlsZSI6InNyYy9hcHAvc2NpZW50aWZpYy9zY2llbnRpZmljLWxpc3Qvc2NpZW50aWZpYy1saXN0LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIqe1xuICAgIFxufVxuXG4uZmxleC1jb250YWluZXJ7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAganVzdGlmeS1jb250ZW50OiBsZWZ0O1xuICAgIFxufVxuXG4uY29tbXVuaXRpZXMtY2FyZCB7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIHBhZGRpbmctdG9wOiAwcHg7XG4gICAgcGFkZGluZy1ib3R0b206IDBweDtcbiAgICB3aWR0aDogMjIwcHg7XG4gICAgaGVpZ2h0IDogMjIwcHg7XG4gICAgbWFyZ2luOiA1cHg7ICAgIFxuICAgIC8qIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LDAuODkpLCByZ2JhKDI1NSwyNTUsMjU1LDAuODkpKSwgdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL29wZWJfdG9vbHRpcC5naWYnKTsgKi9cbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XG59XG5cbi5jb21tdW5pdGllcy1jYXJkID4gcCB7ICAgIFxuICAgIFxuICAgIG92ZXJmbG93OiBoaWRkZW47ICAgXG59XG5tYXQtY2FyZC1zdWJ0aXRsZSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xufVxuXG4gICJdfQ== */"

/***/ }),

/***/ "./src/app/scientific/scientific-list/scientific-list.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/scientific/scientific-list/scientific-list.component.ts ***!
  \*************************************************************************/
/*! exports provided: ScientificListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScientificListComponent", function() { return ScientificListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var apollo_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-angular */ "./node_modules/apollo-angular/fesm2015/ng.apollo.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_3__);




/**
 * scientific list
 */
let ScientificListComponent = class ScientificListComponent {
    /**
     * constructor
     */
    constructor(apollo) {
        this.apollo = apollo;
        /**
         * data
         */
        this.data = [];
        /**
         * loading property for graphql
         */
        this.loading = true;
        this.getCommunities = graphql_tag__WEBPACK_IMPORTED_MODULE_3___default.a `
  {
    getCommunities {
      _id
      name
      acronym
      links{
        label
        uri
      }
    }
  }
`;
    }
    /**
     * initializer
     */
    ngOnInit() {
        this.apollo
            .watchQuery({
            query: this.getCommunities
        })
            .valueChanges.subscribe(result => {
            this.communitiesGraphql = result.data;
            this.loading = result.loading;
            this.error = result.errors;
        });
    }
};
ScientificListComponent.ctorParameters = () => [
    { type: apollo_angular__WEBPACK_IMPORTED_MODULE_2__["Apollo"] }
];
ScientificListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-scientific-list',
        template: __webpack_require__(/*! raw-loader!./scientific-list.component.html */ "./node_modules/raw-loader/index.js!./src/app/scientific/scientific-list/scientific-list.component.html"),
        styles: [__webpack_require__(/*! ./scientific-list.component.css */ "./src/app/scientific/scientific-list/scientific-list.component.css")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [apollo_angular__WEBPACK_IMPORTED_MODULE_2__["Apollo"]])
], ScientificListComponent);



/***/ }),

/***/ "./src/app/scientific/scientific-routing.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/scientific/scientific-routing.module.ts ***!
  \*********************************************************/
/*! exports provided: ScientificRoutingModule, AllScientificRoutingComponents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScientificRoutingModule", function() { return ScientificRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AllScientificRoutingComponents", function() { return AllScientificRoutingComponents; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _scientific_list_scientific_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scientific-list/scientific-list.component */ "./src/app/scientific/scientific-list/scientific-list.component.ts");
/* harmony import */ var _benchmarking_list_benchmarking_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./benchmarking-list/benchmarking-list.component */ "./src/app/scientific/benchmarking-list/benchmarking-list.component.ts");
/* harmony import */ var _benchmarking_detail_benchmarking_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./benchmarking-detail/benchmarking-detail.component */ "./src/app/scientific/benchmarking-detail/benchmarking-detail.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _benchmarking_challenge_list_benchmarking_challenge_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./benchmarking-challenge-list/benchmarking-challenge-list.component */ "./src/app/scientific/benchmarking-challenge-list/benchmarking-challenge-list.component.ts");







/**
 * routes
 */
const routes = [
    {
        path: '', children: [
            { path: '', component: _scientific_list_scientific_list_component__WEBPACK_IMPORTED_MODULE_2__["ScientificListComponent"] },
            // { path: ':id', component: BenchmarkingListComponent, children: [
            //   {
            //     path: ':beventsid', component: BenchmarkingChallengeListComponent,
            //   }
            // ]},
            // { path: ':id/:beventsid', component: BenchmarkingChallengeListComponent},
            { path: ':id', component: _benchmarking_list_benchmarking_list_component__WEBPACK_IMPORTED_MODULE_3__["BenchmarkingListComponent"] },
            { path: ':id/:bchallengeid', component: _benchmarking_detail_benchmarking_detail_component__WEBPACK_IMPORTED_MODULE_4__["BenchmarkingDetailComponent"] },
        ]
    }
];
/**
 * child module for routing
 */
let ScientificRoutingModule = 
/**
 * export routing module
 */
class ScientificRoutingModule {
};
ScientificRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        // This is a child module so we use forChild
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"]]
    })
    /**
     * export routing module
     */
], ScientificRoutingModule);

/**
 * routing components export
 */
const AllScientificRoutingComponents = [_scientific_list_scientific_list_component__WEBPACK_IMPORTED_MODULE_2__["ScientificListComponent"], _benchmarking_list_benchmarking_list_component__WEBPACK_IMPORTED_MODULE_3__["BenchmarkingListComponent"],
    _benchmarking_challenge_list_benchmarking_challenge_list_component__WEBPACK_IMPORTED_MODULE_6__["BenchmarkingChallengeListComponent"], _benchmarking_detail_benchmarking_detail_component__WEBPACK_IMPORTED_MODULE_4__["BenchmarkingDetailComponent"]];


/***/ }),

/***/ "./src/app/scientific/scientific.component.css":
/*!*****************************************************!*\
  !*** ./src/app/scientific/scientific.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NjaWVudGlmaWMvc2NpZW50aWZpYy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/scientific/scientific.component.ts":
/*!****************************************************!*\
  !*** ./src/app/scientific/scientific.component.ts ***!
  \****************************************************/
/*! exports provided: ScientificComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScientificComponent", function() { return ScientificComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


/**
 * scientific component
 */
let ScientificComponent = class ScientificComponent {
    /**
     * constructor
     */
    constructor() { }
    /**
     * initializer
     */
    ngOnInit() {
    }
};
ScientificComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-scientific',
        template: __webpack_require__(/*! raw-loader!./scientific.component.html */ "./node_modules/raw-loader/index.js!./src/app/scientific/scientific.component.html"),
        styles: [__webpack_require__(/*! ./scientific.component.css */ "./src/app/scientific/scientific.component.css")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
], ScientificComponent);



/***/ }),

/***/ "./src/app/scientific/scientific.module.ts":
/*!*************************************************!*\
  !*** ./src/app/scientific/scientific.module.ts ***!
  \*************************************************/
/*! exports provided: ScientificModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScientificModule", function() { return ScientificModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _scientific_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scientific-routing.module */ "./src/app/scientific/scientific-routing.module.ts");
/* harmony import */ var _shared_scientific_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/scientific.service */ "./src/app/scientific/shared/scientific.service.ts");
/* harmony import */ var _scientific_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scientific.component */ "./src/app/scientific/scientific.component.ts");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../material.module */ "./src/app/material.module.ts");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");









/**
 * imports and declaration for the scientific component
 */
let ScientificModule = class ScientificModule {
};
ScientificModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _scientific_component__WEBPACK_IMPORTED_MODULE_5__["ScientificComponent"],
            _scientific_routing_module__WEBPACK_IMPORTED_MODULE_3__["AllScientificRoutingComponents"]
        ],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _scientific_routing_module__WEBPACK_IMPORTED_MODULE_3__["ScientificRoutingModule"],
            _material_module__WEBPACK_IMPORTED_MODULE_6__["MaterialModule"],
            angular_datatables__WEBPACK_IMPORTED_MODULE_7__["DataTablesModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"]
        ],
        providers: [_shared_scientific_service__WEBPACK_IMPORTED_MODULE_4__["ScientificService"]],
        bootstrap: [_scientific_component__WEBPACK_IMPORTED_MODULE_5__["ScientificComponent"]]
    })
], ScientificModule);



/***/ }),

/***/ "./src/app/scientific/shared/benchmarkingChart.js":
/*!********************************************************!*\
  !*** ./src/app/scientific/shared/benchmarkingChart.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

!function(t,e){for(var n in e)t[n]=e[n]}(this,function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){var r;
  /*!
   * jQuery JavaScript Library v3.3.1
   * https://jquery.com/
   *
   * Includes Sizzle.js
   * https://sizzlejs.com/
   *
   * Copyright JS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2018-01-20T17:24Z
   */
  /*!
   * jQuery JavaScript Library v3.3.1
   * https://jquery.com/
   *
   * Includes Sizzle.js
   * https://sizzlejs.com/
   *
   * Copyright JS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2018-01-20T17:24Z
   */
  !function(e,n){"use strict";"object"==typeof t&&"object"==typeof t.exports?t.exports=e.document?n(e,!0):function(t){if(!t.document)throw new Error("jQuery requires a window with a document");return n(t)}:n(e)}("undefined"!=typeof window?window:this,function(n,i){"use strict";var o=[],a=n.document,s=Object.getPrototypeOf,c=o.slice,u=o.concat,f=o.push,l=o.indexOf,h={},d=h.toString,p=h.hasOwnProperty,y=p.toString,b=y.call(Object),g={},v=function(t){return"function"==typeof t&&"number"!=typeof t.nodeType},_=function(t){return null!=t&&t===t.window},m={type:!0,src:!0,noModule:!0};function x(t,e,n){var r,i=(e=e||a).createElement("script");if(i.text=t,n)for(r in m)n[r]&&(i[r]=n[r]);e.head.appendChild(i).parentNode.removeChild(i)}function w(t){return null==t?t+"":"object"==typeof t||"function"==typeof t?h[d.call(t)]||"object":typeof t}var T=function(t,e){return new T.fn.init(t,e)},M=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;function A(t){var e=!!t&&"length"in t&&t.length,n=w(t);return!v(t)&&!_(t)&&("array"===n||0===e||"number"==typeof e&&e>0&&e-1 in t)}T.fn=T.prototype={jquery:"3.3.1",constructor:T,length:0,toArray:function(){return c.call(this)},get:function(t){return null==t?c.call(this):t<0?this[t+this.length]:this[t]},pushStack:function(t){var e=T.merge(this.constructor(),t);return e.prevObject=this,e},each:function(t){return T.each(this,t)},map:function(t){return this.pushStack(T.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return this.pushStack(c.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(t){var e=this.length,n=+t+(t<0?e:0);return this.pushStack(n>=0&&n<e?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:f,sort:o.sort,splice:o.splice},T.extend=T.fn.extend=function(){var t,e,n,r,i,o,a=arguments[0]||{},s=1,c=arguments.length,u=!1;for("boolean"==typeof a&&(u=a,a=arguments[s]||{},s++),"object"==typeof a||v(a)||(a={}),s===c&&(a=this,s--);s<c;s++)if(null!=(t=arguments[s]))for(e in t)n=a[e],a!==(r=t[e])&&(u&&r&&(T.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&T.isPlainObject(n)?n:{},a[e]=T.extend(u,o,r)):void 0!==r&&(a[e]=r));return a},T.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(t){throw new Error(t)},noop:function(){},isPlainObject:function(t){var e,n;return!(!t||"[object Object]"!==d.call(t))&&(!(e=s(t))||"function"==typeof(n=p.call(e,"constructor")&&e.constructor)&&y.call(n)===b)},isEmptyObject:function(t){var e;for(e in t)return!1;return!0},globalEval:function(t){x(t)},each:function(t,e){var n,r=0;if(A(t))for(n=t.length;r<n&&!1!==e.call(t[r],r,t[r]);r++);else for(r in t)if(!1===e.call(t[r],r,t[r]))break;return t},trim:function(t){return null==t?"":(t+"").replace(M,"")},makeArray:function(t,e){var n=e||[];return null!=t&&(A(Object(t))?T.merge(n,"string"==typeof t?[t]:t):f.call(n,t)),n},inArray:function(t,e,n){return null==e?-1:l.call(e,t,n)},merge:function(t,e){for(var n=+e.length,r=0,i=t.length;r<n;r++)t[i++]=e[r];return t.length=i,t},grep:function(t,e,n){for(var r=[],i=0,o=t.length,a=!n;i<o;i++)!e(t[i],i)!==a&&r.push(t[i]);return r},map:function(t,e,n){var r,i,o=0,a=[];if(A(t))for(r=t.length;o<r;o++)null!=(i=e(t[o],o,n))&&a.push(i);else for(o in t)null!=(i=e(t[o],o,n))&&a.push(i);return u.apply([],a)},guid:1,support:g}),"function"==typeof Symbol&&(T.fn[Symbol.iterator]=o[Symbol.iterator]),T.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(t,e){h["[object "+e+"]"]=e.toLowerCase()});var k=
  /*!
   * Sizzle CSS Selector Engine v2.3.3
   * https://sizzlejs.com/
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2016-08-08
   */
  function(t){var e,n,r,i,o,a,s,c,u,f,l,h,d,p,y,b,g,v,_,m="sizzle"+1*new Date,x=t.document,w=0,T=0,M=at(),A=at(),k=at(),C=function(t,e){return t===e&&(l=!0),0},E={}.hasOwnProperty,N=[],S=N.pop,D=N.push,L=N.push,j=N.slice,q=function(t,e){for(var n=0,r=t.length;n<r;n++)if(t[n]===e)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",O="[\\x20\\t\\r\\n\\f]",U="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",R="\\["+O+"*("+U+")(?:"+O+"*([*^$|!~]?=)"+O+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+U+"))|)"+O+"*\\]",H=":("+U+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+R+")*)|.*)\\)|)",F=new RegExp(O+"+","g"),I=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),B=new RegExp("^"+O+"*,"+O+"*"),z=new RegExp("^"+O+"*([>+~]|"+O+")"+O+"*"),$=new RegExp("="+O+"*([^\\]'\"]*?)"+O+"*\\]","g"),Y=new RegExp(H),W=new RegExp("^"+U+"$"),X={ID:new RegExp("^#("+U+")"),CLASS:new RegExp("^\\.("+U+")"),TAG:new RegExp("^("+U+"|[*])"),ATTR:new RegExp("^"+R),PSEUDO:new RegExp("^"+H),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+O+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)","i")},V=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,G=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Z=/[+~]/,K=new RegExp("\\\\([\\da-f]{1,6}"+O+"?|("+O+")|.)","ig"),tt=function(t,e,n){var r="0x"+e-65536;return r!=r||n?e:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},et=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,nt=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t},rt=function(){h()},it=vt(function(t){return!0===t.disabled&&("form"in t||"label"in t)},{dir:"parentNode",next:"legend"});try{L.apply(N=j.call(x.childNodes),x.childNodes),N[x.childNodes.length].nodeType}catch(t){L={apply:N.length?function(t,e){D.apply(t,j.call(e))}:function(t,e){for(var n=t.length,r=0;t[n++]=e[r++];);t.length=n-1}}}function ot(t,e,r,i){var o,s,u,f,l,p,g,v=e&&e.ownerDocument,w=e?e.nodeType:9;if(r=r||[],"string"!=typeof t||!t||1!==w&&9!==w&&11!==w)return r;if(!i&&((e?e.ownerDocument||e:x)!==d&&h(e),e=e||d,y)){if(11!==w&&(l=G.exec(t)))if(o=l[1]){if(9===w){if(!(u=e.getElementById(o)))return r;if(u.id===o)return r.push(u),r}else if(v&&(u=v.getElementById(o))&&_(e,u)&&u.id===o)return r.push(u),r}else{if(l[2])return L.apply(r,e.getElementsByTagName(t)),r;if((o=l[3])&&n.getElementsByClassName&&e.getElementsByClassName)return L.apply(r,e.getElementsByClassName(o)),r}if(n.qsa&&!k[t+" "]&&(!b||!b.test(t))){if(1!==w)v=e,g=t;else if("object"!==e.nodeName.toLowerCase()){for((f=e.getAttribute("id"))?f=f.replace(et,nt):e.setAttribute("id",f=m),s=(p=a(t)).length;s--;)p[s]="#"+f+" "+gt(p[s]);g=p.join(","),v=Z.test(t)&&yt(e.parentNode)||e}if(g)try{return L.apply(r,v.querySelectorAll(g)),r}catch(t){}finally{f===m&&e.removeAttribute("id")}}}return c(t.replace(I,"$1"),e,r,i)}function at(){var t=[];return function e(n,i){return t.push(n+" ")>r.cacheLength&&delete e[t.shift()],e[n+" "]=i}}function st(t){return t[m]=!0,t}function ct(t){var e=d.createElement("fieldset");try{return!!t(e)}catch(t){return!1}finally{e.parentNode&&e.parentNode.removeChild(e),e=null}}function ut(t,e){for(var n=t.split("|"),i=n.length;i--;)r.attrHandle[n[i]]=e}function ft(t,e){var n=e&&t,r=n&&1===t.nodeType&&1===e.nodeType&&t.sourceIndex-e.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===e)return-1;return t?1:-1}function lt(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function ht(t){return function(e){var n=e.nodeName.toLowerCase();return("input"===n||"button"===n)&&e.type===t}}function dt(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&it(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function pt(t){return st(function(e){return e=+e,st(function(n,r){for(var i,o=t([],n.length,e),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function yt(t){return t&&void 0!==t.getElementsByTagName&&t}for(e in n=ot.support={},o=ot.isXML=function(t){var e=t&&(t.ownerDocument||t).documentElement;return!!e&&"HTML"!==e.nodeName},h=ot.setDocument=function(t){var e,i,a=t?t.ownerDocument||t:x;return a!==d&&9===a.nodeType&&a.documentElement?(p=(d=a).documentElement,y=!o(d),x!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",rt,!1):i.attachEvent&&i.attachEvent("onunload",rt)),n.attributes=ct(function(t){return t.className="i",!t.getAttribute("className")}),n.getElementsByTagName=ct(function(t){return t.appendChild(d.createComment("")),!t.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ct(function(t){return p.appendChild(t).id=m,!d.getElementsByName||!d.getElementsByName(m).length}),n.getById?(r.filter.ID=function(t){var e=t.replace(K,tt);return function(t){return t.getAttribute("id")===e}},r.find.ID=function(t,e){if(void 0!==e.getElementById&&y){var n=e.getElementById(t);return n?[n]:[]}}):(r.filter.ID=function(t){var e=t.replace(K,tt);return function(t){var n=void 0!==t.getAttributeNode&&t.getAttributeNode("id");return n&&n.value===e}},r.find.ID=function(t,e){if(void 0!==e.getElementById&&y){var n,r,i,o=e.getElementById(t);if(o){if((n=o.getAttributeNode("id"))&&n.value===t)return[o];for(i=e.getElementsByName(t),r=0;o=i[r++];)if((n=o.getAttributeNode("id"))&&n.value===t)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(t,e){return void 0!==e.getElementsByTagName?e.getElementsByTagName(t):n.qsa?e.querySelectorAll(t):void 0}:function(t,e){var n,r=[],i=0,o=e.getElementsByTagName(t);if("*"===t){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(t,e){if(void 0!==e.getElementsByClassName&&y)return e.getElementsByClassName(t)},g=[],b=[],(n.qsa=Q.test(d.querySelectorAll))&&(ct(function(t){p.appendChild(t).innerHTML="<a id='"+m+"'></a><select id='"+m+"-\r\\' msallowcapture=''><option selected=''></option></select>",t.querySelectorAll("[msallowcapture^='']").length&&b.push("[*^$]="+O+"*(?:''|\"\")"),t.querySelectorAll("[selected]").length||b.push("\\["+O+"*(?:value|"+P+")"),t.querySelectorAll("[id~="+m+"-]").length||b.push("~="),t.querySelectorAll(":checked").length||b.push(":checked"),t.querySelectorAll("a#"+m+"+*").length||b.push(".#.+[+~]")}),ct(function(t){t.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var e=d.createElement("input");e.setAttribute("type","hidden"),t.appendChild(e).setAttribute("name","D"),t.querySelectorAll("[name=d]").length&&b.push("name"+O+"*[*^$|!~]?="),2!==t.querySelectorAll(":enabled").length&&b.push(":enabled",":disabled"),p.appendChild(t).disabled=!0,2!==t.querySelectorAll(":disabled").length&&b.push(":enabled",":disabled"),t.querySelectorAll("*,:x"),b.push(",.*:")})),(n.matchesSelector=Q.test(v=p.matches||p.webkitMatchesSelector||p.mozMatchesSelector||p.oMatchesSelector||p.msMatchesSelector))&&ct(function(t){n.disconnectedMatch=v.call(t,"*"),v.call(t,"[s!='']:x"),g.push("!=",H)}),b=b.length&&new RegExp(b.join("|")),g=g.length&&new RegExp(g.join("|")),e=Q.test(p.compareDocumentPosition),_=e||Q.test(p.contains)?function(t,e){var n=9===t.nodeType?t.documentElement:t,r=e&&e.parentNode;return t===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):t.compareDocumentPosition&&16&t.compareDocumentPosition(r)))}:function(t,e){if(e)for(;e=e.parentNode;)if(e===t)return!0;return!1},C=e?function(t,e){if(t===e)return l=!0,0;var r=!t.compareDocumentPosition-!e.compareDocumentPosition;return r||(1&(r=(t.ownerDocument||t)===(e.ownerDocument||e)?t.compareDocumentPosition(e):1)||!n.sortDetached&&e.compareDocumentPosition(t)===r?t===d||t.ownerDocument===x&&_(x,t)?-1:e===d||e.ownerDocument===x&&_(x,e)?1:f?q(f,t)-q(f,e):0:4&r?-1:1)}:function(t,e){if(t===e)return l=!0,0;var n,r=0,i=t.parentNode,o=e.parentNode,a=[t],s=[e];if(!i||!o)return t===d?-1:e===d?1:i?-1:o?1:f?q(f,t)-q(f,e):0;if(i===o)return ft(t,e);for(n=t;n=n.parentNode;)a.unshift(n);for(n=e;n=n.parentNode;)s.unshift(n);for(;a[r]===s[r];)r++;return r?ft(a[r],s[r]):a[r]===x?-1:s[r]===x?1:0},d):d},ot.matches=function(t,e){return ot(t,null,null,e)},ot.matchesSelector=function(t,e){if((t.ownerDocument||t)!==d&&h(t),e=e.replace($,"='$1']"),n.matchesSelector&&y&&!k[e+" "]&&(!g||!g.test(e))&&(!b||!b.test(e)))try{var r=v.call(t,e);if(r||n.disconnectedMatch||t.document&&11!==t.document.nodeType)return r}catch(t){}return ot(e,d,null,[t]).length>0},ot.contains=function(t,e){return(t.ownerDocument||t)!==d&&h(t),_(t,e)},ot.attr=function(t,e){(t.ownerDocument||t)!==d&&h(t);var i=r.attrHandle[e.toLowerCase()],o=i&&E.call(r.attrHandle,e.toLowerCase())?i(t,e,!y):void 0;return void 0!==o?o:n.attributes||!y?t.getAttribute(e):(o=t.getAttributeNode(e))&&o.specified?o.value:null},ot.escape=function(t){return(t+"").replace(et,nt)},ot.error=function(t){throw new Error("Syntax error, unrecognized expression: "+t)},ot.uniqueSort=function(t){var e,r=[],i=0,o=0;if(l=!n.detectDuplicates,f=!n.sortStable&&t.slice(0),t.sort(C),l){for(;e=t[o++];)e===t[o]&&(i=r.push(o));for(;i--;)t.splice(r[i],1)}return f=null,t},i=ot.getText=function(t){var e,n="",r=0,o=t.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)n+=i(t)}else if(3===o||4===o)return t.nodeValue}else for(;e=t[r++];)n+=i(e);return n},(r=ot.selectors={cacheLength:50,createPseudo:st,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(t){return t[1]=t[1].replace(K,tt),t[3]=(t[3]||t[4]||t[5]||"").replace(K,tt),"~="===t[2]&&(t[3]=" "+t[3]+" "),t.slice(0,4)},CHILD:function(t){return t[1]=t[1].toLowerCase(),"nth"===t[1].slice(0,3)?(t[3]||ot.error(t[0]),t[4]=+(t[4]?t[5]+(t[6]||1):2*("even"===t[3]||"odd"===t[3])),t[5]=+(t[7]+t[8]||"odd"===t[3])):t[3]&&ot.error(t[0]),t},PSEUDO:function(t){var e,n=!t[6]&&t[2];return X.CHILD.test(t[0])?null:(t[3]?t[2]=t[4]||t[5]||"":n&&Y.test(n)&&(e=a(n,!0))&&(e=n.indexOf(")",n.length-e)-n.length)&&(t[0]=t[0].slice(0,e),t[2]=n.slice(0,e)),t.slice(0,3))}},filter:{TAG:function(t){var e=t.replace(K,tt).toLowerCase();return"*"===t?function(){return!0}:function(t){return t.nodeName&&t.nodeName.toLowerCase()===e}},CLASS:function(t){var e=M[t+" "];return e||(e=new RegExp("(^|"+O+")"+t+"("+O+"|$)"))&&M(t,function(t){return e.test("string"==typeof t.className&&t.className||void 0!==t.getAttribute&&t.getAttribute("class")||"")})},ATTR:function(t,e,n){return function(r){var i=ot.attr(r,t);return null==i?"!="===e:!e||(i+="","="===e?i===n:"!="===e?i!==n:"^="===e?n&&0===i.indexOf(n):"*="===e?n&&i.indexOf(n)>-1:"$="===e?n&&i.slice(-n.length)===n:"~="===e?(" "+i.replace(F," ")+" ").indexOf(n)>-1:"|="===e&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(t,e,n,r,i){var o="nth"!==t.slice(0,3),a="last"!==t.slice(-4),s="of-type"===e;return 1===r&&0===i?function(t){return!!t.parentNode}:function(e,n,c){var u,f,l,h,d,p,y=o!==a?"nextSibling":"previousSibling",b=e.parentNode,g=s&&e.nodeName.toLowerCase(),v=!c&&!s,_=!1;if(b){if(o){for(;y;){for(h=e;h=h[y];)if(s?h.nodeName.toLowerCase()===g:1===h.nodeType)return!1;p=y="only"===t&&!p&&"nextSibling"}return!0}if(p=[a?b.firstChild:b.lastChild],a&&v){for(_=(d=(u=(f=(l=(h=b)[m]||(h[m]={}))[h.uniqueID]||(l[h.uniqueID]={}))[t]||[])[0]===w&&u[1])&&u[2],h=d&&b.childNodes[d];h=++d&&h&&h[y]||(_=d=0)||p.pop();)if(1===h.nodeType&&++_&&h===e){f[t]=[w,d,_];break}}else if(v&&(_=d=(u=(f=(l=(h=e)[m]||(h[m]={}))[h.uniqueID]||(l[h.uniqueID]={}))[t]||[])[0]===w&&u[1]),!1===_)for(;(h=++d&&h&&h[y]||(_=d=0)||p.pop())&&((s?h.nodeName.toLowerCase()!==g:1!==h.nodeType)||!++_||(v&&((f=(l=h[m]||(h[m]={}))[h.uniqueID]||(l[h.uniqueID]={}))[t]=[w,_]),h!==e)););return(_-=i)===r||_%r==0&&_/r>=0}}},PSEUDO:function(t,e){var n,i=r.pseudos[t]||r.setFilters[t.toLowerCase()]||ot.error("unsupported pseudo: "+t);return i[m]?i(e):i.length>1?(n=[t,t,"",e],r.setFilters.hasOwnProperty(t.toLowerCase())?st(function(t,n){for(var r,o=i(t,e),a=o.length;a--;)t[r=q(t,o[a])]=!(n[r]=o[a])}):function(t){return i(t,0,n)}):i}},pseudos:{not:st(function(t){var e=[],n=[],r=s(t.replace(I,"$1"));return r[m]?st(function(t,e,n,i){for(var o,a=r(t,null,i,[]),s=t.length;s--;)(o=a[s])&&(t[s]=!(e[s]=o))}):function(t,i,o){return e[0]=t,r(e,null,o,n),e[0]=null,!n.pop()}}),has:st(function(t){return function(e){return ot(t,e).length>0}}),contains:st(function(t){return t=t.replace(K,tt),function(e){return(e.textContent||e.innerText||i(e)).indexOf(t)>-1}}),lang:st(function(t){return W.test(t||"")||ot.error("unsupported lang: "+t),t=t.replace(K,tt).toLowerCase(),function(e){var n;do{if(n=y?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(n=n.toLowerCase())===t||0===n.indexOf(t+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var n=t.location&&t.location.hash;return n&&n.slice(1)===e.id},root:function(t){return t===p},focus:function(t){return t===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(t.type||t.href||~t.tabIndex)},enabled:dt(!1),disabled:dt(!0),checked:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&!!t.checked||"option"===e&&!!t.selected},selected:function(t){return t.parentNode&&t.parentNode.selectedIndex,!0===t.selected},empty:function(t){for(t=t.firstChild;t;t=t.nextSibling)if(t.nodeType<6)return!1;return!0},parent:function(t){return!r.pseudos.empty(t)},header:function(t){return J.test(t.nodeName)},input:function(t){return V.test(t.nodeName)},button:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&"button"===t.type||"button"===e},text:function(t){var e;return"input"===t.nodeName.toLowerCase()&&"text"===t.type&&(null==(e=t.getAttribute("type"))||"text"===e.toLowerCase())},first:pt(function(){return[0]}),last:pt(function(t,e){return[e-1]}),eq:pt(function(t,e,n){return[n<0?n+e:n]}),even:pt(function(t,e){for(var n=0;n<e;n+=2)t.push(n);return t}),odd:pt(function(t,e){for(var n=1;n<e;n+=2)t.push(n);return t}),lt:pt(function(t,e,n){for(var r=n<0?n+e:n;--r>=0;)t.push(r);return t}),gt:pt(function(t,e,n){for(var r=n<0?n+e:n;++r<e;)t.push(r);return t})}}).pseudos.nth=r.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[e]=lt(e);for(e in{submit:!0,reset:!0})r.pseudos[e]=ht(e);function bt(){}function gt(t){for(var e=0,n=t.length,r="";e<n;e++)r+=t[e].value;return r}function vt(t,e,n){var r=e.dir,i=e.next,o=i||r,a=n&&"parentNode"===o,s=T++;return e.first?function(e,n,i){for(;e=e[r];)if(1===e.nodeType||a)return t(e,n,i);return!1}:function(e,n,c){var u,f,l,h=[w,s];if(c){for(;e=e[r];)if((1===e.nodeType||a)&&t(e,n,c))return!0}else for(;e=e[r];)if(1===e.nodeType||a)if(f=(l=e[m]||(e[m]={}))[e.uniqueID]||(l[e.uniqueID]={}),i&&i===e.nodeName.toLowerCase())e=e[r]||e;else{if((u=f[o])&&u[0]===w&&u[1]===s)return h[2]=u[2];if(f[o]=h,h[2]=t(e,n,c))return!0}return!1}}function _t(t){return t.length>1?function(e,n,r){for(var i=t.length;i--;)if(!t[i](e,n,r))return!1;return!0}:t[0]}function mt(t,e,n,r,i){for(var o,a=[],s=0,c=t.length,u=null!=e;s<c;s++)(o=t[s])&&(n&&!n(o,r,i)||(a.push(o),u&&e.push(s)));return a}function xt(t,e,n,r,i,o){return r&&!r[m]&&(r=xt(r)),i&&!i[m]&&(i=xt(i,o)),st(function(o,a,s,c){var u,f,l,h=[],d=[],p=a.length,y=o||function(t,e,n){for(var r=0,i=e.length;r<i;r++)ot(t,e[r],n);return n}(e||"*",s.nodeType?[s]:s,[]),b=!t||!o&&e?y:mt(y,h,t,s,c),g=n?i||(o?t:p||r)?[]:a:b;if(n&&n(b,g,s,c),r)for(u=mt(g,d),r(u,[],s,c),f=u.length;f--;)(l=u[f])&&(g[d[f]]=!(b[d[f]]=l));if(o){if(i||t){if(i){for(u=[],f=g.length;f--;)(l=g[f])&&u.push(b[f]=l);i(null,g=[],u,c)}for(f=g.length;f--;)(l=g[f])&&(u=i?q(o,l):h[f])>-1&&(o[u]=!(a[u]=l))}}else g=mt(g===a?g.splice(p,g.length):g),i?i(null,a,g,c):L.apply(a,g)})}function wt(t){for(var e,n,i,o=t.length,a=r.relative[t[0].type],s=a||r.relative[" "],c=a?1:0,f=vt(function(t){return t===e},s,!0),l=vt(function(t){return q(e,t)>-1},s,!0),h=[function(t,n,r){var i=!a&&(r||n!==u)||((e=n).nodeType?f(t,n,r):l(t,n,r));return e=null,i}];c<o;c++)if(n=r.relative[t[c].type])h=[vt(_t(h),n)];else{if((n=r.filter[t[c].type].apply(null,t[c].matches))[m]){for(i=++c;i<o&&!r.relative[t[i].type];i++);return xt(c>1&&_t(h),c>1&&gt(t.slice(0,c-1).concat({value:" "===t[c-2].type?"*":""})).replace(I,"$1"),n,c<i&&wt(t.slice(c,i)),i<o&&wt(t=t.slice(i)),i<o&&gt(t))}h.push(n)}return _t(h)}return bt.prototype=r.filters=r.pseudos,r.setFilters=new bt,a=ot.tokenize=function(t,e){var n,i,o,a,s,c,u,f=A[t+" "];if(f)return e?0:f.slice(0);for(s=t,c=[],u=r.preFilter;s;){for(a in n&&!(i=B.exec(s))||(i&&(s=s.slice(i[0].length)||s),c.push(o=[])),n=!1,(i=z.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(I," ")}),s=s.slice(n.length)),r.filter)!(i=X[a].exec(s))||u[a]&&!(i=u[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return e?s.length:s?ot.error(t):A(t,c).slice(0)},s=ot.compile=function(t,e){var n,i=[],o=[],s=k[t+" "];if(!s){for(e||(e=a(t)),n=e.length;n--;)(s=wt(e[n]))[m]?i.push(s):o.push(s);(s=k(t,function(t,e){var n=e.length>0,i=t.length>0,o=function(o,a,s,c,f){var l,p,b,g=0,v="0",_=o&&[],m=[],x=u,T=o||i&&r.find.TAG("*",f),M=w+=null==x?1:Math.random()||.1,A=T.length;for(f&&(u=a===d||a||f);v!==A&&null!=(l=T[v]);v++){if(i&&l){for(p=0,a||l.ownerDocument===d||(h(l),s=!y);b=t[p++];)if(b(l,a||d,s)){c.push(l);break}f&&(w=M)}n&&((l=!b&&l)&&g--,o&&_.push(l))}if(g+=v,n&&v!==g){for(p=0;b=e[p++];)b(_,m,a,s);if(o){if(g>0)for(;v--;)_[v]||m[v]||(m[v]=S.call(c));m=mt(m)}L.apply(c,m),f&&!o&&m.length>0&&g+e.length>1&&ot.uniqueSort(c)}return f&&(w=M,u=x),_};return n?st(o):o}(o,i))).selector=t}return s},c=ot.select=function(t,e,n,i){var o,c,u,f,l,h="function"==typeof t&&t,d=!i&&a(t=h.selector||t);if(n=n||[],1===d.length){if((c=d[0]=d[0].slice(0)).length>2&&"ID"===(u=c[0]).type&&9===e.nodeType&&y&&r.relative[c[1].type]){if(!(e=(r.find.ID(u.matches[0].replace(K,tt),e)||[])[0]))return n;h&&(e=e.parentNode),t=t.slice(c.shift().value.length)}for(o=X.needsContext.test(t)?0:c.length;o--&&(u=c[o],!r.relative[f=u.type]);)if((l=r.find[f])&&(i=l(u.matches[0].replace(K,tt),Z.test(c[0].type)&&yt(e.parentNode)||e))){if(c.splice(o,1),!(t=i.length&&gt(c)))return L.apply(n,i),n;break}}return(h||s(t,d))(i,e,!y,n,!e||Z.test(t)&&yt(e.parentNode)||e),n},n.sortStable=m.split("").sort(C).join("")===m,n.detectDuplicates=!!l,h(),n.sortDetached=ct(function(t){return 1&t.compareDocumentPosition(d.createElement("fieldset"))}),ct(function(t){return t.innerHTML="<a href='#'></a>","#"===t.firstChild.getAttribute("href")})||ut("type|href|height|width",function(t,e,n){if(!n)return t.getAttribute(e,"type"===e.toLowerCase()?1:2)}),n.attributes&&ct(function(t){return t.innerHTML="<input/>",t.firstChild.setAttribute("value",""),""===t.firstChild.getAttribute("value")})||ut("value",function(t,e,n){if(!n&&"input"===t.nodeName.toLowerCase())return t.defaultValue}),ct(function(t){return null==t.getAttribute("disabled")})||ut(P,function(t,e,n){var r;if(!n)return!0===t[e]?e.toLowerCase():(r=t.getAttributeNode(e))&&r.specified?r.value:null}),ot}(n);T.find=k,T.expr=k.selectors,T.expr[":"]=T.expr.pseudos,T.uniqueSort=T.unique=k.uniqueSort,T.text=k.getText,T.isXMLDoc=k.isXML,T.contains=k.contains,T.escapeSelector=k.escape;var C=function(t,e,n){for(var r=[],i=void 0!==n;(t=t[e])&&9!==t.nodeType;)if(1===t.nodeType){if(i&&T(t).is(n))break;r.push(t)}return r},E=function(t,e){for(var n=[];t;t=t.nextSibling)1===t.nodeType&&t!==e&&n.push(t);return n},N=T.expr.match.needsContext;function S(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}var D=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function L(t,e,n){return v(e)?T.grep(t,function(t,r){return!!e.call(t,r,t)!==n}):e.nodeType?T.grep(t,function(t){return t===e!==n}):"string"!=typeof e?T.grep(t,function(t){return l.call(e,t)>-1!==n}):T.filter(e,t,n)}T.filter=function(t,e,n){var r=e[0];return n&&(t=":not("+t+")"),1===e.length&&1===r.nodeType?T.find.matchesSelector(r,t)?[r]:[]:T.find.matches(t,T.grep(e,function(t){return 1===t.nodeType}))},T.fn.extend({find:function(t){var e,n,r=this.length,i=this;if("string"!=typeof t)return this.pushStack(T(t).filter(function(){for(e=0;e<r;e++)if(T.contains(i[e],this))return!0}));for(n=this.pushStack([]),e=0;e<r;e++)T.find(t,i[e],n);return r>1?T.uniqueSort(n):n},filter:function(t){return this.pushStack(L(this,t||[],!1))},not:function(t){return this.pushStack(L(this,t||[],!0))},is:function(t){return!!L(this,"string"==typeof t&&N.test(t)?T(t):t||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(T.fn.init=function(t,e,n){var r,i;if(!t)return this;if(n=n||j,"string"==typeof t){if(!(r="<"===t[0]&&">"===t[t.length-1]&&t.length>=3?[null,t,null]:q.exec(t))||!r[1]&&e)return!e||e.jquery?(e||n).find(t):this.constructor(e).find(t);if(r[1]){if(e=e instanceof T?e[0]:e,T.merge(this,T.parseHTML(r[1],e&&e.nodeType?e.ownerDocument||e:a,!0)),D.test(r[1])&&T.isPlainObject(e))for(r in e)v(this[r])?this[r](e[r]):this.attr(r,e[r]);return this}return(i=a.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return t.nodeType?(this[0]=t,this.length=1,this):v(t)?void 0!==n.ready?n.ready(t):t(T):T.makeArray(t,this)}).prototype=T.fn,j=T(a);var P=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};function U(t,e){for(;(t=t[e])&&1!==t.nodeType;);return t}T.fn.extend({has:function(t){var e=T(t,this),n=e.length;return this.filter(function(){for(var t=0;t<n;t++)if(T.contains(this,e[t]))return!0})},closest:function(t,e){var n,r=0,i=this.length,o=[],a="string"!=typeof t&&T(t);if(!N.test(t))for(;r<i;r++)for(n=this[r];n&&n!==e;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&T.find.matchesSelector(n,t))){o.push(n);break}return this.pushStack(o.length>1?T.uniqueSort(o):o)},index:function(t){return t?"string"==typeof t?l.call(T(t),this[0]):l.call(this,t.jquery?t[0]:t):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(t,e){return this.pushStack(T.uniqueSort(T.merge(this.get(),T(t,e))))},addBack:function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}}),T.each({parent:function(t){var e=t.parentNode;return e&&11!==e.nodeType?e:null},parents:function(t){return C(t,"parentNode")},parentsUntil:function(t,e,n){return C(t,"parentNode",n)},next:function(t){return U(t,"nextSibling")},prev:function(t){return U(t,"previousSibling")},nextAll:function(t){return C(t,"nextSibling")},prevAll:function(t){return C(t,"previousSibling")},nextUntil:function(t,e,n){return C(t,"nextSibling",n)},prevUntil:function(t,e,n){return C(t,"previousSibling",n)},siblings:function(t){return E((t.parentNode||{}).firstChild,t)},children:function(t){return E(t.firstChild)},contents:function(t){return S(t,"iframe")?t.contentDocument:(S(t,"template")&&(t=t.content||t),T.merge([],t.childNodes))}},function(t,e){T.fn[t]=function(n,r){var i=T.map(this,e,n);return"Until"!==t.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=T.filter(r,i)),this.length>1&&(O[t]||T.uniqueSort(i),P.test(t)&&i.reverse()),this.pushStack(i)}});var R=/[^\x20\t\r\n\f]+/g;function H(t){return t}function F(t){throw t}function I(t,e,n,r){var i;try{t&&v(i=t.promise)?i.call(t).done(e).fail(n):t&&v(i=t.then)?i.call(t,e,n):e.apply(void 0,[t].slice(r))}catch(t){n.apply(void 0,[t])}}T.Callbacks=function(t){t="string"==typeof t?function(t){var e={};return T.each(t.match(R)||[],function(t,n){e[n]=!0}),e}(t):T.extend({},t);var e,n,r,i,o=[],a=[],s=-1,c=function(){for(i=i||t.once,r=e=!0;a.length;s=-1)for(n=a.shift();++s<o.length;)!1===o[s].apply(n[0],n[1])&&t.stopOnFalse&&(s=o.length,n=!1);t.memory||(n=!1),e=!1,i&&(o=n?[]:"")},u={add:function(){return o&&(n&&!e&&(s=o.length-1,a.push(n)),function e(n){T.each(n,function(n,r){v(r)?t.unique&&u.has(r)||o.push(r):r&&r.length&&"string"!==w(r)&&e(r)})}(arguments),n&&!e&&c()),this},remove:function(){return T.each(arguments,function(t,e){for(var n;(n=T.inArray(e,o,n))>-1;)o.splice(n,1),n<=s&&s--}),this},has:function(t){return t?T.inArray(t,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||e||(o=n=""),this},locked:function(){return!!i},fireWith:function(t,n){return i||(n=[t,(n=n||[]).slice?n.slice():n],a.push(n),e||c()),this},fire:function(){return u.fireWith(this,arguments),this},fired:function(){return!!r}};return u},T.extend({Deferred:function(t){var e=[["notify","progress",T.Callbacks("memory"),T.Callbacks("memory"),2],["resolve","done",T.Callbacks("once memory"),T.Callbacks("once memory"),0,"resolved"],["reject","fail",T.Callbacks("once memory"),T.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},catch:function(t){return i.then(null,t)},pipe:function(){var t=arguments;return T.Deferred(function(n){T.each(e,function(e,r){var i=v(t[r[4]])&&t[r[4]];o[r[1]](function(){var t=i&&i.apply(this,arguments);t&&v(t.promise)?t.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[r[0]+"With"](this,i?[t]:arguments)})}),t=null}).promise()},then:function(t,r,i){var o=0;function a(t,e,r,i){return function(){var s=this,c=arguments,u=function(){var n,u;if(!(t<o)){if((n=r.apply(s,c))===e.promise())throw new TypeError("Thenable self-resolution");u=n&&("object"==typeof n||"function"==typeof n)&&n.then,v(u)?i?u.call(n,a(o,e,H,i),a(o,e,F,i)):(o++,u.call(n,a(o,e,H,i),a(o,e,F,i),a(o,e,H,e.notifyWith))):(r!==H&&(s=void 0,c=[n]),(i||e.resolveWith)(s,c))}},f=i?u:function(){try{u()}catch(n){T.Deferred.exceptionHook&&T.Deferred.exceptionHook(n,f.stackTrace),t+1>=o&&(r!==F&&(s=void 0,c=[n]),e.rejectWith(s,c))}};t?f():(T.Deferred.getStackHook&&(f.stackTrace=T.Deferred.getStackHook()),n.setTimeout(f))}}return T.Deferred(function(n){e[0][3].add(a(0,n,v(i)?i:H,n.notifyWith)),e[1][3].add(a(0,n,v(t)?t:H)),e[2][3].add(a(0,n,v(r)?r:F))}).promise()},promise:function(t){return null!=t?T.extend(t,i):i}},o={};return T.each(e,function(t,n){var a=n[2],s=n[5];i[n[1]]=a.add,s&&a.add(function(){r=s},e[3-t][2].disable,e[3-t][3].disable,e[0][2].lock,e[0][3].lock),a.add(n[3].fire),o[n[0]]=function(){return o[n[0]+"With"](this===o?void 0:this,arguments),this},o[n[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(t){var e=arguments.length,n=e,r=Array(n),i=c.call(arguments),o=T.Deferred(),a=function(t){return function(n){r[t]=this,i[t]=arguments.length>1?c.call(arguments):n,--e||o.resolveWith(r,i)}};if(e<=1&&(I(t,o.done(a(n)).resolve,o.reject,!e),"pending"===o.state()||v(i[n]&&i[n].then)))return o.then();for(;n--;)I(i[n],a(n),o.reject);return o.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;T.Deferred.exceptionHook=function(t,e){n.console&&n.console.warn&&t&&B.test(t.name)&&n.console.warn("jQuery.Deferred exception: "+t.message,t.stack,e)},T.readyException=function(t){n.setTimeout(function(){throw t})};var z=T.Deferred();function $(){a.removeEventListener("DOMContentLoaded",$),n.removeEventListener("load",$),T.ready()}T.fn.ready=function(t){return z.then(t).catch(function(t){T.readyException(t)}),this},T.extend({isReady:!1,readyWait:1,ready:function(t){(!0===t?--T.readyWait:T.isReady)||(T.isReady=!0,!0!==t&&--T.readyWait>0||z.resolveWith(a,[T]))}}),T.ready.then=z.then,"complete"===a.readyState||"loading"!==a.readyState&&!a.documentElement.doScroll?n.setTimeout(T.ready):(a.addEventListener("DOMContentLoaded",$),n.addEventListener("load",$));var Y=function(t,e,n,r,i,o,a){var s=0,c=t.length,u=null==n;if("object"===w(n))for(s in i=!0,n)Y(t,e,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,v(r)||(a=!0),u&&(a?(e.call(t,r),e=null):(u=e,e=function(t,e,n){return u.call(T(t),n)})),e))for(;s<c;s++)e(t[s],n,a?r:r.call(t[s],s,e(t[s],n)));return i?t:u?e.call(t):c?e(t[0],n):o},W=/^-ms-/,X=/-([a-z])/g;function V(t,e){return e.toUpperCase()}function J(t){return t.replace(W,"ms-").replace(X,V)}var Q=function(t){return 1===t.nodeType||9===t.nodeType||!+t.nodeType};function G(){this.expando=T.expando+G.uid++}G.uid=1,G.prototype={cache:function(t){var e=t[this.expando];return e||(e={},Q(t)&&(t.nodeType?t[this.expando]=e:Object.defineProperty(t,this.expando,{value:e,configurable:!0}))),e},set:function(t,e,n){var r,i=this.cache(t);if("string"==typeof e)i[J(e)]=n;else for(r in e)i[J(r)]=e[r];return i},get:function(t,e){return void 0===e?this.cache(t):t[this.expando]&&t[this.expando][J(e)]},access:function(t,e,n){return void 0===e||e&&"string"==typeof e&&void 0===n?this.get(t,e):(this.set(t,e,n),void 0!==n?n:e)},remove:function(t,e){var n,r=t[this.expando];if(void 0!==r){if(void 0!==e){n=(e=Array.isArray(e)?e.map(J):(e=J(e))in r?[e]:e.match(R)||[]).length;for(;n--;)delete r[e[n]]}(void 0===e||T.isEmptyObject(r))&&(t.nodeType?t[this.expando]=void 0:delete t[this.expando])}},hasData:function(t){var e=t[this.expando];return void 0!==e&&!T.isEmptyObject(e)}};var Z=new G,K=new G,tt=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,et=/[A-Z]/g;function nt(t,e,n){var r;if(void 0===n&&1===t.nodeType)if(r="data-"+e.replace(et,"-$&").toLowerCase(),"string"==typeof(n=t.getAttribute(r))){try{n=function(t){return"true"===t||"false"!==t&&("null"===t?null:t===+t+""?+t:tt.test(t)?JSON.parse(t):t)}(n)}catch(t){}K.set(t,e,n)}else n=void 0;return n}T.extend({hasData:function(t){return K.hasData(t)||Z.hasData(t)},data:function(t,e,n){return K.access(t,e,n)},removeData:function(t,e){K.remove(t,e)},_data:function(t,e,n){return Z.access(t,e,n)},_removeData:function(t,e){Z.remove(t,e)}}),T.fn.extend({data:function(t,e){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===t){if(this.length&&(i=K.get(o),1===o.nodeType&&!Z.get(o,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=J(r.slice(5)),nt(o,r,i[r]));Z.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof t?this.each(function(){K.set(this,t)}):Y(this,function(e){var n;if(o&&void 0===e)return void 0!==(n=K.get(o,t))?n:void 0!==(n=nt(o,t))?n:void 0;this.each(function(){K.set(this,t,e)})},null,e,arguments.length>1,null,!0)},removeData:function(t){return this.each(function(){K.remove(this,t)})}}),T.extend({queue:function(t,e,n){var r;if(t)return e=(e||"fx")+"queue",r=Z.get(t,e),n&&(!r||Array.isArray(n)?r=Z.access(t,e,T.makeArray(n)):r.push(n)),r||[]},dequeue:function(t,e){e=e||"fx";var n=T.queue(t,e),r=n.length,i=n.shift(),o=T._queueHooks(t,e);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===e&&n.unshift("inprogress"),delete o.stop,i.call(t,function(){T.dequeue(t,e)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(t,e){var n=e+"queueHooks";return Z.get(t,n)||Z.access(t,n,{empty:T.Callbacks("once memory").add(function(){Z.remove(t,[e+"queue",n])})})}}),T.fn.extend({queue:function(t,e){var n=2;return"string"!=typeof t&&(e=t,t="fx",n--),arguments.length<n?T.queue(this[0],t):void 0===e?this:this.each(function(){var n=T.queue(this,t,e);T._queueHooks(this,t),"fx"===t&&"inprogress"!==n[0]&&T.dequeue(this,t)})},dequeue:function(t){return this.each(function(){T.dequeue(this,t)})},clearQueue:function(t){return this.queue(t||"fx",[])},promise:function(t,e){var n,r=1,i=T.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof t&&(e=t,t=void 0),t=t||"fx";a--;)(n=Z.get(o[a],t+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(e)}});var rt=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,it=new RegExp("^(?:([+-])=|)("+rt+")([a-z%]*)$","i"),ot=["Top","Right","Bottom","Left"],at=function(t,e){return"none"===(t=e||t).style.display||""===t.style.display&&T.contains(t.ownerDocument,t)&&"none"===T.css(t,"display")},st=function(t,e,n,r){var i,o,a={};for(o in e)a[o]=t.style[o],t.style[o]=e[o];for(o in i=n.apply(t,r||[]),e)t.style[o]=a[o];return i};function ct(t,e,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return T.css(t,e,"")},c=s(),u=n&&n[3]||(T.cssNumber[e]?"":"px"),f=(T.cssNumber[e]||"px"!==u&&+c)&&it.exec(T.css(t,e));if(f&&f[3]!==u){for(c/=2,u=u||f[3],f=+c||1;a--;)T.style(t,e,f+u),(1-o)*(1-(o=s()/c||.5))<=0&&(a=0),f/=o;f*=2,T.style(t,e,f+u),n=n||[]}return n&&(f=+f||+c||0,i=n[1]?f+(n[1]+1)*n[2]:+n[2],r&&(r.unit=u,r.start=f,r.end=i)),i}var ut={};function ft(t){var e,n=t.ownerDocument,r=t.nodeName,i=ut[r];return i||(e=n.body.appendChild(n.createElement(r)),i=T.css(e,"display"),e.parentNode.removeChild(e),"none"===i&&(i="block"),ut[r]=i,i)}function lt(t,e){for(var n,r,i=[],o=0,a=t.length;o<a;o++)(r=t[o]).style&&(n=r.style.display,e?("none"===n&&(i[o]=Z.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&at(r)&&(i[o]=ft(r))):"none"!==n&&(i[o]="none",Z.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(t[o].style.display=i[o]);return t}T.fn.extend({show:function(){return lt(this,!0)},hide:function(){return lt(this)},toggle:function(t){return"boolean"==typeof t?t?this.show():this.hide():this.each(function(){at(this)?T(this).show():T(this).hide()})}});var ht=/^(?:checkbox|radio)$/i,dt=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,pt=/^$|^module$|\/(?:java|ecma)script/i,yt={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function bt(t,e){var n;return n=void 0!==t.getElementsByTagName?t.getElementsByTagName(e||"*"):void 0!==t.querySelectorAll?t.querySelectorAll(e||"*"):[],void 0===e||e&&S(t,e)?T.merge([t],n):n}function gt(t,e){for(var n=0,r=t.length;n<r;n++)Z.set(t[n],"globalEval",!e||Z.get(e[n],"globalEval"))}yt.optgroup=yt.option,yt.tbody=yt.tfoot=yt.colgroup=yt.caption=yt.thead,yt.th=yt.td;var vt=/<|&#?\w+;/;function _t(t,e,n,r,i){for(var o,a,s,c,u,f,l=e.createDocumentFragment(),h=[],d=0,p=t.length;d<p;d++)if((o=t[d])||0===o)if("object"===w(o))T.merge(h,o.nodeType?[o]:o);else if(vt.test(o)){for(a=a||l.appendChild(e.createElement("div")),s=(dt.exec(o)||["",""])[1].toLowerCase(),c=yt[s]||yt._default,a.innerHTML=c[1]+T.htmlPrefilter(o)+c[2],f=c[0];f--;)a=a.lastChild;T.merge(h,a.childNodes),(a=l.firstChild).textContent=""}else h.push(e.createTextNode(o));for(l.textContent="",d=0;o=h[d++];)if(r&&T.inArray(o,r)>-1)i&&i.push(o);else if(u=T.contains(o.ownerDocument,o),a=bt(l.appendChild(o),"script"),u&&gt(a),n)for(f=0;o=a[f++];)pt.test(o.type||"")&&n.push(o);return l}!function(){var t=a.createDocumentFragment().appendChild(a.createElement("div")),e=a.createElement("input");e.setAttribute("type","radio"),e.setAttribute("checked","checked"),e.setAttribute("name","t"),t.appendChild(e),g.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",g.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var mt=a.documentElement,xt=/^key/,wt=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Tt=/^([^.]*)(?:\.(.+)|)/;function Mt(){return!0}function At(){return!1}function kt(){try{return a.activeElement}catch(t){}}function Ct(t,e,n,r,i,o){var a,s;if("object"==typeof e){for(s in"string"!=typeof n&&(r=r||n,n=void 0),e)Ct(t,s,n,r,e[s],o);return t}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=At;else if(!i)return t;return 1===o&&(a=i,(i=function(t){return T().off(t),a.apply(this,arguments)}).guid=a.guid||(a.guid=T.guid++)),t.each(function(){T.event.add(this,e,i,r,n)})}T.event={global:{},add:function(t,e,n,r,i){var o,a,s,c,u,f,l,h,d,p,y,b=Z.get(t);if(b)for(n.handler&&(n=(o=n).handler,i=o.selector),i&&T.find.matchesSelector(mt,i),n.guid||(n.guid=T.guid++),(c=b.events)||(c=b.events={}),(a=b.handle)||(a=b.handle=function(e){return void 0!==T&&T.event.triggered!==e.type?T.event.dispatch.apply(t,arguments):void 0}),u=(e=(e||"").match(R)||[""]).length;u--;)d=y=(s=Tt.exec(e[u])||[])[1],p=(s[2]||"").split(".").sort(),d&&(l=T.event.special[d]||{},d=(i?l.delegateType:l.bindType)||d,l=T.event.special[d]||{},f=T.extend({type:d,origType:y,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&T.expr.match.needsContext.test(i),namespace:p.join(".")},o),(h=c[d])||((h=c[d]=[]).delegateCount=0,l.setup&&!1!==l.setup.call(t,r,p,a)||t.addEventListener&&t.addEventListener(d,a)),l.add&&(l.add.call(t,f),f.handler.guid||(f.handler.guid=n.guid)),i?h.splice(h.delegateCount++,0,f):h.push(f),T.event.global[d]=!0)},remove:function(t,e,n,r,i){var o,a,s,c,u,f,l,h,d,p,y,b=Z.hasData(t)&&Z.get(t);if(b&&(c=b.events)){for(u=(e=(e||"").match(R)||[""]).length;u--;)if(d=y=(s=Tt.exec(e[u])||[])[1],p=(s[2]||"").split(".").sort(),d){for(l=T.event.special[d]||{},h=c[d=(r?l.delegateType:l.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=h.length;o--;)f=h[o],!i&&y!==f.origType||n&&n.guid!==f.guid||s&&!s.test(f.namespace)||r&&r!==f.selector&&("**"!==r||!f.selector)||(h.splice(o,1),f.selector&&h.delegateCount--,l.remove&&l.remove.call(t,f));a&&!h.length&&(l.teardown&&!1!==l.teardown.call(t,p,b.handle)||T.removeEvent(t,d,b.handle),delete c[d])}else for(d in c)T.event.remove(t,d+e[u],n,r,!0);T.isEmptyObject(c)&&Z.remove(t,"handle events")}},dispatch:function(t){var e,n,r,i,o,a,s=T.event.fix(t),c=new Array(arguments.length),u=(Z.get(this,"events")||{})[s.type]||[],f=T.event.special[s.type]||{};for(c[0]=s,e=1;e<arguments.length;e++)c[e]=arguments[e];if(s.delegateTarget=this,!f.preDispatch||!1!==f.preDispatch.call(this,s)){for(a=T.event.handlers.call(this,s,u),e=0;(i=a[e++])&&!s.isPropagationStopped();)for(s.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!s.isImmediatePropagationStopped();)s.rnamespace&&!s.rnamespace.test(o.namespace)||(s.handleObj=o,s.data=o.data,void 0!==(r=((T.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,c))&&!1===(s.result=r)&&(s.preventDefault(),s.stopPropagation()));return f.postDispatch&&f.postDispatch.call(this,s),s.result}},handlers:function(t,e){var n,r,i,o,a,s=[],c=e.delegateCount,u=t.target;if(c&&u.nodeType&&!("click"===t.type&&t.button>=1))for(;u!==this;u=u.parentNode||this)if(1===u.nodeType&&("click"!==t.type||!0!==u.disabled)){for(o=[],a={},n=0;n<c;n++)void 0===a[i=(r=e[n]).selector+" "]&&(a[i]=r.needsContext?T(i,this).index(u)>-1:T.find(i,this,null,[u]).length),a[i]&&o.push(r);o.length&&s.push({elem:u,handlers:o})}return u=this,c<e.length&&s.push({elem:u,handlers:e.slice(c)}),s},addProp:function(t,e){Object.defineProperty(T.Event.prototype,t,{enumerable:!0,configurable:!0,get:v(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(t){return t[T.expando]?t:new T.Event(t)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==kt()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===kt()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&S(this,"input"))return this.click(),!1},_default:function(t){return S(t.target,"a")}},beforeunload:{postDispatch:function(t){void 0!==t.result&&t.originalEvent&&(t.originalEvent.returnValue=t.result)}}}},T.removeEvent=function(t,e,n){t.removeEventListener&&t.removeEventListener(e,n)},T.Event=function(t,e){if(!(this instanceof T.Event))return new T.Event(t,e);t&&t.type?(this.originalEvent=t,this.type=t.type,this.isDefaultPrevented=t.defaultPrevented||void 0===t.defaultPrevented&&!1===t.returnValue?Mt:At,this.target=t.target&&3===t.target.nodeType?t.target.parentNode:t.target,this.currentTarget=t.currentTarget,this.relatedTarget=t.relatedTarget):this.type=t,e&&T.extend(this,e),this.timeStamp=t&&t.timeStamp||Date.now(),this[T.expando]=!0},T.Event.prototype={constructor:T.Event,isDefaultPrevented:At,isPropagationStopped:At,isImmediatePropagationStopped:At,isSimulated:!1,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=Mt,t&&!this.isSimulated&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=Mt,t&&!this.isSimulated&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=Mt,t&&!this.isSimulated&&t.stopImmediatePropagation(),this.stopPropagation()}},T.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(t){var e=t.button;return null==t.which&&xt.test(t.type)?null!=t.charCode?t.charCode:t.keyCode:!t.which&&void 0!==e&&wt.test(t.type)?1&e?1:2&e?3:4&e?2:0:t.which}},T.event.addProp),T.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(t,e){T.event.special[t]={delegateType:e,bindType:e,handle:function(t){var n,r=t.relatedTarget,i=t.handleObj;return r&&(r===this||T.contains(this,r))||(t.type=i.origType,n=i.handler.apply(this,arguments),t.type=e),n}}}),T.fn.extend({on:function(t,e,n,r){return Ct(this,t,e,n,r)},one:function(t,e,n,r){return Ct(this,t,e,n,r,1)},off:function(t,e,n){var r,i;if(t&&t.preventDefault&&t.handleObj)return r=t.handleObj,T(t.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof t){for(i in t)this.off(i,e,t[i]);return this}return!1!==e&&"function"!=typeof e||(n=e,e=void 0),!1===n&&(n=At),this.each(function(){T.event.remove(this,t,n,e)})}});var Et=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Nt=/<script|<style|<link/i,St=/checked\s*(?:[^=]|=\s*.checked.)/i,Dt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Lt(t,e){return S(t,"table")&&S(11!==e.nodeType?e:e.firstChild,"tr")&&T(t).children("tbody")[0]||t}function jt(t){return t.type=(null!==t.getAttribute("type"))+"/"+t.type,t}function qt(t){return"true/"===(t.type||"").slice(0,5)?t.type=t.type.slice(5):t.removeAttribute("type"),t}function Pt(t,e){var n,r,i,o,a,s,c,u;if(1===e.nodeType){if(Z.hasData(t)&&(o=Z.access(t),a=Z.set(e,o),u=o.events))for(i in delete a.handle,a.events={},u)for(n=0,r=u[i].length;n<r;n++)T.event.add(e,i,u[i][n]);K.hasData(t)&&(s=K.access(t),c=T.extend({},s),K.set(e,c))}}function Ot(t,e){var n=e.nodeName.toLowerCase();"input"===n&&ht.test(t.type)?e.checked=t.checked:"input"!==n&&"textarea"!==n||(e.defaultValue=t.defaultValue)}function Ut(t,e,n,r){e=u.apply([],e);var i,o,a,s,c,f,l=0,h=t.length,d=h-1,p=e[0],y=v(p);if(y||h>1&&"string"==typeof p&&!g.checkClone&&St.test(p))return t.each(function(i){var o=t.eq(i);y&&(e[0]=p.call(this,i,o.html())),Ut(o,e,n,r)});if(h&&(o=(i=_t(e,t[0].ownerDocument,!1,t,r)).firstChild,1===i.childNodes.length&&(i=o),o||r)){for(s=(a=T.map(bt(i,"script"),jt)).length;l<h;l++)c=i,l!==d&&(c=T.clone(c,!0,!0),s&&T.merge(a,bt(c,"script"))),n.call(t[l],c,l);if(s)for(f=a[a.length-1].ownerDocument,T.map(a,qt),l=0;l<s;l++)c=a[l],pt.test(c.type||"")&&!Z.access(c,"globalEval")&&T.contains(f,c)&&(c.src&&"module"!==(c.type||"").toLowerCase()?T._evalUrl&&T._evalUrl(c.src):x(c.textContent.replace(Dt,""),f,c))}return t}function Rt(t,e,n){for(var r,i=e?T.filter(e,t):t,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||T.cleanData(bt(r)),r.parentNode&&(n&&T.contains(r.ownerDocument,r)&&gt(bt(r,"script")),r.parentNode.removeChild(r));return t}T.extend({htmlPrefilter:function(t){return t.replace(Et,"<$1></$2>")},clone:function(t,e,n){var r,i,o,a,s=t.cloneNode(!0),c=T.contains(t.ownerDocument,t);if(!(g.noCloneChecked||1!==t.nodeType&&11!==t.nodeType||T.isXMLDoc(t)))for(a=bt(s),r=0,i=(o=bt(t)).length;r<i;r++)Ot(o[r],a[r]);if(e)if(n)for(o=o||bt(t),a=a||bt(s),r=0,i=o.length;r<i;r++)Pt(o[r],a[r]);else Pt(t,s);return(a=bt(s,"script")).length>0&&gt(a,!c&&bt(t,"script")),s},cleanData:function(t){for(var e,n,r,i=T.event.special,o=0;void 0!==(n=t[o]);o++)if(Q(n)){if(e=n[Z.expando]){if(e.events)for(r in e.events)i[r]?T.event.remove(n,r):T.removeEvent(n,r,e.handle);n[Z.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),T.fn.extend({detach:function(t){return Rt(this,t,!0)},remove:function(t){return Rt(this,t)},text:function(t){return Y(this,function(t){return void 0===t?T.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=t)})},null,t,arguments.length)},append:function(){return Ut(this,arguments,function(t){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Lt(this,t).appendChild(t)})},prepend:function(){return Ut(this,arguments,function(t){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var e=Lt(this,t);e.insertBefore(t,e.firstChild)}})},before:function(){return Ut(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this)})},after:function(){return Ut(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this.nextSibling)})},empty:function(){for(var t,e=0;null!=(t=this[e]);e++)1===t.nodeType&&(T.cleanData(bt(t,!1)),t.textContent="");return this},clone:function(t,e){return t=null!=t&&t,e=null==e?t:e,this.map(function(){return T.clone(this,t,e)})},html:function(t){return Y(this,function(t){var e=this[0]||{},n=0,r=this.length;if(void 0===t&&1===e.nodeType)return e.innerHTML;if("string"==typeof t&&!Nt.test(t)&&!yt[(dt.exec(t)||["",""])[1].toLowerCase()]){t=T.htmlPrefilter(t);try{for(;n<r;n++)1===(e=this[n]||{}).nodeType&&(T.cleanData(bt(e,!1)),e.innerHTML=t);e=0}catch(t){}}e&&this.empty().append(t)},null,t,arguments.length)},replaceWith:function(){var t=[];return Ut(this,arguments,function(e){var n=this.parentNode;T.inArray(this,t)<0&&(T.cleanData(bt(this)),n&&n.replaceChild(e,this))},t)}}),T.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,e){T.fn[t]=function(t){for(var n,r=[],i=T(t),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),T(i[a])[e](n),f.apply(r,n.get());return this.pushStack(r)}});var Ht=new RegExp("^("+rt+")(?!px)[a-z%]+$","i"),Ft=function(t){var e=t.ownerDocument.defaultView;return e&&e.opener||(e=n),e.getComputedStyle(t)},It=new RegExp(ot.join("|"),"i");function Bt(t,e,n){var r,i,o,a,s=t.style;return(n=n||Ft(t))&&(""!==(a=n.getPropertyValue(e)||n[e])||T.contains(t.ownerDocument,t)||(a=T.style(t,e)),!g.pixelBoxStyles()&&Ht.test(a)&&It.test(e)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function zt(t,e){return{get:function(){if(!t())return(this.get=e).apply(this,arguments);delete this.get}}}!function(){function t(){if(f){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",f.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",mt.appendChild(u).appendChild(f);var t=n.getComputedStyle(f);r="1%"!==t.top,c=12===e(t.marginLeft),f.style.right="60%",s=36===e(t.right),i=36===e(t.width),f.style.position="absolute",o=36===f.offsetWidth||"absolute",mt.removeChild(u),f=null}}function e(t){return Math.round(parseFloat(t))}var r,i,o,s,c,u=a.createElement("div"),f=a.createElement("div");f.style&&(f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",g.clearCloneStyle="content-box"===f.style.backgroundClip,T.extend(g,{boxSizingReliable:function(){return t(),i},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),r},reliableMarginLeft:function(){return t(),c},scrollboxSize:function(){return t(),o}}))}();var $t=/^(none|table(?!-c[ea]).+)/,Yt=/^--/,Wt={position:"absolute",visibility:"hidden",display:"block"},Xt={letterSpacing:"0",fontWeight:"400"},Vt=["Webkit","Moz","ms"],Jt=a.createElement("div").style;function Qt(t){var e=T.cssProps[t];return e||(e=T.cssProps[t]=function(t){if(t in Jt)return t;for(var e=t[0].toUpperCase()+t.slice(1),n=Vt.length;n--;)if((t=Vt[n]+e)in Jt)return t}(t)||t),e}function Gt(t,e,n){var r=it.exec(e);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):e}function Zt(t,e,n,r,i,o){var a="width"===e?1:0,s=0,c=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(c+=T.css(t,n+ot[a],!0,i)),r?("content"===n&&(c-=T.css(t,"padding"+ot[a],!0,i)),"margin"!==n&&(c-=T.css(t,"border"+ot[a]+"Width",!0,i))):(c+=T.css(t,"padding"+ot[a],!0,i),"padding"!==n?c+=T.css(t,"border"+ot[a]+"Width",!0,i):s+=T.css(t,"border"+ot[a]+"Width",!0,i));return!r&&o>=0&&(c+=Math.max(0,Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-o-c-s-.5))),c}function Kt(t,e,n){var r=Ft(t),i=Bt(t,e,r),o="border-box"===T.css(t,"boxSizing",!1,r),a=o;if(Ht.test(i)){if(!n)return i;i="auto"}return a=a&&(g.boxSizingReliable()||i===t.style[e]),("auto"===i||!parseFloat(i)&&"inline"===T.css(t,"display",!1,r))&&(i=t["offset"+e[0].toUpperCase()+e.slice(1)],a=!0),(i=parseFloat(i)||0)+Zt(t,e,n||(o?"border":"content"),a,r,i)+"px"}function te(t,e,n,r,i){return new te.prototype.init(t,e,n,r,i)}T.extend({cssHooks:{opacity:{get:function(t,e){if(e){var n=Bt(t,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(t,e,n,r){if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){var i,o,a,s=J(e),c=Yt.test(e),u=t.style;if(c||(e=Qt(s)),a=T.cssHooks[e]||T.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(t,!1,r))?i:u[e];"string"===(o=typeof n)&&(i=it.exec(n))&&i[1]&&(n=ct(t,e,i),o="number"),null!=n&&n==n&&("number"===o&&(n+=i&&i[3]||(T.cssNumber[s]?"":"px")),g.clearCloneStyle||""!==n||0!==e.indexOf("background")||(u[e]="inherit"),a&&"set"in a&&void 0===(n=a.set(t,n,r))||(c?u.setProperty(e,n):u[e]=n))}},css:function(t,e,n,r){var i,o,a,s=J(e);return Yt.test(e)||(e=Qt(s)),(a=T.cssHooks[e]||T.cssHooks[s])&&"get"in a&&(i=a.get(t,!0,n)),void 0===i&&(i=Bt(t,e,r)),"normal"===i&&e in Xt&&(i=Xt[e]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),T.each(["height","width"],function(t,e){T.cssHooks[e]={get:function(t,n,r){if(n)return!$t.test(T.css(t,"display"))||t.getClientRects().length&&t.getBoundingClientRect().width?Kt(t,e,r):st(t,Wt,function(){return Kt(t,e,r)})},set:function(t,n,r){var i,o=Ft(t),a="border-box"===T.css(t,"boxSizing",!1,o),s=r&&Zt(t,e,r,a,o);return a&&g.scrollboxSize()===o.position&&(s-=Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-parseFloat(o[e])-Zt(t,e,"border",!1,o)-.5)),s&&(i=it.exec(n))&&"px"!==(i[3]||"px")&&(t.style[e]=n,n=T.css(t,e)),Gt(0,n,s)}}}),T.cssHooks.marginLeft=zt(g.reliableMarginLeft,function(t,e){if(e)return(parseFloat(Bt(t,"marginLeft"))||t.getBoundingClientRect().left-st(t,{marginLeft:0},function(){return t.getBoundingClientRect().left}))+"px"}),T.each({margin:"",padding:"",border:"Width"},function(t,e){T.cssHooks[t+e]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[t+ot[r]+e]=o[r]||o[r-2]||o[0];return i}},"margin"!==t&&(T.cssHooks[t+e].set=Gt)}),T.fn.extend({css:function(t,e){return Y(this,function(t,e,n){var r,i,o={},a=0;if(Array.isArray(e)){for(r=Ft(t),i=e.length;a<i;a++)o[e[a]]=T.css(t,e[a],!1,r);return o}return void 0!==n?T.style(t,e,n):T.css(t,e)},t,e,arguments.length>1)}}),T.Tween=te,te.prototype={constructor:te,init:function(t,e,n,r,i,o){this.elem=t,this.prop=n,this.easing=i||T.easing._default,this.options=e,this.start=this.now=this.cur(),this.end=r,this.unit=o||(T.cssNumber[n]?"":"px")},cur:function(){var t=te.propHooks[this.prop];return t&&t.get?t.get(this):te.propHooks._default.get(this)},run:function(t){var e,n=te.propHooks[this.prop];return this.options.duration?this.pos=e=T.easing[this.easing](t,this.options.duration*t,0,1,this.options.duration):this.pos=e=t,this.now=(this.end-this.start)*e+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):te.propHooks._default.set(this),this}},te.prototype.init.prototype=te.prototype,te.propHooks={_default:{get:function(t){var e;return 1!==t.elem.nodeType||null!=t.elem[t.prop]&&null==t.elem.style[t.prop]?t.elem[t.prop]:(e=T.css(t.elem,t.prop,""))&&"auto"!==e?e:0},set:function(t){T.fx.step[t.prop]?T.fx.step[t.prop](t):1!==t.elem.nodeType||null==t.elem.style[T.cssProps[t.prop]]&&!T.cssHooks[t.prop]?t.elem[t.prop]=t.now:T.style(t.elem,t.prop,t.now+t.unit)}}},te.propHooks.scrollTop=te.propHooks.scrollLeft={set:function(t){t.elem.nodeType&&t.elem.parentNode&&(t.elem[t.prop]=t.now)}},T.easing={linear:function(t){return t},swing:function(t){return.5-Math.cos(t*Math.PI)/2},_default:"swing"},T.fx=te.prototype.init,T.fx.step={};var ee,ne,re=/^(?:toggle|show|hide)$/,ie=/queueHooks$/;function oe(){ne&&(!1===a.hidden&&n.requestAnimationFrame?n.requestAnimationFrame(oe):n.setTimeout(oe,T.fx.interval),T.fx.tick())}function ae(){return n.setTimeout(function(){ee=void 0}),ee=Date.now()}function se(t,e){var n,r=0,i={height:t};for(e=e?1:0;r<4;r+=2-e)i["margin"+(n=ot[r])]=i["padding"+n]=t;return e&&(i.opacity=i.width=t),i}function ce(t,e,n){for(var r,i=(ue.tweeners[e]||[]).concat(ue.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,e,t))return r}function ue(t,e,n){var r,i,o=0,a=ue.prefilters.length,s=T.Deferred().always(function(){delete c.elem}),c=function(){if(i)return!1;for(var e=ee||ae(),n=Math.max(0,u.startTime+u.duration-e),r=1-(n/u.duration||0),o=0,a=u.tweens.length;o<a;o++)u.tweens[o].run(r);return s.notifyWith(t,[u,r,n]),r<1&&a?n:(a||s.notifyWith(t,[u,1,0]),s.resolveWith(t,[u]),!1)},u=s.promise({elem:t,props:T.extend({},e),opts:T.extend(!0,{specialEasing:{},easing:T.easing._default},n),originalProperties:e,originalOptions:n,startTime:ee||ae(),duration:n.duration,tweens:[],createTween:function(e,n){var r=T.Tween(t,u.opts,e,n,u.opts.specialEasing[e]||u.opts.easing);return u.tweens.push(r),r},stop:function(e){var n=0,r=e?u.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)u.tweens[n].run(1);return e?(s.notifyWith(t,[u,1,0]),s.resolveWith(t,[u,e])):s.rejectWith(t,[u,e]),this}}),f=u.props;for(!function(t,e){var n,r,i,o,a;for(n in t)if(i=e[r=J(n)],o=t[n],Array.isArray(o)&&(i=o[1],o=t[n]=o[0]),n!==r&&(t[r]=o,delete t[n]),(a=T.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete t[r],o)n in t||(t[n]=o[n],e[n]=i);else e[r]=i}(f,u.opts.specialEasing);o<a;o++)if(r=ue.prefilters[o].call(u,t,f,u.opts))return v(r.stop)&&(T._queueHooks(u.elem,u.opts.queue).stop=r.stop.bind(r)),r;return T.map(f,ce,u),v(u.opts.start)&&u.opts.start.call(t,u),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always),T.fx.timer(T.extend(c,{elem:t,anim:u,queue:u.opts.queue})),u}T.Animation=T.extend(ue,{tweeners:{"*":[function(t,e){var n=this.createTween(t,e);return ct(n.elem,t,it.exec(e),n),n}]},tweener:function(t,e){v(t)?(e=t,t=["*"]):t=t.match(R);for(var n,r=0,i=t.length;r<i;r++)n=t[r],ue.tweeners[n]=ue.tweeners[n]||[],ue.tweeners[n].unshift(e)},prefilters:[function(t,e,n){var r,i,o,a,s,c,u,f,l="width"in e||"height"in e,h=this,d={},p=t.style,y=t.nodeType&&at(t),b=Z.get(t,"fxshow");for(r in n.queue||(null==(a=T._queueHooks(t,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,h.always(function(){h.always(function(){a.unqueued--,T.queue(t,"fx").length||a.empty.fire()})})),e)if(i=e[r],re.test(i)){if(delete e[r],o=o||"toggle"===i,i===(y?"hide":"show")){if("show"!==i||!b||void 0===b[r])continue;y=!0}d[r]=b&&b[r]||T.style(t,r)}if((c=!T.isEmptyObject(e))||!T.isEmptyObject(d))for(r in l&&1===t.nodeType&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],null==(u=b&&b.display)&&(u=Z.get(t,"display")),"none"===(f=T.css(t,"display"))&&(u?f=u:(lt([t],!0),u=t.style.display||u,f=T.css(t,"display"),lt([t]))),("inline"===f||"inline-block"===f&&null!=u)&&"none"===T.css(t,"float")&&(c||(h.done(function(){p.display=u}),null==u&&(f=p.display,u="none"===f?"":f)),p.display="inline-block")),n.overflow&&(p.overflow="hidden",h.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]})),c=!1,d)c||(b?"hidden"in b&&(y=b.hidden):b=Z.access(t,"fxshow",{display:u}),o&&(b.hidden=!y),y&&lt([t],!0),h.done(function(){for(r in y||lt([t]),Z.remove(t,"fxshow"),d)T.style(t,r,d[r])})),c=ce(y?b[r]:0,r,h),r in b||(b[r]=c.start,y&&(c.end=c.start,c.start=0))}],prefilter:function(t,e){e?ue.prefilters.unshift(t):ue.prefilters.push(t)}}),T.speed=function(t,e,n){var r=t&&"object"==typeof t?T.extend({},t):{complete:n||!n&&e||v(t)&&t,duration:t,easing:n&&e||e&&!v(e)&&e};return T.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in T.fx.speeds?r.duration=T.fx.speeds[r.duration]:r.duration=T.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){v(r.old)&&r.old.call(this),r.queue&&T.dequeue(this,r.queue)},r},T.fn.extend({fadeTo:function(t,e,n,r){return this.filter(at).css("opacity",0).show().end().animate({opacity:e},t,n,r)},animate:function(t,e,n,r){var i=T.isEmptyObject(t),o=T.speed(e,n,r),a=function(){var e=ue(this,T.extend({},t),o);(i||Z.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(t,e,n){var r=function(t){var e=t.stop;delete t.stop,e(n)};return"string"!=typeof t&&(n=e,e=t,t=void 0),e&&!1!==t&&this.queue(t||"fx",[]),this.each(function(){var e=!0,i=null!=t&&t+"queueHooks",o=T.timers,a=Z.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ie.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=t&&o[i].queue!==t||(o[i].anim.stop(n),e=!1,o.splice(i,1));!e&&n||T.dequeue(this,t)})},finish:function(t){return!1!==t&&(t=t||"fx"),this.each(function(){var e,n=Z.get(this),r=n[t+"queue"],i=n[t+"queueHooks"],o=T.timers,a=r?r.length:0;for(n.finish=!0,T.queue(this,t,[]),i&&i.stop&&i.stop.call(this,!0),e=o.length;e--;)o[e].elem===this&&o[e].queue===t&&(o[e].anim.stop(!0),o.splice(e,1));for(e=0;e<a;e++)r[e]&&r[e].finish&&r[e].finish.call(this);delete n.finish})}}),T.each(["toggle","show","hide"],function(t,e){var n=T.fn[e];T.fn[e]=function(t,r,i){return null==t||"boolean"==typeof t?n.apply(this,arguments):this.animate(se(e,!0),t,r,i)}}),T.each({slideDown:se("show"),slideUp:se("hide"),slideToggle:se("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(t,e){T.fn[t]=function(t,n,r){return this.animate(e,t,n,r)}}),T.timers=[],T.fx.tick=function(){var t,e=0,n=T.timers;for(ee=Date.now();e<n.length;e++)(t=n[e])()||n[e]!==t||n.splice(e--,1);n.length||T.fx.stop(),ee=void 0},T.fx.timer=function(t){T.timers.push(t),T.fx.start()},T.fx.interval=13,T.fx.start=function(){ne||(ne=!0,oe())},T.fx.stop=function(){ne=null},T.fx.speeds={slow:600,fast:200,_default:400},T.fn.delay=function(t,e){return t=T.fx&&T.fx.speeds[t]||t,e=e||"fx",this.queue(e,function(e,r){var i=n.setTimeout(e,t);r.stop=function(){n.clearTimeout(i)}})},function(){var t=a.createElement("input"),e=a.createElement("select").appendChild(a.createElement("option"));t.type="checkbox",g.checkOn=""!==t.value,g.optSelected=e.selected,(t=a.createElement("input")).value="t",t.type="radio",g.radioValue="t"===t.value}();var fe,le=T.expr.attrHandle;T.fn.extend({attr:function(t,e){return Y(this,T.attr,t,e,arguments.length>1)},removeAttr:function(t){return this.each(function(){T.removeAttr(this,t)})}}),T.extend({attr:function(t,e,n){var r,i,o=t.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===t.getAttribute?T.prop(t,e,n):(1===o&&T.isXMLDoc(t)||(i=T.attrHooks[e.toLowerCase()]||(T.expr.match.bool.test(e)?fe:void 0)),void 0!==n?null===n?void T.removeAttr(t,e):i&&"set"in i&&void 0!==(r=i.set(t,n,e))?r:(t.setAttribute(e,n+""),n):i&&"get"in i&&null!==(r=i.get(t,e))?r:null==(r=T.find.attr(t,e))?void 0:r)},attrHooks:{type:{set:function(t,e){if(!g.radioValue&&"radio"===e&&S(t,"input")){var n=t.value;return t.setAttribute("type",e),n&&(t.value=n),e}}}},removeAttr:function(t,e){var n,r=0,i=e&&e.match(R);if(i&&1===t.nodeType)for(;n=i[r++];)t.removeAttribute(n)}}),fe={set:function(t,e,n){return!1===e?T.removeAttr(t,n):t.setAttribute(n,n),n}},T.each(T.expr.match.bool.source.match(/\w+/g),function(t,e){var n=le[e]||T.find.attr;le[e]=function(t,e,r){var i,o,a=e.toLowerCase();return r||(o=le[a],le[a]=i,i=null!=n(t,e,r)?a:null,le[a]=o),i}});var he=/^(?:input|select|textarea|button)$/i,de=/^(?:a|area)$/i;function pe(t){return(t.match(R)||[]).join(" ")}function ye(t){return t.getAttribute&&t.getAttribute("class")||""}function be(t){return Array.isArray(t)?t:"string"==typeof t&&t.match(R)||[]}T.fn.extend({prop:function(t,e){return Y(this,T.prop,t,e,arguments.length>1)},removeProp:function(t){return this.each(function(){delete this[T.propFix[t]||t]})}}),T.extend({prop:function(t,e,n){var r,i,o=t.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&T.isXMLDoc(t)||(e=T.propFix[e]||e,i=T.propHooks[e]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(t,n,e))?r:t[e]=n:i&&"get"in i&&null!==(r=i.get(t,e))?r:t[e]},propHooks:{tabIndex:{get:function(t){var e=T.find.attr(t,"tabindex");return e?parseInt(e,10):he.test(t.nodeName)||de.test(t.nodeName)&&t.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),g.optSelected||(T.propHooks.selected={get:function(t){var e=t.parentNode;return e&&e.parentNode&&e.parentNode.selectedIndex,null},set:function(t){var e=t.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}}),T.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){T.propFix[this.toLowerCase()]=this}),T.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,c=0;if(v(t))return this.each(function(e){T(this).addClass(t.call(this,e,ye(this)))});if((e=be(t)).length)for(;n=this[c++];)if(i=ye(n),r=1===n.nodeType&&" "+pe(i)+" "){for(a=0;o=e[a++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=pe(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,c=0;if(v(t))return this.each(function(e){T(this).removeClass(t.call(this,e,ye(this)))});if(!arguments.length)return this.attr("class","");if((e=be(t)).length)for(;n=this[c++];)if(i=ye(n),r=1===n.nodeType&&" "+pe(i)+" "){for(a=0;o=e[a++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");i!==(s=pe(r))&&n.setAttribute("class",s)}return this},toggleClass:function(t,e){var n=typeof t,r="string"===n||Array.isArray(t);return"boolean"==typeof e&&r?e?this.addClass(t):this.removeClass(t):v(t)?this.each(function(n){T(this).toggleClass(t.call(this,n,ye(this),e),e)}):this.each(function(){var e,i,o,a;if(r)for(i=0,o=T(this),a=be(t);e=a[i++];)o.hasClass(e)?o.removeClass(e):o.addClass(e);else void 0!==t&&"boolean"!==n||((e=ye(this))&&Z.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===t?"":Z.get(this,"__className__")||""))})},hasClass:function(t){var e,n,r=0;for(e=" "+t+" ";n=this[r++];)if(1===n.nodeType&&(" "+pe(ye(n))+" ").indexOf(e)>-1)return!0;return!1}});var ge=/\r/g;T.fn.extend({val:function(t){var e,n,r,i=this[0];return arguments.length?(r=v(t),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?t.call(this,n,T(this).val()):t)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=T.map(i,function(t){return null==t?"":t+""})),(e=T.valHooks[this.type]||T.valHooks[this.nodeName.toLowerCase()])&&"set"in e&&void 0!==e.set(this,i,"value")||(this.value=i))})):i?(e=T.valHooks[i.type]||T.valHooks[i.nodeName.toLowerCase()])&&"get"in e&&void 0!==(n=e.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(ge,""):null==n?"":n:void 0}}),T.extend({valHooks:{option:{get:function(t){var e=T.find.attr(t,"value");return null!=e?e:pe(T.text(t))}},select:{get:function(t){var e,n,r,i=t.options,o=t.selectedIndex,a="select-one"===t.type,s=a?null:[],c=a?o+1:i.length;for(r=o<0?c:a?o:0;r<c;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!S(n.parentNode,"optgroup"))){if(e=T(n).val(),a)return e;s.push(e)}return s},set:function(t,e){for(var n,r,i=t.options,o=T.makeArray(e),a=i.length;a--;)((r=i[a]).selected=T.inArray(T.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(t.selectedIndex=-1),o}}}}),T.each(["radio","checkbox"],function(){T.valHooks[this]={set:function(t,e){if(Array.isArray(e))return t.checked=T.inArray(T(t).val(),e)>-1}},g.checkOn||(T.valHooks[this].get=function(t){return null===t.getAttribute("value")?"on":t.value})}),g.focusin="onfocusin"in n;var ve=/^(?:focusinfocus|focusoutblur)$/,_e=function(t){t.stopPropagation()};T.extend(T.event,{trigger:function(t,e,r,i){var o,s,c,u,f,l,h,d,y=[r||a],b=p.call(t,"type")?t.type:t,g=p.call(t,"namespace")?t.namespace.split("."):[];if(s=d=c=r=r||a,3!==r.nodeType&&8!==r.nodeType&&!ve.test(b+T.event.triggered)&&(b.indexOf(".")>-1&&(b=(g=b.split(".")).shift(),g.sort()),f=b.indexOf(":")<0&&"on"+b,(t=t[T.expando]?t:new T.Event(b,"object"==typeof t&&t)).isTrigger=i?2:3,t.namespace=g.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),e=null==e?[t]:T.makeArray(e,[t]),h=T.event.special[b]||{},i||!h.trigger||!1!==h.trigger.apply(r,e))){if(!i&&!h.noBubble&&!_(r)){for(u=h.delegateType||b,ve.test(u+b)||(s=s.parentNode);s;s=s.parentNode)y.push(s),c=s;c===(r.ownerDocument||a)&&y.push(c.defaultView||c.parentWindow||n)}for(o=0;(s=y[o++])&&!t.isPropagationStopped();)d=s,t.type=o>1?u:h.bindType||b,(l=(Z.get(s,"events")||{})[t.type]&&Z.get(s,"handle"))&&l.apply(s,e),(l=f&&s[f])&&l.apply&&Q(s)&&(t.result=l.apply(s,e),!1===t.result&&t.preventDefault());return t.type=b,i||t.isDefaultPrevented()||h._default&&!1!==h._default.apply(y.pop(),e)||!Q(r)||f&&v(r[b])&&!_(r)&&((c=r[f])&&(r[f]=null),T.event.triggered=b,t.isPropagationStopped()&&d.addEventListener(b,_e),r[b](),t.isPropagationStopped()&&d.removeEventListener(b,_e),T.event.triggered=void 0,c&&(r[f]=c)),t.result}},simulate:function(t,e,n){var r=T.extend(new T.Event,n,{type:t,isSimulated:!0});T.event.trigger(r,null,e)}}),T.fn.extend({trigger:function(t,e){return this.each(function(){T.event.trigger(t,e,this)})},triggerHandler:function(t,e){var n=this[0];if(n)return T.event.trigger(t,e,n,!0)}}),g.focusin||T.each({focus:"focusin",blur:"focusout"},function(t,e){var n=function(t){T.event.simulate(e,t.target,T.event.fix(t))};T.event.special[e]={setup:function(){var r=this.ownerDocument||this,i=Z.access(r,e);i||r.addEventListener(t,n,!0),Z.access(r,e,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=Z.access(r,e)-1;i?Z.access(r,e,i):(r.removeEventListener(t,n,!0),Z.remove(r,e))}}});var me=n.location,xe=Date.now(),we=/\?/;T.parseXML=function(t){var e;if(!t||"string"!=typeof t)return null;try{e=(new n.DOMParser).parseFromString(t,"text/xml")}catch(t){e=void 0}return e&&!e.getElementsByTagName("parsererror").length||T.error("Invalid XML: "+t),e};var Te=/\[\]$/,Me=/\r?\n/g,Ae=/^(?:submit|button|image|reset|file)$/i,ke=/^(?:input|select|textarea|keygen)/i;function Ce(t,e,n,r){var i;if(Array.isArray(e))T.each(e,function(e,i){n||Te.test(t)?r(t,i):Ce(t+"["+("object"==typeof i&&null!=i?e:"")+"]",i,n,r)});else if(n||"object"!==w(e))r(t,e);else for(i in e)Ce(t+"["+i+"]",e[i],n,r)}T.param=function(t,e){var n,r=[],i=function(t,e){var n=v(e)?e():e;r[r.length]=encodeURIComponent(t)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(t)||t.jquery&&!T.isPlainObject(t))T.each(t,function(){i(this.name,this.value)});else for(n in t)Ce(n,t[n],e,i);return r.join("&")},T.fn.extend({serialize:function(){return T.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var t=T.prop(this,"elements");return t?T.makeArray(t):this}).filter(function(){var t=this.type;return this.name&&!T(this).is(":disabled")&&ke.test(this.nodeName)&&!Ae.test(t)&&(this.checked||!ht.test(t))}).map(function(t,e){var n=T(this).val();return null==n?null:Array.isArray(n)?T.map(n,function(t){return{name:e.name,value:t.replace(Me,"\r\n")}}):{name:e.name,value:n.replace(Me,"\r\n")}}).get()}});var Ee=/%20/g,Ne=/#.*$/,Se=/([?&])_=[^&]*/,De=/^(.*?):[ \t]*([^\r\n]*)$/gm,Le=/^(?:GET|HEAD)$/,je=/^\/\//,qe={},Pe={},Oe="*/".concat("*"),Ue=a.createElement("a");function Re(t){return function(e,n){"string"!=typeof e&&(n=e,e="*");var r,i=0,o=e.toLowerCase().match(R)||[];if(v(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(t[r]=t[r]||[]).unshift(n)):(t[r]=t[r]||[]).push(n)}}function He(t,e,n,r){var i={},o=t===Pe;function a(s){var c;return i[s]=!0,T.each(t[s]||[],function(t,s){var u=s(e,n,r);return"string"!=typeof u||o||i[u]?o?!(c=u):void 0:(e.dataTypes.unshift(u),a(u),!1)}),c}return a(e.dataTypes[0])||!i["*"]&&a("*")}function Fe(t,e){var n,r,i=T.ajaxSettings.flatOptions||{};for(n in e)void 0!==e[n]&&((i[n]?t:r||(r={}))[n]=e[n]);return r&&T.extend(!0,t,r),t}Ue.href=me.href,T.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:me.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(me.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Oe,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":T.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(t,e){return e?Fe(Fe(t,T.ajaxSettings),e):Fe(T.ajaxSettings,t)},ajaxPrefilter:Re(qe),ajaxTransport:Re(Pe),ajax:function(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{};var r,i,o,s,c,u,f,l,h,d,p=T.ajaxSetup({},e),y=p.context||p,b=p.context&&(y.nodeType||y.jquery)?T(y):T.event,g=T.Deferred(),v=T.Callbacks("once memory"),_=p.statusCode||{},m={},x={},w="canceled",M={readyState:0,getResponseHeader:function(t){var e;if(f){if(!s)for(s={};e=De.exec(o);)s[e[1].toLowerCase()]=e[2];e=s[t.toLowerCase()]}return null==e?null:e},getAllResponseHeaders:function(){return f?o:null},setRequestHeader:function(t,e){return null==f&&(t=x[t.toLowerCase()]=x[t.toLowerCase()]||t,m[t]=e),this},overrideMimeType:function(t){return null==f&&(p.mimeType=t),this},statusCode:function(t){var e;if(t)if(f)M.always(t[M.status]);else for(e in t)_[e]=[_[e],t[e]];return this},abort:function(t){var e=t||w;return r&&r.abort(e),A(0,e),this}};if(g.promise(M),p.url=((t||p.url||me.href)+"").replace(je,me.protocol+"//"),p.type=e.method||e.type||p.method||p.type,p.dataTypes=(p.dataType||"*").toLowerCase().match(R)||[""],null==p.crossDomain){u=a.createElement("a");try{u.href=p.url,u.href=u.href,p.crossDomain=Ue.protocol+"//"+Ue.host!=u.protocol+"//"+u.host}catch(t){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=T.param(p.data,p.traditional)),He(qe,p,e,M),f)return M;for(h in(l=T.event&&p.global)&&0==T.active++&&T.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Le.test(p.type),i=p.url.replace(Ne,""),p.hasContent?p.data&&p.processData&&0===(p.contentType||"").indexOf("application/x-www-form-urlencoded")&&(p.data=p.data.replace(Ee,"+")):(d=p.url.slice(i.length),p.data&&(p.processData||"string"==typeof p.data)&&(i+=(we.test(i)?"&":"?")+p.data,delete p.data),!1===p.cache&&(i=i.replace(Se,"$1"),d=(we.test(i)?"&":"?")+"_="+xe+++d),p.url=i+d),p.ifModified&&(T.lastModified[i]&&M.setRequestHeader("If-Modified-Since",T.lastModified[i]),T.etag[i]&&M.setRequestHeader("If-None-Match",T.etag[i])),(p.data&&p.hasContent&&!1!==p.contentType||e.contentType)&&M.setRequestHeader("Content-Type",p.contentType),M.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Oe+"; q=0.01":""):p.accepts["*"]),p.headers)M.setRequestHeader(h,p.headers[h]);if(p.beforeSend&&(!1===p.beforeSend.call(y,M,p)||f))return M.abort();if(w="abort",v.add(p.complete),M.done(p.success),M.fail(p.error),r=He(Pe,p,e,M)){if(M.readyState=1,l&&b.trigger("ajaxSend",[M,p]),f)return M;p.async&&p.timeout>0&&(c=n.setTimeout(function(){M.abort("timeout")},p.timeout));try{f=!1,r.send(m,A)}catch(t){if(f)throw t;A(-1,t)}}else A(-1,"No Transport");function A(t,e,a,s){var u,h,d,m,x,w=e;f||(f=!0,c&&n.clearTimeout(c),r=void 0,o=s||"",M.readyState=t>0?4:0,u=t>=200&&t<300||304===t,a&&(m=function(t,e,n){for(var r,i,o,a,s=t.contents,c=t.dataTypes;"*"===c[0];)c.shift(),void 0===r&&(r=t.mimeType||e.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){c.unshift(i);break}if(c[0]in n)o=c[0];else{for(i in n){if(!c[0]||t.converters[i+" "+c[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==c[0]&&c.unshift(o),n[o]}(p,M,a)),m=function(t,e,n,r){var i,o,a,s,c,u={},f=t.dataTypes.slice();if(f[1])for(a in t.converters)u[a.toLowerCase()]=t.converters[a];for(o=f.shift();o;)if(t.responseFields[o]&&(n[t.responseFields[o]]=e),!c&&r&&t.dataFilter&&(e=t.dataFilter(e,t.dataType)),c=o,o=f.shift())if("*"===o)o=c;else if("*"!==c&&c!==o){if(!(a=u[c+" "+o]||u["* "+o]))for(i in u)if((s=i.split(" "))[1]===o&&(a=u[c+" "+s[0]]||u["* "+s[0]])){!0===a?a=u[i]:!0!==u[i]&&(o=s[0],f.unshift(s[1]));break}if(!0!==a)if(a&&t.throws)e=a(e);else try{e=a(e)}catch(t){return{state:"parsererror",error:a?t:"No conversion from "+c+" to "+o}}}return{state:"success",data:e}}(p,m,M,u),u?(p.ifModified&&((x=M.getResponseHeader("Last-Modified"))&&(T.lastModified[i]=x),(x=M.getResponseHeader("etag"))&&(T.etag[i]=x)),204===t||"HEAD"===p.type?w="nocontent":304===t?w="notmodified":(w=m.state,h=m.data,u=!(d=m.error))):(d=w,!t&&w||(w="error",t<0&&(t=0))),M.status=t,M.statusText=(e||w)+"",u?g.resolveWith(y,[h,w,M]):g.rejectWith(y,[M,w,d]),M.statusCode(_),_=void 0,l&&b.trigger(u?"ajaxSuccess":"ajaxError",[M,p,u?h:d]),v.fireWith(y,[M,w]),l&&(b.trigger("ajaxComplete",[M,p]),--T.active||T.event.trigger("ajaxStop")))}return M},getJSON:function(t,e,n){return T.get(t,e,n,"json")},getScript:function(t,e){return T.get(t,void 0,e,"script")}}),T.each(["get","post"],function(t,e){T[e]=function(t,n,r,i){return v(n)&&(i=i||r,r=n,n=void 0),T.ajax(T.extend({url:t,type:e,dataType:i,data:n,success:r},T.isPlainObject(t)&&t))}}),T._evalUrl=function(t){return T.ajax({url:t,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,throws:!0})},T.fn.extend({wrapAll:function(t){var e;return this[0]&&(v(t)&&(t=t.call(this[0])),e=T(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map(function(){for(var t=this;t.firstElementChild;)t=t.firstElementChild;return t}).append(this)),this},wrapInner:function(t){return v(t)?this.each(function(e){T(this).wrapInner(t.call(this,e))}):this.each(function(){var e=T(this),n=e.contents();n.length?n.wrapAll(t):e.append(t)})},wrap:function(t){var e=v(t);return this.each(function(n){T(this).wrapAll(e?t.call(this,n):t)})},unwrap:function(t){return this.parent(t).not("body").each(function(){T(this).replaceWith(this.childNodes)}),this}}),T.expr.pseudos.hidden=function(t){return!T.expr.pseudos.visible(t)},T.expr.pseudos.visible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},T.ajaxSettings.xhr=function(){try{return new n.XMLHttpRequest}catch(t){}};var Ie={0:200,1223:204},Be=T.ajaxSettings.xhr();g.cors=!!Be&&"withCredentials"in Be,g.ajax=Be=!!Be,T.ajaxTransport(function(t){var e,r;if(g.cors||Be&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];for(a in t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest"),i)s.setRequestHeader(a,i[a]);e=function(t){return function(){e&&(e=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===t?s.abort():"error"===t?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Ie[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=e(),r=s.onerror=s.ontimeout=e("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&n.setTimeout(function(){e&&r()})},e=e("abort");try{s.send(t.hasContent&&t.data||null)}catch(t){if(e)throw t}},abort:function(){e&&e()}}}),T.ajaxPrefilter(function(t){t.crossDomain&&(t.contents.script=!1)}),T.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(t){return T.globalEval(t),t}}}),T.ajaxPrefilter("script",function(t){void 0===t.cache&&(t.cache=!1),t.crossDomain&&(t.type="GET")}),T.ajaxTransport("script",function(t){var e,n;if(t.crossDomain)return{send:function(r,i){e=T("<script>").prop({charset:t.scriptCharset,src:t.url}).on("load error",n=function(t){e.remove(),n=null,t&&i("error"===t.type?404:200,t.type)}),a.head.appendChild(e[0])},abort:function(){n&&n()}}});var ze=[],$e=/(=)\?(?=&|$)|\?\?/;T.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var t=ze.pop()||T.expando+"_"+xe++;return this[t]=!0,t}}),T.ajaxPrefilter("json jsonp",function(t,e,r){var i,o,a,s=!1!==t.jsonp&&($e.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&$e.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=v(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace($e,"$1"+i):!1!==t.jsonp&&(t.url+=(we.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||T.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=n[i],n[i]=function(){a=arguments},r.always(function(){void 0===o?T(n).removeProp(i):n[i]=o,t[i]&&(t.jsonpCallback=e.jsonpCallback,ze.push(i)),a&&v(o)&&o(a[0]),a=o=void 0}),"script"}),g.createHTMLDocument=function(){var t=a.implementation.createHTMLDocument("").body;return t.innerHTML="<form></form><form></form>",2===t.childNodes.length}(),T.parseHTML=function(t,e,n){return"string"!=typeof t?[]:("boolean"==typeof e&&(n=e,e=!1),e||(g.createHTMLDocument?((r=(e=a.implementation.createHTMLDocument("")).createElement("base")).href=a.location.href,e.head.appendChild(r)):e=a),i=D.exec(t),o=!n&&[],i?[e.createElement(i[1])]:(i=_t([t],e,o),o&&o.length&&T(o).remove(),T.merge([],i.childNodes)));var r,i,o},T.fn.load=function(t,e,n){var r,i,o,a=this,s=t.indexOf(" ");return s>-1&&(r=pe(t.slice(s)),t=t.slice(0,s)),v(e)?(n=e,e=void 0):e&&"object"==typeof e&&(i="POST"),a.length>0&&T.ajax({url:t,type:i||"GET",dataType:"html",data:e}).done(function(t){o=arguments,a.html(r?T("<div>").append(T.parseHTML(t)).find(r):t)}).always(n&&function(t,e){a.each(function(){n.apply(this,o||[t.responseText,e,t])})}),this},T.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(t,e){T.fn[e]=function(t){return this.on(e,t)}}),T.expr.pseudos.animated=function(t){return T.grep(T.timers,function(e){return t===e.elem}).length},T.offset={setOffset:function(t,e,n){var r,i,o,a,s,c,u=T.css(t,"position"),f=T(t),l={};"static"===u&&(t.style.position="relative"),s=f.offset(),o=T.css(t,"top"),c=T.css(t,"left"),("absolute"===u||"fixed"===u)&&(o+c).indexOf("auto")>-1?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(c)||0),v(e)&&(e=e.call(t,n,T.extend({},s))),null!=e.top&&(l.top=e.top-s.top+a),null!=e.left&&(l.left=e.left-s.left+i),"using"in e?e.using.call(t,l):f.css(l)}},T.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){T.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var t,e,n,r=this[0],i={top:0,left:0};if("fixed"===T.css(r,"position"))e=r.getBoundingClientRect();else{for(e=this.offset(),n=r.ownerDocument,t=r.offsetParent||n.documentElement;t&&(t===n.body||t===n.documentElement)&&"static"===T.css(t,"position");)t=t.parentNode;t&&t!==r&&1===t.nodeType&&((i=T(t).offset()).top+=T.css(t,"borderTopWidth",!0),i.left+=T.css(t,"borderLeftWidth",!0))}return{top:e.top-i.top-T.css(r,"marginTop",!0),left:e.left-i.left-T.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent;t&&"static"===T.css(t,"position");)t=t.offsetParent;return t||mt})}}),T.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,e){var n="pageYOffset"===e;T.fn[t]=function(r){return Y(this,function(t,r,i){var o;if(_(t)?o=t:9===t.nodeType&&(o=t.defaultView),void 0===i)return o?o[e]:t[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):t[r]=i},t,r,arguments.length)}}),T.each(["top","left"],function(t,e){T.cssHooks[e]=zt(g.pixelPosition,function(t,n){if(n)return n=Bt(t,e),Ht.test(n)?T(t).position()[e]+"px":n})}),T.each({Height:"height",Width:"width"},function(t,e){T.each({padding:"inner"+t,content:e,"":"outer"+t},function(n,r){T.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return Y(this,function(e,n,i){var o;return _(e)?0===r.indexOf("outer")?e["inner"+t]:e.document.documentElement["client"+t]:9===e.nodeType?(o=e.documentElement,Math.max(e.body["scroll"+t],o["scroll"+t],e.body["offset"+t],o["offset"+t],o["client"+t])):void 0===i?T.css(e,n,s):T.style(e,n,i,s)},e,a?i:void 0,a)}})}),T.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(t,e){T.fn[e]=function(t,n){return arguments.length>0?this.on(e,null,t,n):this.trigger(e)}}),T.fn.extend({hover:function(t,e){return this.mouseenter(t).mouseleave(e||t)}}),T.fn.extend({bind:function(t,e,n){return this.on(t,null,e,n)},unbind:function(t,e){return this.off(t,null,e)},delegate:function(t,e,n,r){return this.on(e,t,n,r)},undelegate:function(t,e,n){return 1===arguments.length?this.off(t,"**"):this.off(e,t||"**",n)}}),T.proxy=function(t,e){var n,r,i;if("string"==typeof e&&(n=t[e],e=t,t=n),v(t))return r=c.call(arguments,2),(i=function(){return t.apply(e||this,r.concat(c.call(arguments)))}).guid=t.guid=t.guid||T.guid++,i},T.holdReady=function(t){t?T.readyWait++:T.ready(!0)},T.isArray=Array.isArray,T.parseJSON=JSON.parse,T.nodeName=S,T.isFunction=v,T.isWindow=_,T.camelCase=J,T.type=w,T.now=Date.now,T.isNumeric=function(t){var e=T.type(t);return("number"===e||"string"===e)&&!isNaN(t-parseFloat(t))},void 0===(r=function(){return T}.apply(e,[]))||(t.exports=r);var Ye=n.jQuery,We=n.$;return T.noConflict=function(t){return n.$===T&&(n.$=We),t&&n.jQuery===T&&(n.jQuery=Ye),T},i||(n.jQuery=n.$=T),T})},function(t,e,n){"use strict";function r(t,e){var n=this;this.location=i(t),this.label=i(e),this.updateLocation=function(t){var e=t.filter(function(t){return t.label()==n.label()});e.length>0&&n.location(function(t){var e=t[0].location().map(function(){return 0});return t.map(function(t){return t.location()}).reduce(function(t,e){return function(t,e){return t.map(function(t,n){return t+e[n]})}(t,e)},e).map(function(e){return e/t.length})}(e))}}function i(t,e){var n=t,r=e||function(t){return!0};return function(t){if(void 0===t)return n;r(t)&&(n=t)}}t.exports={data:i([],function(t){var e=t[0].length;return t.map(function(t){return t.length==e}).reduce(function(t,e){return t&e},!0)}),clusters:function(){var t=function(t,e){for(var n=e.k||Math.round(Math.sqrt(t.length/2)),o=e.iterations,a=t.map(function(t){return new function(t){var e=this;this.location=i(t),this.label=i(),this.updateLabel=function(t){var n=t.map(function(t){return function(t,e){return t.map(function(t,n){return Math.pow(t-e[n],2)}).reduce(function(t,e){return t+e},0)}(e.location(),t.location())});e.label(function(t){var e=t.reduce(function(t,e){return Math.min(t,e)});return t.indexOf(e)}(n))}}(t)}),s=[],c=0;c<n;c++)s.push(new r(a[c%a.length].location(),c));for(var u=0;u<o;u++)a.forEach(function(t){t.updateLabel(s)}),s.forEach(function(t){t.updateLocation(a)});return{points:a,centroids:s}}(this.data(),{k:this.k(),iterations:this.iterations()}),e=t.points;return t.centroids.map(function(t){return{centroid:t.location(),points:e.filter(function(e){return e.label()==t.label()}).map(function(t){return t.location()})}})},k:i(void 0,function(t){return t%1==0&t>0}),iterations:i(Math.pow(10,3),function(t){return t%1==0&t>0})}},function(t,e,n){"use strict";const r=Object.freeze({topRight:(t,e)=>e[0]<t[0]?-1:e[0]>t[0]?1:e[1]<t[1]?-1:e[1]>t[1]?1:0,topLeft:(t,e)=>t[0]<e[0]?-1:t[0]>e[0]?1:t[1]<e[1]?1:t[1]>e[1]?-1:0,bottomRight:(t,e)=>e[0]<t[0]?-1:e[0]>t[0]?1:e[1]<t[1]?1:e[1]>t[1]?-1:0,bottomLeft:(t,e)=>t[0]<e[0]?-1:t[0]>e[0]?1:t[1]<e[1]?-1:t[1]>e[1]?1:0});e.getParetoFrontier=((t,e)=>{if(!Array.isArray(t)||!t.every(t=>Array.isArray(t)&&t.length>=2))throw new TypeError("Require array of points as input");const n=e&&r[e.optimize]||r.topRight,i=n([0,1],[0,0])<0;let o;return Array.from(t).sort(n).filter((t,e)=>!!(0===e||i&&t[1]>o||!i&&t[1]<o)&&(o=t[1],!0))})},function(t,e,n){"use strict";n.r(e);var r=function(t,e){return t<e?-1:t>e?1:t>=e?0:NaN},i=function(t){return 1===t.length&&(t=function(t){return function(e,n){return r(t(e),n)}}(t)),{left:function(e,n,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){var o=r+i>>>1;t(e[o],n)<0?r=o+1:i=o}return r},right:function(e,n,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){var o=r+i>>>1;t(e[o],n)>0?i=o:r=o+1}return r}}};var o=i(r),a=o.right,s=(o.left,a);var c=function(t){return null===t?NaN:+t},u=Array.prototype,f=(u.slice,u.map,Math.sqrt(50)),l=Math.sqrt(10),h=Math.sqrt(2),d=function(t,e,n){var r,i,o,a,s=-1;if(n=+n,(t=+t)===(e=+e)&&n>0)return[t];if((r=e<t)&&(i=t,t=e,e=i),0===(a=p(t,e,n))||!isFinite(a))return[];if(a>0)for(t=Math.ceil(t/a),e=Math.floor(e/a),o=new Array(i=Math.ceil(e-t+1));++s<i;)o[s]=(t+s)*a;else for(t=Math.floor(t*a),e=Math.ceil(e*a),o=new Array(i=Math.ceil(t-e+1));++s<i;)o[s]=(t-s)/a;return r&&o.reverse(),o};function p(t,e,n){var r=(e-t)/Math.max(0,n),i=Math.floor(Math.log(r)/Math.LN10),o=r/Math.pow(10,i);return i>=0?(o>=f?10:o>=l?5:o>=h?2:1)*Math.pow(10,i):-Math.pow(10,-i)/(o>=f?10:o>=l?5:o>=h?2:1)}function y(t,e,n){var r=Math.abs(e-t)/Math.max(0,n),i=Math.pow(10,Math.floor(Math.log(r)/Math.LN10)),o=r/i;return o>=f?i*=10:o>=l?i*=5:o>=h&&(i*=2),e<t?-i:i}var b=function(t,e,n){if(null==n&&(n=c),r=t.length){if((e=+e)<=0||r<2)return+n(t[0],0,t);if(e>=1)return+n(t[r-1],r-1,t);var r,i=(r-1)*e,o=Math.floor(i),a=+n(t[o],o,t);return a+(+n(t[o+1],o+1,t)-a)*(i-o)}},g=function(t,e){var n,r,i=t.length,o=-1;if(null==e){for(;++o<i;)if(null!=(n=t[o])&&n>=n)for(r=n;++o<i;)null!=(n=t[o])&&n>r&&(r=n)}else for(;++o<i;)if(null!=(n=e(t[o],o,t))&&n>=n)for(r=n;++o<i;)null!=(n=e(t[o],o,t))&&n>r&&(r=n);return r},v=function(t){for(var e,n,r,i=t.length,o=-1,a=0;++o<i;)a+=t[o].length;for(n=new Array(a);--i>=0;)for(e=(r=t[i]).length;--e>=0;)n[--a]=r[e];return n},_=function(t,e){var n,r,i=t.length,o=-1;if(null==e){for(;++o<i;)if(null!=(n=t[o])&&n>=n)for(r=n;++o<i;)null!=(n=t[o])&&r>n&&(r=n)}else for(;++o<i;)if(null!=(n=e(t[o],o,t))&&n>=n)for(r=n;++o<i;)null!=(n=e(t[o],o,t))&&r>n&&(r=n);return r};var m=Array.prototype.slice,x=function(t){return t},w=1,T=2,M=3,A=4,k=1e-6;function C(t){return"translate("+(t+.5)+",0)"}function E(t){return"translate(0,"+(t+.5)+")"}function N(){return!this.__axis}function S(t,e){var n=[],r=null,i=null,o=6,a=6,s=3,c=t===w||t===A?-1:1,u=t===A||t===T?"x":"y",f=t===w||t===M?C:E;function l(l){var h=null==r?e.ticks?e.ticks.apply(e,n):e.domain():r,d=null==i?e.tickFormat?e.tickFormat.apply(e,n):x:i,p=Math.max(o,0)+s,y=e.range(),b=+y[0]+.5,g=+y[y.length-1]+.5,v=(e.bandwidth?function(t){var e=Math.max(0,t.bandwidth()-1)/2;return t.round()&&(e=Math.round(e)),function(n){return+t(n)+e}}:function(t){return function(e){return+t(e)}})(e.copy()),_=l.selection?l.selection():l,m=_.selectAll(".domain").data([null]),C=_.selectAll(".tick").data(h,e).order(),E=C.exit(),S=C.enter().append("g").attr("class","tick"),D=C.select("line"),L=C.select("text");m=m.merge(m.enter().insert("path",".tick").attr("class","domain").attr("stroke","#000")),C=C.merge(S),D=D.merge(S.append("line").attr("stroke","#000").attr(u+"2",c*o)),L=L.merge(S.append("text").attr("fill","#000").attr(u,c*p).attr("dy",t===w?"0em":t===M?"0.71em":"0.32em")),l!==_&&(m=m.transition(l),C=C.transition(l),D=D.transition(l),L=L.transition(l),E=E.transition(l).attr("opacity",k).attr("transform",function(t){return isFinite(t=v(t))?f(t):this.getAttribute("transform")}),S.attr("opacity",k).attr("transform",function(t){var e=this.parentNode.__axis;return f(e&&isFinite(e=e(t))?e:v(t))})),E.remove(),m.attr("d",t===A||t==T?"M"+c*a+","+b+"H0.5V"+g+"H"+c*a:"M"+b+","+c*a+"V0.5H"+g+"V"+c*a),C.attr("opacity",1).attr("transform",function(t){return f(v(t))}),D.attr(u+"2",c*o),L.attr(u,c*p).text(d),_.filter(N).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===T?"start":t===A?"end":"middle"),_.each(function(){this.__axis=v})}return l.scale=function(t){return arguments.length?(e=t,l):e},l.ticks=function(){return n=m.call(arguments),l},l.tickArguments=function(t){return arguments.length?(n=null==t?[]:m.call(t),l):n.slice()},l.tickValues=function(t){return arguments.length?(r=null==t?null:m.call(t),l):r&&r.slice()},l.tickFormat=function(t){return arguments.length?(i=t,l):i},l.tickSize=function(t){return arguments.length?(o=a=+t,l):o},l.tickSizeInner=function(t){return arguments.length?(o=+t,l):o},l.tickSizeOuter=function(t){return arguments.length?(a=+t,l):a},l.tickPadding=function(t){return arguments.length?(s=+t,l):s},l}function D(t){return S(M,t)}function L(t){return S(A,t)}var j={value:function(){}};function q(){for(var t,e=0,n=arguments.length,r={};e<n;++e){if(!(t=arguments[e]+"")||t in r)throw new Error("illegal type: "+t);r[t]=[]}return new P(r)}function P(t){this._=t}function O(t,e){for(var n,r=0,i=t.length;r<i;++r)if((n=t[r]).name===e)return n.value}function U(t,e,n){for(var r=0,i=t.length;r<i;++r)if(t[r].name===e){t[r]=j,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=n&&t.push({name:e,value:n}),t}P.prototype=q.prototype={constructor:P,on:function(t,e){var n,r=this._,i=function(t,e){return t.trim().split(/^|\s+/).map(function(t){var n="",r=t.indexOf(".");if(r>=0&&(n=t.slice(r+1),t=t.slice(0,r)),t&&!e.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:n}})}(t+"",r),o=-1,a=i.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++o<a;)if(n=(t=i[o]).type)r[n]=U(r[n],t.name,e);else if(null==e)for(n in r)r[n]=U(r[n],t.name,null);return this}for(;++o<a;)if((n=(t=i[o]).type)&&(n=O(r[n],t.name)))return n},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new P(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,r,i=new Array(n),o=0;o<n;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,n=(r=this._[t]).length;o<n;++o)r[o].value.apply(e,i)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(e,n)}};var R=q,H="http://www.w3.org/1999/xhtml",F={svg:"http://www.w3.org/2000/svg",xhtml:H,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},I=function(t){var e=t+="",n=e.indexOf(":");return n>=0&&"xmlns"!==(e=t.slice(0,n))&&(t=t.slice(n+1)),F.hasOwnProperty(e)?{space:F[e],local:t}:t};var B=function(t){var e=I(t);return(e.local?function(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}:function(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===H&&e.documentElement.namespaceURI===H?e.createElement(t):e.createElementNS(n,t)}})(e)};function z(){}var $=function(t){return null==t?z:function(){return this.querySelector(t)}};function Y(){return[]}var W=function(t){return null==t?Y:function(){return this.querySelectorAll(t)}},X=function(t){return function(){return this.matches(t)}};if("undefined"!=typeof document){var V=document.documentElement;if(!V.matches){var J=V.webkitMatchesSelector||V.msMatchesSelector||V.mozMatchesSelector||V.oMatchesSelector;X=function(t){return function(){return J.call(this,t)}}}}var Q=X,G=function(t){return new Array(t.length)};function Z(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}Z.prototype={constructor:Z,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};var K="$";function tt(t,e,n,r,i,o){for(var a,s=0,c=e.length,u=o.length;s<u;++s)(a=e[s])?(a.__data__=o[s],r[s]=a):n[s]=new Z(t,o[s]);for(;s<c;++s)(a=e[s])&&(i[s]=a)}function et(t,e,n,r,i,o,a){var s,c,u,f={},l=e.length,h=o.length,d=new Array(l);for(s=0;s<l;++s)(c=e[s])&&(d[s]=u=K+a.call(c,c.__data__,s,e),u in f?i[s]=c:f[u]=c);for(s=0;s<h;++s)(c=f[u=K+a.call(t,o[s],s,o)])?(r[s]=c,c.__data__=o[s],f[u]=null):n[s]=new Z(t,o[s]);for(s=0;s<l;++s)(c=e[s])&&f[d[s]]===c&&(i[s]=c)}function nt(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}var rt=function(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView};function it(t,e){return t.style.getPropertyValue(e)||rt(t).getComputedStyle(t,null).getPropertyValue(e)}function ot(t){return t.trim().split(/^|\s+/)}function at(t){return t.classList||new st(t)}function st(t){this._node=t,this._names=ot(t.getAttribute("class")||"")}function ct(t,e){for(var n=at(t),r=-1,i=e.length;++r<i;)n.add(e[r])}function ut(t,e){for(var n=at(t),r=-1,i=e.length;++r<i;)n.remove(e[r])}st.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};function ft(){this.textContent=""}function lt(){this.innerHTML=""}function ht(){this.nextSibling&&this.parentNode.appendChild(this)}function dt(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function pt(){return null}function yt(){var t=this.parentNode;t&&t.removeChild(this)}function bt(){return this.parentNode.insertBefore(this.cloneNode(!1),this.nextSibling)}function gt(){return this.parentNode.insertBefore(this.cloneNode(!0),this.nextSibling)}var vt={},_t=null;"undefined"!=typeof document&&("onmouseenter"in document.documentElement||(vt={mouseenter:"mouseover",mouseleave:"mouseout"}));function mt(t,e,n){return t=xt(t,e,n),function(e){var n=e.relatedTarget;n&&(n===this||8&n.compareDocumentPosition(this))||t.call(this,e)}}function xt(t,e,n){return function(r){var i=_t;_t=r;try{t.call(this,this.__data__,e,n)}finally{_t=i}}}function wt(t){return function(){var e=this.__on;if(e){for(var n,r=0,i=-1,o=e.length;r<o;++r)n=e[r],t.type&&n.type!==t.type||n.name!==t.name?e[++i]=n:this.removeEventListener(n.type,n.listener,n.capture);++i?e.length=i:delete this.__on}}}function Tt(t,e,n){var r=vt.hasOwnProperty(t.type)?mt:xt;return function(i,o,a){var s,c=this.__on,u=r(e,o,a);if(c)for(var f=0,l=c.length;f<l;++f)if((s=c[f]).type===t.type&&s.name===t.name)return this.removeEventListener(s.type,s.listener,s.capture),this.addEventListener(s.type,s.listener=u,s.capture=n),void(s.value=e);this.addEventListener(t.type,u,n),s={type:t.type,name:t.name,value:e,listener:u,capture:n},c?c.push(s):this.__on=[s]}}function Mt(t,e,n){var r=rt(t),i=r.CustomEvent;"function"==typeof i?i=new i(e,n):(i=r.document.createEvent("Event"),n?(i.initEvent(e,n.bubbles,n.cancelable),i.detail=n.detail):i.initEvent(e,!1,!1)),t.dispatchEvent(i)}var At=[null];function kt(t,e){this._groups=t,this._parents=e}function Ct(){return new kt([[document.documentElement]],At)}kt.prototype=Ct.prototype={constructor:kt,select:function(t){"function"!=typeof t&&(t=$(t));for(var e=this._groups,n=e.length,r=new Array(n),i=0;i<n;++i)for(var o,a,s=e[i],c=s.length,u=r[i]=new Array(c),f=0;f<c;++f)(o=s[f])&&(a=t.call(o,o.__data__,f,s))&&("__data__"in o&&(a.__data__=o.__data__),u[f]=a);return new kt(r,this._parents)},selectAll:function(t){"function"!=typeof t&&(t=W(t));for(var e=this._groups,n=e.length,r=[],i=[],o=0;o<n;++o)for(var a,s=e[o],c=s.length,u=0;u<c;++u)(a=s[u])&&(r.push(t.call(a,a.__data__,u,s)),i.push(a));return new kt(r,i)},filter:function(t){"function"!=typeof t&&(t=Q(t));for(var e=this._groups,n=e.length,r=new Array(n),i=0;i<n;++i)for(var o,a=e[i],s=a.length,c=r[i]=[],u=0;u<s;++u)(o=a[u])&&t.call(o,o.__data__,u,a)&&c.push(o);return new kt(r,this._parents)},data:function(t,e){if(!t)return d=new Array(this.size()),u=-1,this.each(function(t){d[++u]=t}),d;var n=e?et:tt,r=this._parents,i=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var o=i.length,a=new Array(o),s=new Array(o),c=new Array(o),u=0;u<o;++u){var f=r[u],l=i[u],h=l.length,d=t.call(f,f&&f.__data__,u,r),p=d.length,y=s[u]=new Array(p),b=a[u]=new Array(p);n(f,l,y,b,c[u]=new Array(h),d,e);for(var g,v,_=0,m=0;_<p;++_)if(g=y[_]){for(_>=m&&(m=_+1);!(v=b[m])&&++m<p;);g._next=v||null}}return(a=new kt(a,r))._enter=s,a._exit=c,a},enter:function(){return new kt(this._enter||this._groups.map(G),this._parents)},exit:function(){return new kt(this._exit||this._groups.map(G),this._parents)},merge:function(t){for(var e=this._groups,n=t._groups,r=e.length,i=n.length,o=Math.min(r,i),a=new Array(r),s=0;s<o;++s)for(var c,u=e[s],f=n[s],l=u.length,h=a[s]=new Array(l),d=0;d<l;++d)(c=u[d]||f[d])&&(h[d]=c);for(;s<r;++s)a[s]=e[s];return new kt(a,this._parents)},order:function(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var r,i=t[e],o=i.length-1,a=i[o];--o>=0;)(r=i[o])&&(a&&a!==r.nextSibling&&a.parentNode.insertBefore(r,a),a=r);return this},sort:function(t){function e(e,n){return e&&n?t(e.__data__,n.__data__):!e-!n}t||(t=nt);for(var n=this._groups,r=n.length,i=new Array(r),o=0;o<r;++o){for(var a,s=n[o],c=s.length,u=i[o]=new Array(c),f=0;f<c;++f)(a=s[f])&&(u[f]=a);u.sort(e)}return new kt(i,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){var t=new Array(this.size()),e=-1;return this.each(function(){t[++e]=this}),t},node:function(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var r=t[e],i=0,o=r.length;i<o;++i){var a=r[i];if(a)return a}return null},size:function(){var t=0;return this.each(function(){++t}),t},empty:function(){return!this.node()},each:function(t){for(var e=this._groups,n=0,r=e.length;n<r;++n)for(var i,o=e[n],a=0,s=o.length;a<s;++a)(i=o[a])&&t.call(i,i.__data__,a,o);return this},attr:function(t,e){var n=I(t);if(arguments.length<2){var r=this.node();return n.local?r.getAttributeNS(n.space,n.local):r.getAttribute(n)}return this.each((null==e?n.local?function(t){return function(){this.removeAttributeNS(t.space,t.local)}}:function(t){return function(){this.removeAttribute(t)}}:"function"==typeof e?n.local?function(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)}}:function(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttribute(t):this.setAttribute(t,n)}}:n.local?function(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}:function(t,e){return function(){this.setAttribute(t,e)}})(n,e))},style:function(t,e,n){return arguments.length>1?this.each((null==e?function(t){return function(){this.style.removeProperty(t)}}:"function"==typeof e?function(t,e,n){return function(){var r=e.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,n)}}:function(t,e,n){return function(){this.style.setProperty(t,e,n)}})(t,e,null==n?"":n)):it(this.node(),t)},property:function(t,e){return arguments.length>1?this.each((null==e?function(t){return function(){delete this[t]}}:"function"==typeof e?function(t,e){return function(){var n=e.apply(this,arguments);null==n?delete this[t]:this[t]=n}}:function(t,e){return function(){this[t]=e}})(t,e)):this.node()[t]},classed:function(t,e){var n=ot(t+"");if(arguments.length<2){for(var r=at(this.node()),i=-1,o=n.length;++i<o;)if(!r.contains(n[i]))return!1;return!0}return this.each(("function"==typeof e?function(t,e){return function(){(e.apply(this,arguments)?ct:ut)(this,t)}}:e?function(t){return function(){ct(this,t)}}:function(t){return function(){ut(this,t)}})(n,e))},text:function(t){return arguments.length?this.each(null==t?ft:("function"==typeof t?function(t){return function(){var e=t.apply(this,arguments);this.textContent=null==e?"":e}}:function(t){return function(){this.textContent=t}})(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?lt:("function"==typeof t?function(t){return function(){var e=t.apply(this,arguments);this.innerHTML=null==e?"":e}}:function(t){return function(){this.innerHTML=t}})(t)):this.node().innerHTML},raise:function(){return this.each(ht)},lower:function(){return this.each(dt)},append:function(t){var e="function"==typeof t?t:B(t);return this.select(function(){return this.appendChild(e.apply(this,arguments))})},insert:function(t,e){var n="function"==typeof t?t:B(t),r=null==e?pt:"function"==typeof e?e:$(e);return this.select(function(){return this.insertBefore(n.apply(this,arguments),r.apply(this,arguments)||null)})},remove:function(){return this.each(yt)},clone:function(t){return this.select(t?gt:bt)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,e,n){var r,i,o=function(t){return t.trim().split(/^|\s+/).map(function(t){var e="",n=t.indexOf(".");return n>=0&&(e=t.slice(n+1),t=t.slice(0,n)),{type:t,name:e}})}(t+""),a=o.length;if(!(arguments.length<2)){for(s=e?Tt:wt,null==n&&(n=!1),r=0;r<a;++r)this.each(s(o[r],e,n));return this}var s=this.node().__on;if(s)for(var c,u=0,f=s.length;u<f;++u)for(r=0,c=s[u];r<a;++r)if((i=o[r]).type===c.type&&i.name===c.name)return c.value},dispatch:function(t,e){return this.each(("function"==typeof e?function(t,e){return function(){return Mt(this,t,e.apply(this,arguments))}}:function(t,e){return function(){return Mt(this,t,e)}})(t,e))}};var Et=Ct,Nt=function(t){return"string"==typeof t?new kt([[document.querySelector(t)]],[document.documentElement]):new kt([[t]],At)},St=0;function Dt(){this._="@"+(++St).toString(36)}Dt.prototype=function(){return new Dt}.prototype={constructor:Dt,get:function(t){for(var e=this._;!(e in t);)if(!(t=t.parentNode))return;return t[e]},set:function(t,e){return t[this._]=e},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}};function Lt(t,e,n,r,i,o,a,s,c,u){this.target=t,this.type=e,this.subject=n,this.identifier=r,this.active=i,this.x=o,this.y=a,this.dx=s,this.dy=c,this._=u}Lt.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};var jt=function(t,e,n){t.prototype=e.prototype=n,n.constructor=t};function qt(t,e){var n=Object.create(t.prototype);for(var r in e)n[r]=e[r];return n}function Pt(){}var Ot="\\s*([+-]?\\d+)\\s*",Ut="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",Rt="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Ht=/^#([0-9a-f]{3})$/,Ft=/^#([0-9a-f]{6})$/,It=new RegExp("^rgb\\("+[Ot,Ot,Ot]+"\\)$"),Bt=new RegExp("^rgb\\("+[Rt,Rt,Rt]+"\\)$"),zt=new RegExp("^rgba\\("+[Ot,Ot,Ot,Ut]+"\\)$"),$t=new RegExp("^rgba\\("+[Rt,Rt,Rt,Ut]+"\\)$"),Yt=new RegExp("^hsl\\("+[Ut,Rt,Rt]+"\\)$"),Wt=new RegExp("^hsla\\("+[Ut,Rt,Rt,Ut]+"\\)$"),Xt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Vt(t){var e;return t=(t+"").trim().toLowerCase(),(e=Ht.exec(t))?new Kt((e=parseInt(e[1],16))>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):(e=Ft.exec(t))?Jt(parseInt(e[1],16)):(e=It.exec(t))?new Kt(e[1],e[2],e[3],1):(e=Bt.exec(t))?new Kt(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=zt.exec(t))?Qt(e[1],e[2],e[3],e[4]):(e=$t.exec(t))?Qt(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=Yt.exec(t))?ee(e[1],e[2]/100,e[3]/100,1):(e=Wt.exec(t))?ee(e[1],e[2]/100,e[3]/100,e[4]):Xt.hasOwnProperty(t)?Jt(Xt[t]):"transparent"===t?new Kt(NaN,NaN,NaN,0):null}function Jt(t){return new Kt(t>>16&255,t>>8&255,255&t,1)}function Qt(t,e,n,r){return r<=0&&(t=e=n=NaN),new Kt(t,e,n,r)}function Gt(t){return t instanceof Pt||(t=Vt(t)),t?new Kt((t=t.rgb()).r,t.g,t.b,t.opacity):new Kt}function Zt(t,e,n,r){return 1===arguments.length?Gt(t):new Kt(t,e,n,null==r?1:r)}function Kt(t,e,n,r){this.r=+t,this.g=+e,this.b=+n,this.opacity=+r}function te(t){return((t=Math.max(0,Math.min(255,Math.round(t)||0)))<16?"0":"")+t.toString(16)}function ee(t,e,n,r){return r<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new re(t,e,n,r)}function ne(t,e,n,r){return 1===arguments.length?function(t){if(t instanceof re)return new re(t.h,t.s,t.l,t.opacity);if(t instanceof Pt||(t=Vt(t)),!t)return new re;if(t instanceof re)return t;var e=(t=t.rgb()).r/255,n=t.g/255,r=t.b/255,i=Math.min(e,n,r),o=Math.max(e,n,r),a=NaN,s=o-i,c=(o+i)/2;return s?(a=e===o?(n-r)/s+6*(n<r):n===o?(r-e)/s+2:(e-n)/s+4,s/=c<.5?o+i:2-o-i,a*=60):s=c>0&&c<1?0:a,new re(a,s,c,t.opacity)}(t):new re(t,e,n,null==r?1:r)}function re(t,e,n,r){this.h=+t,this.s=+e,this.l=+n,this.opacity=+r}function ie(t,e,n){return 255*(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)}jt(Pt,Vt,{displayable:function(){return this.rgb().displayable()},hex:function(){return this.rgb().hex()},toString:function(){return this.rgb()+""}}),jt(Kt,Zt,qt(Pt,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new Kt(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new Kt(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&this.r<=255&&0<=this.g&&this.g<=255&&0<=this.b&&this.b<=255&&0<=this.opacity&&this.opacity<=1},hex:function(){return"#"+te(this.r)+te(this.g)+te(this.b)},toString:function(){var t=this.opacity;return(1===(t=isNaN(t)?1:Math.max(0,Math.min(1,t)))?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}})),jt(re,ne,qt(Pt,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new re(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new re(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,r=n+(n<.5?n:1-n)*e,i=2*n-r;return new Kt(ie(t>=240?t-240:t+120,i,r),ie(t,i,r),ie(t<120?t+240:t-120,i,r),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1}}));var oe=Math.PI/180,ae=180/Math.PI,se=.96422,ce=1,ue=.82521,fe=4/29,le=6/29,he=3*le*le,de=le*le*le;function pe(t){if(t instanceof be)return new be(t.l,t.a,t.b,t.opacity);if(t instanceof Te){if(isNaN(t.h))return new be(t.l,0,0,t.opacity);var e=t.h*oe;return new be(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}t instanceof Kt||(t=Gt(t));var n,r,i=me(t.r),o=me(t.g),a=me(t.b),s=ge((.2225045*i+.7168786*o+.0606169*a)/ce);return i===o&&o===a?n=r=s:(n=ge((.4360747*i+.3850649*o+.1430804*a)/se),r=ge((.0139322*i+.0971045*o+.7141733*a)/ue)),new be(116*s-16,500*(n-s),200*(s-r),t.opacity)}function ye(t,e,n,r){return 1===arguments.length?pe(t):new be(t,e,n,null==r?1:r)}function be(t,e,n,r){this.l=+t,this.a=+e,this.b=+n,this.opacity=+r}function ge(t){return t>de?Math.pow(t,1/3):t/he+fe}function ve(t){return t>le?t*t*t:he*(t-fe)}function _e(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function me(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function xe(t){if(t instanceof Te)return new Te(t.h,t.c,t.l,t.opacity);if(t instanceof be||(t=pe(t)),0===t.a&&0===t.b)return new Te(NaN,0,t.l,t.opacity);var e=Math.atan2(t.b,t.a)*ae;return new Te(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function we(t,e,n,r){return 1===arguments.length?xe(t):new Te(t,e,n,null==r?1:r)}function Te(t,e,n,r){this.h=+t,this.c=+e,this.l=+n,this.opacity=+r}jt(be,ye,qt(Pt,{brighter:function(t){return new be(this.l+18*(null==t?1:t),this.a,this.b,this.opacity)},darker:function(t){return new be(this.l-18*(null==t?1:t),this.a,this.b,this.opacity)},rgb:function(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,n=isNaN(this.b)?t:t-this.b/200;return new Kt(_e(3.1338561*(e=se*ve(e))-1.6168667*(t=ce*ve(t))-.4906146*(n=ue*ve(n))),_e(-.9787684*e+1.9161415*t+.033454*n),_e(.0719453*e-.2289914*t+1.4052427*n),this.opacity)}})),jt(Te,we,qt(Pt,{brighter:function(t){return new Te(this.h,this.c,this.l+18*(null==t?1:t),this.opacity)},darker:function(t){return new Te(this.h,this.c,this.l-18*(null==t?1:t),this.opacity)},rgb:function(){return pe(this).rgb()}}));var Me=-.29227,Ae=-.90649,ke=1.97294,Ce=ke*Ae,Ee=1.78277*ke,Ne=1.78277*Me- -.14861*Ae;function Se(t,e,n,r){return 1===arguments.length?function(t){if(t instanceof De)return new De(t.h,t.s,t.l,t.opacity);t instanceof Kt||(t=Gt(t));var e=t.r/255,n=t.g/255,r=t.b/255,i=(Ne*r+Ce*e-Ee*n)/(Ne+Ce-Ee),o=r-i,a=(ke*(n-i)-Me*o)/Ae,s=Math.sqrt(a*a+o*o)/(ke*i*(1-i)),c=s?Math.atan2(a,o)*ae-120:NaN;return new De(c<0?c+360:c,s,i,t.opacity)}(t):new De(t,e,n,null==r?1:r)}function De(t,e,n,r){this.h=+t,this.s=+e,this.l=+n,this.opacity=+r}function Le(t,e,n,r,i){var o=t*t,a=o*t;return((1-3*t+3*o-a)*e+(4-6*o+3*a)*n+(1+3*t+3*o-3*a)*r+a*i)/6}jt(De,Se,qt(Pt,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new De(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new De(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=isNaN(this.h)?0:(this.h+120)*oe,e=+this.l,n=isNaN(this.s)?0:this.s*e*(1-e),r=Math.cos(t),i=Math.sin(t);return new Kt(255*(e+n*(-.14861*r+1.78277*i)),255*(e+n*(Me*r+Ae*i)),255*(e+n*(ke*r)),this.opacity)}}));var je=function(t){return function(){return t}};function qe(t,e){return function(n){return t+n*e}}function Pe(t,e){var n=e-t;return n?qe(t,n>180||n<-180?n-360*Math.round(n/360):n):je(isNaN(t)?e:t)}function Oe(t){return 1==(t=+t)?Ue:function(e,n){return n-e?function(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(r){return Math.pow(t+r*e,n)}}(e,n,t):je(isNaN(e)?n:e)}}function Ue(t,e){var n=e-t;return n?qe(t,n):je(isNaN(t)?e:t)}var Re=function t(e){var n=Oe(e);function r(t,e){var r=n((t=Zt(t)).r,(e=Zt(e)).r),i=n(t.g,e.g),o=n(t.b,e.b),a=Ue(t.opacity,e.opacity);return function(e){return t.r=r(e),t.g=i(e),t.b=o(e),t.opacity=a(e),t+""}}return r.gamma=t,r}(1);function He(t){return function(e){var n,r,i=e.length,o=new Array(i),a=new Array(i),s=new Array(i);for(n=0;n<i;++n)r=Zt(e[n]),o[n]=r.r||0,a[n]=r.g||0,s[n]=r.b||0;return o=t(o),a=t(a),s=t(s),r.opacity=1,function(t){return r.r=o(t),r.g=a(t),r.b=s(t),r+""}}}var Fe=He(function(t){var e=t.length-1;return function(n){var r=n<=0?n=0:n>=1?(n=1,e-1):Math.floor(n*e),i=t[r],o=t[r+1],a=r>0?t[r-1]:2*i-o,s=r<e-1?t[r+2]:2*o-i;return Le((n-r/e)*e,a,i,o,s)}}),Ie=(He(function(t){var e=t.length;return function(n){var r=Math.floor(((n%=1)<0?++n:n)*e),i=t[(r+e-1)%e],o=t[r%e],a=t[(r+1)%e],s=t[(r+2)%e];return Le((n-r/e)*e,i,o,a,s)}}),function(t,e){return e-=t=+t,function(n){return t+e*n}}),Be=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,ze=new RegExp(Be.source,"g");var $e,Ye,We,Xe,Ve=function(t,e){var n,r,i,o=Be.lastIndex=ze.lastIndex=0,a=-1,s=[],c=[];for(t+="",e+="";(n=Be.exec(t))&&(r=ze.exec(e));)(i=r.index)>o&&(i=e.slice(o,i),s[a]?s[a]+=i:s[++a]=i),(n=n[0])===(r=r[0])?s[a]?s[a]+=r:s[++a]=r:(s[++a]=null,c.push({i:a,x:Ie(n,r)})),o=ze.lastIndex;return o<e.length&&(i=e.slice(o),s[a]?s[a]+=i:s[++a]=i),s.length<2?c[0]?function(t){return function(e){return t(e)+""}}(c[0].x):function(t){return function(){return t}}(e):(e=c.length,function(t){for(var n,r=0;r<e;++r)s[(n=c[r]).i]=n.x(t);return s.join("")})},Je=function(t,e){var n,r=typeof e;return null==e||"boolean"===r?je(e):("number"===r?Ie:"string"===r?(n=Vt(e))?(e=n,Re):Ve:e instanceof Vt?Re:e instanceof Date?function(t,e){var n=new Date;return e-=t=+t,function(r){return n.setTime(t+e*r),n}}:Array.isArray(e)?function(t,e){var n,r=e?e.length:0,i=t?Math.min(r,t.length):0,o=new Array(i),a=new Array(r);for(n=0;n<i;++n)o[n]=Je(t[n],e[n]);for(;n<r;++n)a[n]=e[n];return function(t){for(n=0;n<i;++n)a[n]=o[n](t);return a}}:"function"!=typeof e.valueOf&&"function"!=typeof e.toString||isNaN(e)?function(t,e){var n,r={},i={};for(n in null!==t&&"object"==typeof t||(t={}),null!==e&&"object"==typeof e||(e={}),e)n in t?r[n]=Je(t[n],e[n]):i[n]=e[n];return function(t){for(n in r)i[n]=r[n](t);return i}}:Ie)(t,e)},Qe=function(t,e){return e-=t=+t,function(n){return Math.round(t+e*n)}},Ge=180/Math.PI,Ze={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1},Ke=function(t,e,n,r,i,o){var a,s,c;return(a=Math.sqrt(t*t+e*e))&&(t/=a,e/=a),(c=t*n+e*r)&&(n-=t*c,r-=e*c),(s=Math.sqrt(n*n+r*r))&&(n/=s,r/=s,c/=s),t*r<e*n&&(t=-t,e=-e,c=-c,a=-a),{translateX:i,translateY:o,rotate:Math.atan2(e,t)*Ge,skewX:Math.atan(c)*Ge,scaleX:a,scaleY:s}};function tn(t,e,n,r){function i(t){return t.length?t.pop()+" ":""}return function(o,a){var s=[],c=[];return o=t(o),a=t(a),function(t,r,i,o,a,s){if(t!==i||r!==o){var c=a.push("translate(",null,e,null,n);s.push({i:c-4,x:Ie(t,i)},{i:c-2,x:Ie(r,o)})}else(i||o)&&a.push("translate("+i+e+o+n)}(o.translateX,o.translateY,a.translateX,a.translateY,s,c),function(t,e,n,o){t!==e?(t-e>180?e+=360:e-t>180&&(t+=360),o.push({i:n.push(i(n)+"rotate(",null,r)-2,x:Ie(t,e)})):e&&n.push(i(n)+"rotate("+e+r)}(o.rotate,a.rotate,s,c),function(t,e,n,o){t!==e?o.push({i:n.push(i(n)+"skewX(",null,r)-2,x:Ie(t,e)}):e&&n.push(i(n)+"skewX("+e+r)}(o.skewX,a.skewX,s,c),function(t,e,n,r,o,a){if(t!==n||e!==r){var s=o.push(i(o)+"scale(",null,",",null,")");a.push({i:s-4,x:Ie(t,n)},{i:s-2,x:Ie(e,r)})}else 1===n&&1===r||o.push(i(o)+"scale("+n+","+r+")")}(o.scaleX,o.scaleY,a.scaleX,a.scaleY,s,c),o=a=null,function(t){for(var e,n=-1,r=c.length;++n<r;)s[(e=c[n]).i]=e.x(t);return s.join("")}}}var en=tn(function(t){return"none"===t?Ze:($e||($e=document.createElement("DIV"),Ye=document.documentElement,We=document.defaultView),$e.style.transform=t,t=We.getComputedStyle(Ye.appendChild($e),null).getPropertyValue("transform"),Ye.removeChild($e),t=t.slice(7,-1).split(","),Ke(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))},"px, ","px)","deg)"),nn=tn(function(t){return null==t?Ze:(Xe||(Xe=document.createElementNS("http://www.w3.org/2000/svg","g")),Xe.setAttribute("transform",t),(t=Xe.transform.baseVal.consolidate())?(t=t.matrix,Ke(t.a,t.b,t.c,t.d,t.e,t.f)):Ze)},", ",")",")");Math.SQRT2;function rn(t){return function(e,n){var r=t((e=ne(e)).h,(n=ne(n)).h),i=Ue(e.s,n.s),o=Ue(e.l,n.l),a=Ue(e.opacity,n.opacity);return function(t){return e.h=r(t),e.s=i(t),e.l=o(t),e.opacity=a(t),e+""}}}rn(Pe),rn(Ue);function on(t){return function(e,n){var r=t((e=we(e)).h,(n=we(n)).h),i=Ue(e.c,n.c),o=Ue(e.l,n.l),a=Ue(e.opacity,n.opacity);return function(t){return e.h=r(t),e.c=i(t),e.l=o(t),e.opacity=a(t),e+""}}}on(Pe),on(Ue);function an(t){return function e(n){function r(e,r){var i=t((e=Se(e)).h,(r=Se(r)).h),o=Ue(e.s,r.s),a=Ue(e.l,r.l),s=Ue(e.opacity,r.opacity);return function(t){return e.h=i(t),e.s=o(t),e.l=a(Math.pow(t,n)),e.opacity=s(t),e+""}}return n=+n,r.gamma=e,r}(1)}an(Pe);var sn=an(Ue);var cn,un,fn=0,ln=0,hn=0,dn=1e3,pn=0,yn=0,bn=0,gn="object"==typeof performance&&performance.now?performance:Date,vn="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function _n(){return yn||(vn(mn),yn=gn.now()+bn)}function mn(){yn=0}function xn(){this._call=this._time=this._next=null}function wn(t,e,n){var r=new xn;return r.restart(t,e,n),r}function Tn(){yn=(pn=gn.now())+bn,fn=ln=0;try{!function(){_n(),++fn;for(var t,e=cn;e;)(t=yn-e._time)>=0&&e._call.call(null,t),e=e._next;--fn}()}finally{fn=0,function(){var t,e,n=cn,r=1/0;for(;n;)n._call?(r>n._time&&(r=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:cn=e);un=t,An(r)}(),yn=0}}function Mn(){var t=gn.now(),e=t-pn;e>dn&&(bn-=e,pn=t)}function An(t){fn||(ln&&(ln=clearTimeout(ln)),t-yn>24?(t<1/0&&(ln=setTimeout(Tn,t-gn.now()-bn)),hn&&(hn=clearInterval(hn))):(hn||(pn=gn.now(),hn=setInterval(Mn,dn)),fn=1,vn(Tn)))}xn.prototype=wn.prototype={constructor:xn,restart:function(t,e,n){if("function"!=typeof t)throw new TypeError("callback is not a function");n=(null==n?_n():+n)+(null==e?0:+e),this._next||un===this||(un?un._next=this:cn=this,un=this),this._call=t,this._time=n,An()},stop:function(){this._call&&(this._call=null,this._time=1/0,An())}};var kn=function(t,e,n){var r=new xn;return e=null==e?0:+e,r.restart(function(n){r.stop(),t(n+e)},e,n),r},Cn=R("start","end","interrupt"),En=[],Nn=0,Sn=1,Dn=2,Ln=3,jn=4,qn=5,Pn=6,On=function(t,e,n,r,i,o){var a=t.__transition;if(a){if(n in a)return}else t.__transition={};!function(t,e,n){var r,i=t.__transition;function o(c){var u,f,l,h;if(n.state!==Sn)return s();for(u in i)if((h=i[u]).name===n.name){if(h.state===Ln)return kn(o);h.state===jn?(h.state=Pn,h.timer.stop(),h.on.call("interrupt",t,t.__data__,h.index,h.group),delete i[u]):+u<e&&(h.state=Pn,h.timer.stop(),delete i[u])}if(kn(function(){n.state===Ln&&(n.state=jn,n.timer.restart(a,n.delay,n.time),a(c))}),n.state=Dn,n.on.call("start",t,t.__data__,n.index,n.group),n.state===Dn){for(n.state=Ln,r=new Array(l=n.tween.length),u=0,f=-1;u<l;++u)(h=n.tween[u].value.call(t,t.__data__,n.index,n.group))&&(r[++f]=h);r.length=f+1}}function a(e){for(var i=e<n.duration?n.ease.call(null,e/n.duration):(n.timer.restart(s),n.state=qn,1),o=-1,a=r.length;++o<a;)r[o].call(null,i);n.state===qn&&(n.on.call("end",t,t.__data__,n.index,n.group),s())}function s(){for(var r in n.state=Pn,n.timer.stop(),delete i[e],i)return;delete t.__transition}i[e]=n,n.timer=wn(function(t){n.state=Sn,n.timer.restart(o,n.delay,n.time),n.delay<=t&&o(t-n.delay)},0,n.time)}(t,n,{name:e,index:r,group:i,on:Cn,tween:En,time:o.time,delay:o.delay,duration:o.duration,ease:o.ease,timer:null,state:Nn})};function Un(t,e){var n=Hn(t,e);if(n.state>Nn)throw new Error("too late; already scheduled");return n}function Rn(t,e){var n=Hn(t,e);if(n.state>Dn)throw new Error("too late; already started");return n}function Hn(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}var Fn=function(t,e){var n,r,i,o=t.__transition,a=!0;if(o){for(i in e=null==e?null:e+"",o)(n=o[i]).name===e?(r=n.state>Dn&&n.state<qn,n.state=Pn,n.timer.stop(),r&&n.on.call("interrupt",t,t.__data__,n.index,n.group),delete o[i]):a=!1;a&&delete t.__transition}};function In(t,e,n){var r=t._id;return t.each(function(){var t=Rn(this,r);(t.value||(t.value={}))[e]=n.apply(this,arguments)}),function(t){return Hn(t,r).value[e]}}var Bn=function(t,e){var n;return("number"==typeof e?Ie:e instanceof Vt?Re:(n=Vt(e))?(e=n,Re):Ve)(t,e)};var zn=Et.prototype.constructor;var $n=0;function Yn(t,e,n,r){this._groups=t,this._parents=e,this._name=n,this._id=r}function Wn(){return++$n}var Xn=Et.prototype;Yn.prototype=function(t){return Et().transition(t)}.prototype={constructor:Yn,select:function(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=$(t));for(var r=this._groups,i=r.length,o=new Array(i),a=0;a<i;++a)for(var s,c,u=r[a],f=u.length,l=o[a]=new Array(f),h=0;h<f;++h)(s=u[h])&&(c=t.call(s,s.__data__,h,u))&&("__data__"in s&&(c.__data__=s.__data__),l[h]=c,On(l[h],e,n,h,l,Hn(s,n)));return new Yn(o,this._parents,e,n)},selectAll:function(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=W(t));for(var r=this._groups,i=r.length,o=[],a=[],s=0;s<i;++s)for(var c,u=r[s],f=u.length,l=0;l<f;++l)if(c=u[l]){for(var h,d=t.call(c,c.__data__,l,u),p=Hn(c,n),y=0,b=d.length;y<b;++y)(h=d[y])&&On(h,e,n,y,d,p);o.push(d),a.push(c)}return new Yn(o,a,e,n)},filter:function(t){"function"!=typeof t&&(t=Q(t));for(var e=this._groups,n=e.length,r=new Array(n),i=0;i<n;++i)for(var o,a=e[i],s=a.length,c=r[i]=[],u=0;u<s;++u)(o=a[u])&&t.call(o,o.__data__,u,a)&&c.push(o);return new Yn(r,this._parents,this._name,this._id)},merge:function(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,r=e.length,i=n.length,o=Math.min(r,i),a=new Array(r),s=0;s<o;++s)for(var c,u=e[s],f=n[s],l=u.length,h=a[s]=new Array(l),d=0;d<l;++d)(c=u[d]||f[d])&&(h[d]=c);for(;s<r;++s)a[s]=e[s];return new Yn(a,this._parents,this._name,this._id)},selection:function(){return new zn(this._groups,this._parents)},transition:function(){for(var t=this._name,e=this._id,n=Wn(),r=this._groups,i=r.length,o=0;o<i;++o)for(var a,s=r[o],c=s.length,u=0;u<c;++u)if(a=s[u]){var f=Hn(a,e);On(a,t,n,u,s,{time:f.time+f.delay+f.duration,delay:0,duration:f.duration,ease:f.ease})}return new Yn(r,this._parents,t,n)},call:Xn.call,nodes:Xn.nodes,node:Xn.node,size:Xn.size,empty:Xn.empty,each:Xn.each,on:function(t,e){var n=this._id;return arguments.length<2?Hn(this.node(),n).on.on(t):this.each(function(t,e,n){var r,i,o=function(t){return(t+"").trim().split(/^|\s+/).every(function(t){var e=t.indexOf(".");return e>=0&&(t=t.slice(0,e)),!t||"start"===t})}(e)?Un:Rn;return function(){var a=o(this,t),s=a.on;s!==r&&(i=(r=s).copy()).on(e,n),a.on=i}}(n,t,e))},attr:function(t,e){var n=I(t),r="transform"===n?nn:Bn;return this.attrTween(t,"function"==typeof e?(n.local?function(t,e,n){var r,i,o;return function(){var a,s=n(this);if(null!=s)return(a=this.getAttributeNS(t.space,t.local))===s?null:a===r&&s===i?o:o=e(r=a,i=s);this.removeAttributeNS(t.space,t.local)}}:function(t,e,n){var r,i,o;return function(){var a,s=n(this);if(null!=s)return(a=this.getAttribute(t))===s?null:a===r&&s===i?o:o=e(r=a,i=s);this.removeAttribute(t)}})(n,r,In(this,"attr."+t,e)):null==e?(n.local?function(t){return function(){this.removeAttributeNS(t.space,t.local)}}:function(t){return function(){this.removeAttribute(t)}})(n):(n.local?function(t,e,n){var r,i;return function(){var o=this.getAttributeNS(t.space,t.local);return o===n?null:o===r?i:i=e(r=o,n)}}:function(t,e,n){var r,i;return function(){var o=this.getAttribute(t);return o===n?null:o===r?i:i=e(r=o,n)}})(n,r,e+""))},attrTween:function(t,e){var n="attr."+t;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(null==e)return this.tween(n,null);if("function"!=typeof e)throw new Error;var r=I(t);return this.tween(n,(r.local?function(t,e){function n(){var n=this,r=e.apply(n,arguments);return r&&function(e){n.setAttributeNS(t.space,t.local,r(e))}}return n._value=e,n}:function(t,e){function n(){var n=this,r=e.apply(n,arguments);return r&&function(e){n.setAttribute(t,r(e))}}return n._value=e,n})(r,e))},style:function(t,e,n){var r="transform"==(t+="")?en:Bn;return null==e?this.styleTween(t,function(t,e){var n,r,i;return function(){var o=it(this,t),a=(this.style.removeProperty(t),it(this,t));return o===a?null:o===n&&a===r?i:i=e(n=o,r=a)}}(t,r)).on("end.style."+t,function(t){return function(){this.style.removeProperty(t)}}(t)):this.styleTween(t,"function"==typeof e?function(t,e,n){var r,i,o;return function(){var a=it(this,t),s=n(this);return null==s&&(this.style.removeProperty(t),s=it(this,t)),a===s?null:a===r&&s===i?o:o=e(r=a,i=s)}}(t,r,In(this,"style."+t,e)):function(t,e,n){var r,i;return function(){var o=it(this,t);return o===n?null:o===r?i:i=e(r=o,n)}}(t,r,e+""),n)},styleTween:function(t,e,n){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==e)return this.tween(r,null);if("function"!=typeof e)throw new Error;return this.tween(r,function(t,e,n){function r(){var r=this,i=e.apply(r,arguments);return i&&function(e){r.style.setProperty(t,i(e),n)}}return r._value=e,r}(t,e,null==n?"":n))},text:function(t){return this.tween("text","function"==typeof t?function(t){return function(){var e=t(this);this.textContent=null==e?"":e}}(In(this,"text",t)):function(t){return function(){this.textContent=t}}(null==t?"":t+""))},remove:function(){return this.on("end.remove",function(t){return function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this)}}(this._id))},tween:function(t,e){var n=this._id;if(t+="",arguments.length<2){for(var r,i=Hn(this.node(),n).tween,o=0,a=i.length;o<a;++o)if((r=i[o]).name===t)return r.value;return null}return this.each((null==e?function(t,e){var n,r;return function(){var i=Rn(this,t),o=i.tween;if(o!==n)for(var a=0,s=(r=n=o).length;a<s;++a)if(r[a].name===e){(r=r.slice()).splice(a,1);break}i.tween=r}}:function(t,e,n){var r,i;if("function"!=typeof n)throw new Error;return function(){var o=Rn(this,t),a=o.tween;if(a!==r){i=(r=a).slice();for(var s={name:e,value:n},c=0,u=i.length;c<u;++c)if(i[c].name===e){i[c]=s;break}c===u&&i.push(s)}o.tween=i}})(n,t,e))},delay:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?function(t,e){return function(){Un(this,t).delay=+e.apply(this,arguments)}}:function(t,e){return e=+e,function(){Un(this,t).delay=e}})(e,t)):Hn(this.node(),e).delay},duration:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?function(t,e){return function(){Rn(this,t).duration=+e.apply(this,arguments)}}:function(t,e){return e=+e,function(){Rn(this,t).duration=e}})(e,t)):Hn(this.node(),e).duration},ease:function(t){var e=this._id;return arguments.length?this.each(function(t,e){if("function"!=typeof e)throw new Error;return function(){Rn(this,t).ease=e}}(e,t)):Hn(this.node(),e).ease}};(function t(e){function n(t){return Math.pow(t,e)}return e=+e,n.exponent=t,n})(3),function t(e){function n(t){return 1-Math.pow(1-t,e)}return e=+e,n.exponent=t,n}(3),function t(e){function n(t){return((t*=2)<=1?Math.pow(t,e):2-Math.pow(2-t,e))/2}return e=+e,n.exponent=t,n}(3),Math.PI;(function t(e){function n(t){return t*t*((e+1)*t-e)}return e=+e,n.overshoot=t,n})(1.70158),function t(e){function n(t){return--t*t*((e+1)*t+e)+1}return e=+e,n.overshoot=t,n}(1.70158),function t(e){function n(t){return((t*=2)<1?t*t*((e+1)*t-e):(t-=2)*t*((e+1)*t+e)+2)/2}return e=+e,n.overshoot=t,n}(1.70158);var Vn=2*Math.PI,Jn=(function t(e,n){var r=Math.asin(1/(e=Math.max(1,e)))*(n/=Vn);function i(t){return e*Math.pow(2,10*--t)*Math.sin((r-t)/n)}return i.amplitude=function(e){return t(e,n*Vn)},i.period=function(n){return t(e,n)},i}(1,.3),function t(e,n){var r=Math.asin(1/(e=Math.max(1,e)))*(n/=Vn);function i(t){return 1-e*Math.pow(2,-10*(t=+t))*Math.sin((t+r)/n)}return i.amplitude=function(e){return t(e,n*Vn)},i.period=function(n){return t(e,n)},i}(1,.3),function t(e,n){var r=Math.asin(1/(e=Math.max(1,e)))*(n/=Vn);function i(t){return((t=2*t-1)<0?e*Math.pow(2,10*t)*Math.sin((r-t)/n):2-e*Math.pow(2,-10*t)*Math.sin((r+t)/n))/2}return i.amplitude=function(e){return t(e,n*Vn)},i.period=function(n){return t(e,n)},i}(1,.3),{time:null,delay:0,duration:250,ease:function(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}});function Qn(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))return Jn.time=_n(),Jn;return n}Et.prototype.interrupt=function(t){return this.each(function(){Fn(this,t)})},Et.prototype.transition=function(t){var e,n;t instanceof Yn?(e=t._id,t=t._name):(e=Wn(),(n=Jn).time=_n(),t=null==t?null:t+"");for(var r=this._groups,i=r.length,o=0;o<i;++o)for(var a,s=r[o],c=s.length,u=0;u<c;++u)(a=s[u])&&On(a,t,e,u,s,n||Qn(a,e));return new Yn(r,this._parents,t,e)};["e","w"].map(Gn),["n","s"].map(Gn),["n","e","s","w","nw","ne","se","sw"].map(Gn);function Gn(t){return{type:t}}Math.cos,Math.sin,Math.PI,Math.max;Array.prototype.slice;var Zn=Math.PI,Kn=2*Zn,tr=Kn-1e-6;function er(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function nr(){return new er}er.prototype=nr.prototype={constructor:er,moveTo:function(t,e){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,e){this._+="L"+(this._x1=+t)+","+(this._y1=+e)},quadraticCurveTo:function(t,e,n,r){this._+="Q"+ +t+","+ +e+","+(this._x1=+n)+","+(this._y1=+r)},bezierCurveTo:function(t,e,n,r,i,o){this._+="C"+ +t+","+ +e+","+ +n+","+ +r+","+(this._x1=+i)+","+(this._y1=+o)},arcTo:function(t,e,n,r,i){t=+t,e=+e,n=+n,r=+r,i=+i;var o=this._x1,a=this._y1,s=n-t,c=r-e,u=o-t,f=a-e,l=u*u+f*f;if(i<0)throw new Error("negative radius: "+i);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=e);else if(l>1e-6)if(Math.abs(f*s-c*u)>1e-6&&i){var h=n-o,d=r-a,p=s*s+c*c,y=h*h+d*d,b=Math.sqrt(p),g=Math.sqrt(l),v=i*Math.tan((Zn-Math.acos((p+l-y)/(2*b*g)))/2),_=v/g,m=v/b;Math.abs(_-1)>1e-6&&(this._+="L"+(t+_*u)+","+(e+_*f)),this._+="A"+i+","+i+",0,0,"+ +(f*h>u*d)+","+(this._x1=t+m*s)+","+(this._y1=e+m*c)}else this._+="L"+(this._x1=t)+","+(this._y1=e);else;},arc:function(t,e,n,r,i,o){t=+t,e=+e;var a=(n=+n)*Math.cos(r),s=n*Math.sin(r),c=t+a,u=e+s,f=1^o,l=o?r-i:i-r;if(n<0)throw new Error("negative radius: "+n);null===this._x1?this._+="M"+c+","+u:(Math.abs(this._x1-c)>1e-6||Math.abs(this._y1-u)>1e-6)&&(this._+="L"+c+","+u),n&&(l<0&&(l=l%Kn+Kn),l>tr?this._+="A"+n+","+n+",0,1,"+f+","+(t-a)+","+(e-s)+"A"+n+","+n+",0,1,"+f+","+(this._x1=c)+","+(this._y1=u):l>1e-6&&(this._+="A"+n+","+n+",0,"+ +(l>=Zn)+","+f+","+(this._x1=t+n*Math.cos(i))+","+(this._y1=e+n*Math.sin(i))))},rect:function(t,e,n,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+e)+"h"+ +n+"v"+ +r+"h"+-n+"Z"},toString:function(){return this._}};var rr=nr;function ir(){}function or(t,e){var n=new ir;if(t instanceof ir)t.each(function(t,e){n.set(e,t)});else if(Array.isArray(t)){var r,i=-1,o=t.length;if(null==e)for(;++i<o;)n.set(i,t[i]);else for(;++i<o;)n.set(e(r=t[i],i,t),r)}else if(t)for(var a in t)n.set(a,t[a]);return n}ir.prototype=or.prototype={constructor:ir,has:function(t){return"$"+t in this},get:function(t){return this["$"+t]},set:function(t,e){return this["$"+t]=e,this},remove:function(t){var e="$"+t;return e in this&&delete this[e]},clear:function(){for(var t in this)"$"===t[0]&&delete this[t]},keys:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)"$"===e[0]&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)"$"===e[0]&&++t;return t},empty:function(){for(var t in this)if("$"===t[0])return!1;return!0},each:function(t){for(var e in this)"$"===e[0]&&t(this[e],e.slice(1),this)}};var ar=or;function sr(){}var cr=ar.prototype;function ur(t,e){var n=new sr;if(t instanceof sr)t.each(function(t){n.add(t)});else if(t){var r=-1,i=t.length;if(null==e)for(;++r<i;)n.add(t[r]);else for(;++r<i;)n.add(e(t[r],r,t))}return n}sr.prototype=ur.prototype={constructor:sr,has:cr.has,add:function(t){return this["$"+(t+="")]=t,this},remove:cr.remove,clear:cr.clear,values:cr.keys,size:cr.size,empty:cr.empty,each:cr.each};Array.prototype.slice;var fr={},lr={},hr=34,dr=10,pr=13;function yr(t){return new Function("d","return {"+t.map(function(t,e){return JSON.stringify(t)+": d["+e+"]"}).join(",")+"}")}var br=function(t){var e=new RegExp('["'+t+"\n\r]"),n=t.charCodeAt(0);function r(t,e){var r,i=[],o=t.length,a=0,s=0,c=o<=0,u=!1;function f(){if(c)return lr;if(u)return u=!1,fr;var e,r,i=a;if(t.charCodeAt(i)===hr){for(;a++<o&&t.charCodeAt(a)!==hr||t.charCodeAt(++a)===hr;);return(e=a)>=o?c=!0:(r=t.charCodeAt(a++))===dr?u=!0:r===pr&&(u=!0,t.charCodeAt(a)===dr&&++a),t.slice(i+1,e-1).replace(/""/g,'"')}for(;a<o;){if((r=t.charCodeAt(e=a++))===dr)u=!0;else if(r===pr)u=!0,t.charCodeAt(a)===dr&&++a;else if(r!==n)continue;return t.slice(i,e)}return c=!0,t.slice(i,o)}for(t.charCodeAt(o-1)===dr&&--o,t.charCodeAt(o-1)===pr&&--o;(r=f())!==lr;){for(var l=[];r!==fr&&r!==lr;)l.push(r),r=f();e&&null==(l=e(l,s++))||i.push(l)}return i}function i(e){return e.map(o).join(t)}function o(t){return null==t?"":e.test(t+="")?'"'+t.replace(/"/g,'""')+'"':t}return{parse:function(t,e){var n,i,o=r(t,function(t,r){if(n)return n(t,r-1);i=t,n=e?function(t,e){var n=yr(t);return function(r,i){return e(n(r),i,t)}}(t,e):yr(t)});return o.columns=i||[],o},parseRows:r,format:function(e,n){return null==n&&(n=function(t){var e=Object.create(null),n=[];return t.forEach(function(t){for(var r in t)r in e||n.push(e[r]=r)}),n}(e)),[n.map(o).join(t)].concat(e.map(function(e){return n.map(function(t){return o(e[t])}).join(t)})).join("\n")},formatRows:function(t){return t.map(i).join("\n")}}},gr=br(","),vr=gr.parse,_r=(gr.parseRows,gr.format,gr.formatRows,br("\t")),mr=_r.parse;_r.parseRows,_r.format,_r.formatRows;function xr(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);return t.text()}var wr=function(t,e){return fetch(t,e).then(xr)};function Tr(t){return function(e,n,r){return 2===arguments.length&&"function"==typeof n&&(r=n,n=void 0),wr(e,n).then(function(e){return t(e,r)})}}Tr(vr),Tr(mr);function Mr(t){return function(e,n){return wr(e,n).then(function(e){return(new DOMParser).parseFromString(e,t)})}}Mr("application/xml"),Mr("text/html"),Mr("image/svg+xml");function Ar(t,e,n,r){if(isNaN(e)||isNaN(n))return t;var i,o,a,s,c,u,f,l,h,d=t._root,p={data:r},y=t._x0,b=t._y0,g=t._x1,v=t._y1;if(!d)return t._root=p,t;for(;d.length;)if((u=e>=(o=(y+g)/2))?y=o:g=o,(f=n>=(a=(b+v)/2))?b=a:v=a,i=d,!(d=d[l=f<<1|u]))return i[l]=p,t;if(s=+t._x.call(null,d.data),c=+t._y.call(null,d.data),e===s&&n===c)return p.next=d,i?i[l]=p:t._root=p,t;do{i=i?i[l]=new Array(4):t._root=new Array(4),(u=e>=(o=(y+g)/2))?y=o:g=o,(f=n>=(a=(b+v)/2))?b=a:v=a}while((l=f<<1|u)==(h=(c>=a)<<1|s>=o));return i[h]=d,i[l]=p,t}var kr=function(t,e,n,r,i){this.node=t,this.x0=e,this.y0=n,this.x1=r,this.y1=i};function Cr(t){return t[0]}function Er(t){return t[1]}function Nr(t,e,n){var r=new Sr(null==e?Cr:e,null==n?Er:n,NaN,NaN,NaN,NaN);return null==t?r:r.addAll(t)}function Sr(t,e,n,r,i,o){this._x=t,this._y=e,this._x0=n,this._y0=r,this._x1=i,this._y1=o,this._root=void 0}function Dr(t){for(var e={data:t.data},n=e;t=t.next;)n=n.next={data:t.data};return e}var Lr=Nr.prototype=Sr.prototype;Lr.copy=function(){var t,e,n=new Sr(this._x,this._y,this._x0,this._y0,this._x1,this._y1),r=this._root;if(!r)return n;if(!r.length)return n._root=Dr(r),n;for(t=[{source:r,target:n._root=new Array(4)}];r=t.pop();)for(var i=0;i<4;++i)(e=r.source[i])&&(e.length?t.push({source:e,target:r.target[i]=new Array(4)}):r.target[i]=Dr(e));return n},Lr.add=function(t){var e=+this._x.call(null,t),n=+this._y.call(null,t);return Ar(this.cover(e,n),e,n,t)},Lr.addAll=function(t){var e,n,r,i,o=t.length,a=new Array(o),s=new Array(o),c=1/0,u=1/0,f=-1/0,l=-1/0;for(n=0;n<o;++n)isNaN(r=+this._x.call(null,e=t[n]))||isNaN(i=+this._y.call(null,e))||(a[n]=r,s[n]=i,r<c&&(c=r),r>f&&(f=r),i<u&&(u=i),i>l&&(l=i));for(f<c&&(c=this._x0,f=this._x1),l<u&&(u=this._y0,l=this._y1),this.cover(c,u).cover(f,l),n=0;n<o;++n)Ar(this,a[n],s[n],t[n]);return this},Lr.cover=function(t,e){if(isNaN(t=+t)||isNaN(e=+e))return this;var n=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(n))i=(n=Math.floor(t))+1,o=(r=Math.floor(e))+1;else{if(!(n>t||t>i||r>e||e>o))return this;var a,s,c=i-n,u=this._root;switch(s=(e<(r+o)/2)<<1|t<(n+i)/2){case 0:do{(a=new Array(4))[s]=u,u=a}while(o=r+(c*=2),t>(i=n+c)||e>o);break;case 1:do{(a=new Array(4))[s]=u,u=a}while(o=r+(c*=2),(n=i-c)>t||e>o);break;case 2:do{(a=new Array(4))[s]=u,u=a}while(r=o-(c*=2),t>(i=n+c)||r>e);break;case 3:do{(a=new Array(4))[s]=u,u=a}while(r=o-(c*=2),(n=i-c)>t||r>e)}this._root&&this._root.length&&(this._root=u)}return this._x0=n,this._y0=r,this._x1=i,this._y1=o,this},Lr.data=function(){var t=[];return this.visit(function(e){if(!e.length)do{t.push(e.data)}while(e=e.next)}),t},Lr.extent=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]},Lr.find=function(t,e,n){var r,i,o,a,s,c,u,f=this._x0,l=this._y0,h=this._x1,d=this._y1,p=[],y=this._root;for(y&&p.push(new kr(y,f,l,h,d)),null==n?n=1/0:(f=t-n,l=e-n,h=t+n,d=e+n,n*=n);c=p.pop();)if(!(!(y=c.node)||(i=c.x0)>h||(o=c.y0)>d||(a=c.x1)<f||(s=c.y1)<l))if(y.length){var b=(i+a)/2,g=(o+s)/2;p.push(new kr(y[3],b,g,a,s),new kr(y[2],i,g,b,s),new kr(y[1],b,o,a,g),new kr(y[0],i,o,b,g)),(u=(e>=g)<<1|t>=b)&&(c=p[p.length-1],p[p.length-1]=p[p.length-1-u],p[p.length-1-u]=c)}else{var v=t-+this._x.call(null,y.data),_=e-+this._y.call(null,y.data),m=v*v+_*_;if(m<n){var x=Math.sqrt(n=m);f=t-x,l=e-x,h=t+x,d=e+x,r=y.data}}return r},Lr.remove=function(t){if(isNaN(o=+this._x.call(null,t))||isNaN(a=+this._y.call(null,t)))return this;var e,n,r,i,o,a,s,c,u,f,l,h,d=this._root,p=this._x0,y=this._y0,b=this._x1,g=this._y1;if(!d)return this;if(d.length)for(;;){if((u=o>=(s=(p+b)/2))?p=s:b=s,(f=a>=(c=(y+g)/2))?y=c:g=c,e=d,!(d=d[l=f<<1|u]))return this;if(!d.length)break;(e[l+1&3]||e[l+2&3]||e[l+3&3])&&(n=e,h=l)}for(;d.data!==t;)if(r=d,!(d=d.next))return this;return(i=d.next)&&delete d.next,r?(i?r.next=i:delete r.next,this):e?(i?e[l]=i:delete e[l],(d=e[0]||e[1]||e[2]||e[3])&&d===(e[3]||e[2]||e[1]||e[0])&&!d.length&&(n?n[h]=d:this._root=d),this):(this._root=i,this)},Lr.removeAll=function(t){for(var e=0,n=t.length;e<n;++e)this.remove(t[e]);return this},Lr.root=function(){return this._root},Lr.size=function(){var t=0;return this.visit(function(e){if(!e.length)do{++t}while(e=e.next)}),t},Lr.visit=function(t){var e,n,r,i,o,a,s=[],c=this._root;for(c&&s.push(new kr(c,this._x0,this._y0,this._x1,this._y1));e=s.pop();)if(!t(c=e.node,r=e.x0,i=e.y0,o=e.x1,a=e.y1)&&c.length){var u=(r+o)/2,f=(i+a)/2;(n=c[3])&&s.push(new kr(n,u,f,o,a)),(n=c[2])&&s.push(new kr(n,r,f,u,a)),(n=c[1])&&s.push(new kr(n,u,i,o,f)),(n=c[0])&&s.push(new kr(n,r,i,u,f))}return this},Lr.visitAfter=function(t){var e,n=[],r=[];for(this._root&&n.push(new kr(this._root,this._x0,this._y0,this._x1,this._y1));e=n.pop();){var i=e.node;if(i.length){var o,a=e.x0,s=e.y0,c=e.x1,u=e.y1,f=(a+c)/2,l=(s+u)/2;(o=i[0])&&n.push(new kr(o,a,s,f,l)),(o=i[1])&&n.push(new kr(o,f,s,c,l)),(o=i[2])&&n.push(new kr(o,a,l,f,u)),(o=i[3])&&n.push(new kr(o,f,l,c,u))}r.push(e)}for(;e=r.pop();)t(e.node,e.x0,e.y0,e.x1,e.y1);return this},Lr.x=function(t){return arguments.length?(this._x=t,this):this._x},Lr.y=function(t){return arguments.length?(this._y=t,this):this._y};Math.PI,Math.sqrt(5);var jr=function(t,e){if((n=(t=e?t.toExponential(e-1):t.toExponential()).indexOf("e"))<0)return null;var n,r=t.slice(0,n);return[r.length>1?r[0]+r.slice(2):r,+t.slice(n+1)]},qr=function(t){return(t=jr(Math.abs(t)))?t[1]:NaN},Pr=/^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Or(t){return new Ur(t)}function Ur(t){if(!(e=Pr.exec(t)))throw new Error("invalid format: "+t);var e;this.fill=e[1]||" ",this.align=e[2]||">",this.sign=e[3]||"-",this.symbol=e[4]||"",this.zero=!!e[5],this.width=e[6]&&+e[6],this.comma=!!e[7],this.precision=e[8]&&+e[8].slice(1),this.trim=!!e[9],this.type=e[10]||""}Or.prototype=Ur.prototype,Ur.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(null==this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(null==this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};var Rr,Hr,Fr,Ir,Br=function(t){t:for(var e,n=t.length,r=1,i=-1;r<n;++r)switch(t[r]){case".":i=e=r;break;case"0":0===i&&(i=r),e=r;break;default:if(i>0){if(!+t[r])break t;i=0}}return i>0?t.slice(0,i)+t.slice(e+1):t},zr=function(t,e){var n=jr(t,e);if(!n)return t+"";var r=n[0],i=n[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(i+1):r+new Array(i-r.length+2).join("0")},$r={"%":function(t,e){return(100*t).toFixed(e)},b:function(t){return Math.round(t).toString(2)},c:function(t){return t+""},d:function(t){return Math.round(t).toString(10)},e:function(t,e){return t.toExponential(e)},f:function(t,e){return t.toFixed(e)},g:function(t,e){return t.toPrecision(e)},o:function(t){return Math.round(t).toString(8)},p:function(t,e){return zr(100*t,e)},r:zr,s:function(t,e){var n=jr(t,e);if(!n)return t+"";var r=n[0],i=n[1],o=i-(Rr=3*Math.max(-8,Math.min(8,Math.floor(i/3))))+1,a=r.length;return o===a?r:o>a?r+new Array(o-a+1).join("0"):o>0?r.slice(0,o)+"."+r.slice(o):"0."+new Array(1-o).join("0")+jr(t,Math.max(0,e+o-1))[0]},X:function(t){return Math.round(t).toString(16).toUpperCase()},x:function(t){return Math.round(t).toString(16)}},Yr=function(t){return t},Wr=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"],Xr=function(t){var e=t.grouping&&t.thousands?function(t,e){return function(n,r){for(var i=n.length,o=[],a=0,s=t[0],c=0;i>0&&s>0&&(c+s+1>r&&(s=Math.max(1,r-c)),o.push(n.substring(i-=s,i+s)),!((c+=s+1)>r));)s=t[a=(a+1)%t.length];return o.reverse().join(e)}}(t.grouping,t.thousands):Yr,n=t.currency,r=t.decimal,i=t.numerals?function(t){return function(e){return e.replace(/[0-9]/g,function(e){return t[+e]})}}(t.numerals):Yr,o=t.percent||"%";function a(t){var a=(t=Or(t)).fill,s=t.align,c=t.sign,u=t.symbol,f=t.zero,l=t.width,h=t.comma,d=t.precision,p=t.trim,y=t.type;"n"===y?(h=!0,y="g"):$r[y]||(null==d&&(d=12),p=!0,y="g"),(f||"0"===a&&"="===s)&&(f=!0,a="0",s="=");var b="$"===u?n[0]:"#"===u&&/[boxX]/.test(y)?"0"+y.toLowerCase():"",g="$"===u?n[1]:/[%p]/.test(y)?o:"",v=$r[y],_=/[defgprs%]/.test(y);function m(t){var n,o,u,m=b,x=g;if("c"===y)x=v(t)+x,t="";else{var w=(t=+t)<0;if(t=v(Math.abs(t),d),p&&(t=Br(t)),w&&0==+t&&(w=!1),m=(w?"("===c?c:"-":"-"===c||"("===c?"":c)+m,x=("s"===y?Wr[8+Rr/3]:"")+x+(w&&"("===c?")":""),_)for(n=-1,o=t.length;++n<o;)if(48>(u=t.charCodeAt(n))||u>57){x=(46===u?r+t.slice(n+1):t.slice(n))+x,t=t.slice(0,n);break}}h&&!f&&(t=e(t,1/0));var T=m.length+t.length+x.length,M=T<l?new Array(l-T+1).join(a):"";switch(h&&f&&(t=e(M+t,M.length?l-x.length:1/0),M=""),s){case"<":t=m+t+x+M;break;case"=":t=m+M+t+x;break;case"^":t=M.slice(0,T=M.length>>1)+m+t+x+M.slice(T);break;default:t=M+m+t+x}return i(t)}return d=null==d?6:/[gprs]/.test(y)?Math.max(1,Math.min(21,d)):Math.max(0,Math.min(20,d)),m.toString=function(){return t+""},m}return{format:a,formatPrefix:function(t,e){var n=a(((t=Or(t)).type="f",t)),r=3*Math.max(-8,Math.min(8,Math.floor(qr(e)/3))),i=Math.pow(10,-r),o=Wr[8+r/3];return function(t){return n(i*t)+o}}}};!function(t){Hr=Xr(t),Fr=Hr.format,Ir=Hr.formatPrefix}({decimal:".",thousands:",",grouping:[3],currency:["$",""]});var Vr=function(){return new Jr};function Jr(){this.reset()}Jr.prototype={constructor:Jr,reset:function(){this.s=this.t=0},add:function(t){Gr(Qr,t,this.t),Gr(this,Qr.s,this.s),this.s?this.t+=Qr.t:this.s=Qr.t},valueOf:function(){return this.s}};var Qr=new Jr;function Gr(t,e,n){var r=t.s=e+n,i=r-e,o=r-i;t.t=e-o+(n-i)}var Zr=1e-6,Kr=Math.PI,ti=Kr/2,ei=Kr/4,ni=2*Kr,ri=Kr/180,ii=Math.abs,oi=Math.atan,ai=Math.atan2,si=Math.cos,ci=(Math.ceil,Math.exp),ui=(Math.floor,Math.log),fi=(Math.pow,Math.sin),li=(Math.sign,Math.sqrt),hi=Math.tan;function di(t){return t>1?0:t<-1?Kr:Math.acos(t)}function pi(t){return t>1?ti:t<-1?-ti:Math.asin(t)}function yi(){}Vr(),Vr();function bi(t){var e=t[0],n=t[1],r=si(n);return[r*si(e),r*fi(e),fi(n)]}function gi(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function vi(t){var e=li(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=e,t[1]/=e,t[2]/=e}Vr();function _i(t,e){return[t>Kr?t-ni:t<-Kr?t+ni:t,e]}_i.invert=_i;var mi=function(){var t,e=[];return{point:function(e,n){t.push([e,n])},lineStart:function(){e.push(t=[])},lineEnd:yi,rejoin:function(){e.length>1&&e.push(e.pop().concat(e.shift()))},result:function(){var n=e;return e=[],t=null,n}}},xi=function(t,e){return ii(t[0]-e[0])<Zr&&ii(t[1]-e[1])<Zr};function wi(t,e,n,r){this.x=t,this.z=e,this.o=n,this.e=r,this.v=!1,this.n=this.p=null}var Ti=function(t,e,n,r,i){var o,a,s=[],c=[];if(t.forEach(function(t){if(!((e=t.length-1)<=0)){var e,n,r=t[0],a=t[e];if(xi(r,a)){for(i.lineStart(),o=0;o<e;++o)i.point((r=t[o])[0],r[1]);i.lineEnd()}else s.push(n=new wi(r,t,null,!0)),c.push(n.o=new wi(r,null,n,!1)),s.push(n=new wi(a,t,null,!1)),c.push(n.o=new wi(a,null,n,!0))}}),s.length){for(c.sort(e),Mi(s),Mi(c),o=0,a=c.length;o<a;++o)c[o].e=n=!n;for(var u,f,l=s[0];;){for(var h=l,d=!0;h.v;)if((h=h.n)===l)return;u=h.z,i.lineStart();do{if(h.v=h.o.v=!0,h.e){if(d)for(o=0,a=u.length;o<a;++o)i.point((f=u[o])[0],f[1]);else r(h.x,h.n.x,1,i);h=h.n}else{if(d)for(u=h.p.z,o=u.length-1;o>=0;--o)i.point((f=u[o])[0],f[1]);else r(h.x,h.p.x,-1,i);h=h.p}u=(h=h.o).z,d=!d}while(!h.v);i.lineEnd()}}};function Mi(t){if(e=t.length){for(var e,n,r=0,i=t[0];++r<e;)i.n=n=t[r],n.p=i,i=n;i.n=n=t[0],n.p=i}}var Ai=Vr(),ki=function(t,e){var n=e[0],r=e[1],i=fi(r),o=[fi(n),-si(n),0],a=0,s=0;Ai.reset(),1===i?r=ti+Zr:-1===i&&(r=-ti-Zr);for(var c=0,u=t.length;c<u;++c)if(l=(f=t[c]).length)for(var f,l,h=f[l-1],d=h[0],p=h[1]/2+ei,y=fi(p),b=si(p),g=0;g<l;++g,d=_,y=x,b=w,h=v){var v=f[g],_=v[0],m=v[1]/2+ei,x=fi(m),w=si(m),T=_-d,M=T>=0?1:-1,A=M*T,k=A>Kr,C=y*x;if(Ai.add(ai(C*M*fi(A),b*w+C*si(A))),a+=k?T+M*ni:T,k^d>=n^_>=n){var E=gi(bi(h),bi(v));vi(E);var N=gi(o,E);vi(N);var S=(k^T>=0?-1:1)*pi(N[2]);(r>S||r===S&&(E[0]||E[1]))&&(s+=k^T>=0?1:-1)}}return(a<-Zr||a<Zr&&Ai<-Zr)^1&s},Ci=function(t,e,n,r){return function(i){var o,a,s,c=e(i),u=mi(),f=e(u),l=!1,h={point:d,lineStart:y,lineEnd:b,polygonStart:function(){h.point=g,h.lineStart=_,h.lineEnd=m,a=[],o=[]},polygonEnd:function(){h.point=d,h.lineStart=y,h.lineEnd=b,a=v(a);var t=ki(o,r);a.length?(l||(i.polygonStart(),l=!0),Ti(a,Ni,t,n,i)):t&&(l||(i.polygonStart(),l=!0),i.lineStart(),n(null,null,1,i),i.lineEnd()),l&&(i.polygonEnd(),l=!1),a=o=null},sphere:function(){i.polygonStart(),i.lineStart(),n(null,null,1,i),i.lineEnd(),i.polygonEnd()}};function d(e,n){t(e,n)&&i.point(e,n)}function p(t,e){c.point(t,e)}function y(){h.point=p,c.lineStart()}function b(){h.point=d,c.lineEnd()}function g(t,e){s.push([t,e]),f.point(t,e)}function _(){f.lineStart(),s=[]}function m(){g(s[0][0],s[0][1]),f.lineEnd();var t,e,n,r,c=f.clean(),h=u.result(),d=h.length;if(s.pop(),o.push(s),s=null,d)if(1&c){if((e=(n=h[0]).length-1)>0){for(l||(i.polygonStart(),l=!0),i.lineStart(),t=0;t<e;++t)i.point((r=n[t])[0],r[1]);i.lineEnd()}}else d>1&&2&c&&h.push(h.pop().concat(h.shift())),a.push(h.filter(Ei))}return h}};function Ei(t){return t.length>1}function Ni(t,e){return((t=t.x)[0]<0?t[1]-ti-Zr:ti-t[1])-((e=e.x)[0]<0?e[1]-ti-Zr:ti-e[1])}Ci(function(){return!0},function(t){var e,n=NaN,r=NaN,i=NaN;return{lineStart:function(){t.lineStart(),e=1},point:function(o,a){var s=o>0?Kr:-Kr,c=ii(o-n);ii(c-Kr)<Zr?(t.point(n,r=(r+a)/2>0?ti:-ti),t.point(i,r),t.lineEnd(),t.lineStart(),t.point(s,r),t.point(o,r),e=0):i!==s&&c>=Kr&&(ii(n-i)<Zr&&(n-=i*Zr),ii(o-s)<Zr&&(o-=s*Zr),r=function(t,e,n,r){var i,o,a=fi(t-n);return ii(a)>Zr?oi((fi(e)*(o=si(r))*fi(n)-fi(r)*(i=si(e))*fi(t))/(i*o*a)):(e+r)/2}(n,r,o,a),t.point(i,r),t.lineEnd(),t.lineStart(),t.point(s,r),e=0),t.point(n=o,r=a),i=s},lineEnd:function(){t.lineEnd(),n=r=NaN},clean:function(){return 2-e}}},function(t,e,n,r){var i;if(null==t)i=n*ti,r.point(-Kr,i),r.point(0,i),r.point(Kr,i),r.point(Kr,0),r.point(Kr,-i),r.point(0,-i),r.point(-Kr,-i),r.point(-Kr,0),r.point(-Kr,i);else if(ii(t[0]-e[0])>Zr){var o=t[0]<e[0]?Kr:-Kr;i=n*o/2,r.point(-o,i),r.point(0,i),r.point(o,i)}else r.point(e[0],e[1])},[-Kr,-ti]);Vr();Vr(),Vr();function Si(t){this._context=t}Si.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._context.closePath(),this._point=NaN},point:function(t,e){switch(this._point){case 0:this._context.moveTo(t,e),this._point=1;break;case 1:this._context.lineTo(t,e);break;default:this._context.moveTo(t+this._radius,e),this._context.arc(t,e,this._radius,0,ni)}},result:yi};Vr();function Di(){this._string=[]}function Li(t){return"m0,"+t+"a"+t+","+t+" 0 1,1 0,"+-2*t+"a"+t+","+t+" 0 1,1 0,"+2*t+"z"}Di.prototype={_radius:4.5,_circle:Li(4.5),pointRadius:function(t){return(t=+t)!==this._radius&&(this._radius=t,this._circle=null),this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._string.push("Z"),this._point=NaN},point:function(t,e){switch(this._point){case 0:this._string.push("M",t,",",e),this._point=1;break;case 1:this._string.push("L",t,",",e);break;default:null==this._circle&&(this._circle=Li(this._radius)),this._string.push("M",t,",",e,this._circle)}},result:function(){if(this._string.length){var t=this._string.join("");return this._string=[],t}return null}};function ji(t){return function(e){var n=new qi;for(var r in t)n[r]=t[r];return n.stream=e,n}}function qi(){}qi.prototype={constructor:qi,point:function(t,e){this.stream.point(t,e)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};si(30*ri);ji({point:function(t,e){this.stream.point(t*ri,e*ri)}});function Pi(t){return function(e,n){var r=si(e),i=si(n),o=t(r*i);return[o*i*fi(e),o*fi(n)]}}function Oi(t){return function(e,n){var r=li(e*e+n*n),i=t(r),o=fi(i),a=si(i);return[ai(e*o,r*a),pi(r&&n*o/r)]}}var Ui=Pi(function(t){return li(2/(1+t))});Ui.invert=Oi(function(t){return 2*pi(t/2)});var Ri=Pi(function(t){return(t=di(t))&&t/fi(t)});Ri.invert=Oi(function(t){return t});function Hi(t,e){return[t,ui(hi((ti+e)/2))]}Hi.invert=function(t,e){return[t,2*oi(ci(e))-ti]};function Fi(t,e){return[t,e]}Fi.invert=Fi;function Ii(t,e){var n=si(e),r=si(t)*n;return[n*fi(t)/r,fi(e)/r]}Ii.invert=Oi(oi);function Bi(t,e){var n=e*e,r=n*n;return[t*(.8707-.131979*n+r*(r*(.003971*n-.001529*r)-.013791)),e*(1.007226+n*(.015085+r*(.028874*n-.044475-.005916*r)))]}Bi.invert=function(t,e){var n,r=e,i=25;do{var o=r*r,a=o*o;r-=n=(r*(1.007226+o*(.015085+a*(.028874*o-.044475-.005916*a)))-e)/(1.007226+o*(.045255+a*(.259866*o-.311325-.005916*11*a)))}while(ii(n)>Zr&&--i>0);return[t/(.8707+(o=r*r)*(o*(o*o*o*(.003971-.001529*o)-.013791)-.131979)),r]};function zi(t,e){return[si(e)*fi(t),fi(e)]}zi.invert=Oi(pi);function $i(t,e){var n=si(e),r=1+si(t)*n;return[n*fi(t)/r,fi(e)/r]}$i.invert=Oi(function(t){return 2*oi(t)});function Yi(t,e){return[ui(hi((ti+e)/2)),-t]}Yi.invert=function(t,e){return[-e,2*oi(ci(t))-ti]};function Wi(t){var e=0,n=t.children,r=n&&n.length;if(r)for(;--r>=0;)e+=n[r].value;else e=1;t.value=e}function Xi(t,e){var n,r,i,o,a,s=new Gi(t),c=+t.value&&(s.value=t.value),u=[s];for(null==e&&(e=Vi);n=u.pop();)if(c&&(n.value=+n.data.value),(i=e(n.data))&&(a=i.length))for(n.children=new Array(a),o=a-1;o>=0;--o)u.push(r=n.children[o]=new Gi(i[o])),r.parent=n,r.depth=n.depth+1;return s.eachBefore(Qi)}function Vi(t){return t.children}function Ji(t){t.data=t.data.data}function Qi(t){var e=0;do{t.height=e}while((t=t.parent)&&t.height<++e)}function Gi(t){this.data=t,this.depth=this.height=0,this.parent=null}Gi.prototype=Xi.prototype={constructor:Gi,count:function(){return this.eachAfter(Wi)},each:function(t){var e,n,r,i,o=this,a=[o];do{for(e=a.reverse(),a=[];o=e.pop();)if(t(o),n=o.children)for(r=0,i=n.length;r<i;++r)a.push(n[r])}while(a.length);return this},eachAfter:function(t){for(var e,n,r,i=this,o=[i],a=[];i=o.pop();)if(a.push(i),e=i.children)for(n=0,r=e.length;n<r;++n)o.push(e[n]);for(;i=a.pop();)t(i);return this},eachBefore:function(t){for(var e,n,r=this,i=[r];r=i.pop();)if(t(r),e=r.children)for(n=e.length-1;n>=0;--n)i.push(e[n]);return this},sum:function(t){return this.eachAfter(function(e){for(var n=+t(e.data)||0,r=e.children,i=r&&r.length;--i>=0;)n+=r[i].value;e.value=n})},sort:function(t){return this.eachBefore(function(e){e.children&&e.children.sort(t)})},path:function(t){for(var e=this,n=function(t,e){if(t===e)return t;var n=t.ancestors(),r=e.ancestors(),i=null;for(t=n.pop(),e=r.pop();t===e;)i=t,t=n.pop(),e=r.pop();return i}(e,t),r=[e];e!==n;)e=e.parent,r.push(e);for(var i=r.length;t!==n;)r.splice(i,0,t),t=t.parent;return r},ancestors:function(){for(var t=this,e=[t];t=t.parent;)e.push(t);return e},descendants:function(){var t=[];return this.each(function(e){t.push(e)}),t},leaves:function(){var t=[];return this.eachBefore(function(e){e.children||t.push(e)}),t},links:function(){var t=this,e=[];return t.each(function(n){n!==t&&e.push({source:n.parent,target:n})}),e},copy:function(){return Xi(this).eachBefore(Ji)}};Array.prototype.slice;var Zi=function(t,e,n,r,i){for(var o,a=t.children,s=-1,c=a.length,u=t.value&&(r-e)/t.value;++s<c;)(o=a[s]).y0=n,o.y1=i,o.x0=e,o.x1=e+=o.value*u};function Ki(t,e){this._=t,this.parent=null,this.children=null,this.A=null,this.a=this,this.z=0,this.m=0,this.c=0,this.s=0,this.t=null,this.i=e}Ki.prototype=Object.create(Gi.prototype);var to=function(t,e,n,r,i){for(var o,a=t.children,s=-1,c=a.length,u=t.value&&(i-n)/t.value;++s<c;)(o=a[s]).x0=e,o.x1=r,o.y0=n,o.y1=n+=o.value*u},eo=(1+Math.sqrt(5))/2;function no(t,e,n,r,i,o){for(var a,s,c,u,f,l,h,d,p,y,b,g=[],v=e.children,_=0,m=0,x=v.length,w=e.value;_<x;){c=i-n,u=o-r;do{f=v[m++].value}while(!f&&m<x);for(l=h=f,b=f*f*(y=Math.max(u/c,c/u)/(w*t)),p=Math.max(h/b,b/l);m<x;++m){if(f+=s=v[m].value,s<l&&(l=s),s>h&&(h=s),b=f*f*y,(d=Math.max(h/b,b/l))>p){f-=s;break}p=d}g.push(a={value:f,dice:c<u,children:v.slice(_,m)}),a.dice?Zi(a,n,r,i,w?r+=u*f/w:o):to(a,n,r,w?n+=c*f/w:i,o),w-=f,_=m}return g}(function t(e){function n(t,n,r,i,o){no(e,t,n,r,i,o)}return n.ratio=function(e){return t((e=+e)>1?e:1)},n})(eo),function t(e){function n(t,n,r,i,o){if((a=t._squarify)&&a.ratio===e)for(var a,s,c,u,f,l=-1,h=a.length,d=t.value;++l<h;){for(c=(s=a[l]).children,u=s.value=0,f=c.length;u<f;++u)s.value+=c[u].value;s.dice?Zi(s,n,r,i,r+=(o-r)*s.value/d):to(s,n,r,n+=(i-n)*s.value/d,o),d-=s.value}else t._squarify=a=no(e,t,n,r,i,o),a.ratio=e}return n.ratio=function(e){return t((e=+e)>1?e:1)},n}(eo);var ro=function(t,e,n){return(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0])};function io(t,e){return t[0]-e[0]||t[1]-e[1]}function oo(t){for(var e=t.length,n=[0,1],r=2,i=2;i<e;++i){for(;r>1&&ro(t[n[r-2]],t[n[r-1]],t[i])<=0;)--r;n[r++]=i}return n.slice(0,r)}var ao=function(t){if((n=t.length)<3)return null;var e,n,r=new Array(n),i=new Array(n);for(e=0;e<n;++e)r[e]=[+t[e][0],+t[e][1],e];for(r.sort(io),e=0;e<n;++e)i[e]=[r[e][0],-r[e][1]];var o=oo(r),a=oo(i),s=a[0]===o[0],c=a[a.length-1]===o[o.length-1],u=[];for(e=o.length-1;e>=0;--e)u.push(t[r[o[e]][2]]);for(e=+s;e<a.length-c;++e)u.push(t[r[a[e]][2]]);return u},so=function(){return Math.random()},co=(function t(e){function n(t,n){return t=null==t?0:+t,n=null==n?1:+n,1===arguments.length?(n=t,t=0):n-=t,function(){return e()*n+t}}return n.source=t,n}(so),function t(e){function n(t,n){var r,i;return t=null==t?0:+t,n=null==n?1:+n,function(){var o;if(null!=r)o=r,r=null;else do{r=2*e()-1,o=2*e()-1,i=r*r+o*o}while(!i||i>1);return t+n*o*Math.sqrt(-2*Math.log(i)/i)}}return n.source=t,n}(so)),uo=(function t(e){function n(){var t=co.source(e).apply(this,arguments);return function(){return Math.exp(t())}}return n.source=t,n}(so),function t(e){function n(t){return function(){for(var n=0,r=0;r<t;++r)n+=e();return n}}return n.source=t,n}(so)),fo=(function t(e){function n(t){var n=uo.source(e)(t);return function(){return n()/t}}return n.source=t,n}(so),function t(e){function n(t){return function(){return-Math.log(1-e())/t}}return n.source=t,n}(so),Array.prototype),lo=fo.map,ho=fo.slice,po={name:"implicit"};function yo(t){var e=ar(),n=[],r=po;function i(i){var o=i+"",a=e.get(o);if(!a){if(r!==po)return r;e.set(o,a=n.push(i))}return t[(a-1)%t.length]}return t=null==t?[]:ho.call(t),i.domain=function(t){if(!arguments.length)return n.slice();n=[],e=ar();for(var r,o,a=-1,s=t.length;++a<s;)e.has(o=(r=t[a])+"")||e.set(o,n.push(r));return i},i.range=function(e){return arguments.length?(t=ho.call(e),i):t.slice()},i.unknown=function(t){return arguments.length?(r=t,i):r},i.copy=function(){return yo().domain(n).range(t).unknown(r)},i}var bo=function(t){return function(){return t}},go=function(t){return+t},vo=[0,1];function _o(t,e){return(e-=t=+t)?function(n){return(n-t)/e}:bo(e)}function mo(t,e,n,r){var i=t[0],o=t[1],a=e[0],s=e[1];return o<i?(i=n(o,i),a=r(s,a)):(i=n(i,o),a=r(a,s)),function(t){return a(i(t))}}function xo(t,e,n,r){var i=Math.min(t.length,e.length)-1,o=new Array(i),a=new Array(i),c=-1;for(t[i]<t[0]&&(t=t.slice().reverse(),e=e.slice().reverse());++c<i;)o[c]=n(t[c],t[c+1]),a[c]=r(e[c],e[c+1]);return function(e){var n=s(t,e,1,i)-1;return a[n](o[n](e))}}function wo(t,e){return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp())}function To(t,e){var n,r,i,o=vo,a=vo,s=Je,c=!1;function u(){return n=Math.min(o.length,a.length)>2?xo:mo,r=i=null,f}function f(e){return(r||(r=n(o,a,c?function(t){return function(e,n){var r=t(e=+e,n=+n);return function(t){return t<=e?0:t>=n?1:r(t)}}}(t):t,s)))(+e)}return f.invert=function(t){return(i||(i=n(a,o,_o,c?function(t){return function(e,n){var r=t(e=+e,n=+n);return function(t){return t<=0?e:t>=1?n:r(t)}}}(e):e)))(+t)},f.domain=function(t){return arguments.length?(o=lo.call(t,go),u()):o.slice()},f.range=function(t){return arguments.length?(a=ho.call(t),u()):a.slice()},f.rangeRound=function(t){return a=ho.call(t),s=Qe,u()},f.clamp=function(t){return arguments.length?(c=!!t,u()):c},f.interpolate=function(t){return arguments.length?(s=t,u()):s},u()}var Mo=function(t,e,n){var r,i=t[0],o=t[t.length-1],a=y(i,o,null==e?10:e);switch((n=Or(null==n?",f":n)).type){case"s":var s=Math.max(Math.abs(i),Math.abs(o));return null!=n.precision||isNaN(r=function(t,e){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(qr(e)/3)))-qr(Math.abs(t)))}(a,s))||(n.precision=r),Ir(n,s);case"":case"e":case"g":case"p":case"r":null!=n.precision||isNaN(r=function(t,e){return t=Math.abs(t),e=Math.abs(e)-t,Math.max(0,qr(e)-qr(t))+1}(a,Math.max(Math.abs(i),Math.abs(o))))||(n.precision=r-("e"===n.type));break;case"f":case"%":null!=n.precision||isNaN(r=function(t){return Math.max(0,-qr(Math.abs(t)))}(a))||(n.precision=r-2*("%"===n.type))}return Fr(n)};function Ao(t){var e=t.domain;return t.ticks=function(t){var n=e();return d(n[0],n[n.length-1],null==t?10:t)},t.tickFormat=function(t,n){return Mo(e(),t,n)},t.nice=function(n){null==n&&(n=10);var r,i=e(),o=0,a=i.length-1,s=i[o],c=i[a];return c<s&&(r=s,s=c,c=r,r=o,o=a,a=r),(r=p(s,c,n))>0?r=p(s=Math.floor(s/r)*r,c=Math.ceil(c/r)*r,n):r<0&&(r=p(s=Math.ceil(s*r)/r,c=Math.floor(c*r)/r,n)),r>0?(i[o]=Math.floor(s/r)*r,i[a]=Math.ceil(c/r)*r,e(i)):r<0&&(i[o]=Math.ceil(s*r)/r,i[a]=Math.floor(c*r)/r,e(i)),t},t}function ko(){var t=To(_o,Ie);return t.copy=function(){return wo(t,ko())},Ao(t)}var Co=new Date,Eo=new Date;function No(t,e,n,r){function i(e){return t(e=new Date(+e)),e}return i.floor=i,i.ceil=function(n){return t(n=new Date(n-1)),e(n,1),t(n),n},i.round=function(t){var e=i(t),n=i.ceil(t);return t-e<n-t?e:n},i.offset=function(t,n){return e(t=new Date(+t),null==n?1:Math.floor(n)),t},i.range=function(n,r,o){var a,s=[];if(n=i.ceil(n),o=null==o?1:Math.floor(o),!(n<r&&o>0))return s;do{s.push(a=new Date(+n)),e(n,o),t(n)}while(a<n&&n<r);return s},i.filter=function(n){return No(function(e){if(e>=e)for(;t(e),!n(e);)e.setTime(e-1)},function(t,r){if(t>=t)if(r<0)for(;++r<=0;)for(;e(t,-1),!n(t););else for(;--r>=0;)for(;e(t,1),!n(t););})},n&&(i.count=function(e,r){return Co.setTime(+e),Eo.setTime(+r),t(Co),t(Eo),Math.floor(n(Co,Eo))},i.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?i.filter(r?function(e){return r(e)%t==0}:function(e){return i.count(0,e)%t==0}):i:null}),i}var So=No(function(){},function(t,e){t.setTime(+t+e)},function(t,e){return e-t});So.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?No(function(e){e.setTime(Math.floor(e/t)*t)},function(e,n){e.setTime(+e+n*t)},function(e,n){return(n-e)/t}):So:null};So.range;var Do=6e4,Lo=6048e5,jo=No(function(t){t.setTime(1e3*Math.floor(t/1e3))},function(t,e){t.setTime(+t+1e3*e)},function(t,e){return(e-t)/1e3},function(t){return t.getUTCSeconds()}),qo=(jo.range,No(function(t){t.setTime(Math.floor(t/Do)*Do)},function(t,e){t.setTime(+t+e*Do)},function(t,e){return(e-t)/Do},function(t){return t.getMinutes()})),Po=(qo.range,No(function(t){var e=t.getTimezoneOffset()*Do%36e5;e<0&&(e+=36e5),t.setTime(36e5*Math.floor((+t-e)/36e5)+e)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getHours()})),Oo=(Po.range,No(function(t){t.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*Do)/864e5},function(t){return t.getDate()-1})),Uo=Oo;Oo.range;function Ro(t){return No(function(e){e.setDate(e.getDate()-(e.getDay()+7-t)%7),e.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+7*e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*Do)/Lo})}var Ho=Ro(0),Fo=Ro(1),Io=Ro(2),Bo=Ro(3),zo=Ro(4),$o=Ro(5),Yo=Ro(6),Wo=(Ho.range,Fo.range,Io.range,Bo.range,zo.range,$o.range,Yo.range,No(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,e){t.setMonth(t.getMonth()+e)},function(t,e){return e.getMonth()-t.getMonth()+12*(e.getFullYear()-t.getFullYear())},function(t){return t.getMonth()})),Xo=(Wo.range,No(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,e){t.setFullYear(t.getFullYear()+e)},function(t,e){return e.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()}));Xo.every=function(t){return isFinite(t=Math.floor(t))&&t>0?No(function(e){e.setFullYear(Math.floor(e.getFullYear()/t)*t),e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,n){e.setFullYear(e.getFullYear()+n*t)}):null};var Vo=Xo,Jo=(Xo.range,No(function(t){t.setUTCSeconds(0,0)},function(t,e){t.setTime(+t+e*Do)},function(t,e){return(e-t)/Do},function(t){return t.getUTCMinutes()})),Qo=(Jo.range,No(function(t){t.setUTCMinutes(0,0,0)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getUTCHours()})),Go=(Qo.range,No(function(t){t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+e)},function(t,e){return(e-t)/864e5},function(t){return t.getUTCDate()-1})),Zo=Go;Go.range;function Ko(t){return No(function(e){e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-t)%7),e.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+7*e)},function(t,e){return(e-t)/Lo})}var ta=Ko(0),ea=Ko(1),na=Ko(2),ra=Ko(3),ia=Ko(4),oa=Ko(5),aa=Ko(6),sa=(ta.range,ea.range,na.range,ra.range,ia.range,oa.range,aa.range,No(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCMonth(t.getUTCMonth()+e)},function(t,e){return e.getUTCMonth()-t.getUTCMonth()+12*(e.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()})),ca=(sa.range,No(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCFullYear(t.getUTCFullYear()+e)},function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()}));ca.every=function(t){return isFinite(t=Math.floor(t))&&t>0?No(function(e){e.setUTCFullYear(Math.floor(e.getUTCFullYear()/t)*t),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,n){e.setUTCFullYear(e.getUTCFullYear()+n*t)}):null};var ua=ca;ca.range;function fa(t){if(0<=t.y&&t.y<100){var e=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return e.setFullYear(t.y),e}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)}function la(t){if(0<=t.y&&t.y<100){var e=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return e.setUTCFullYear(t.y),e}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function ha(t){return{y:t,m:0,d:1,H:0,M:0,S:0,L:0}}var da,pa,ya,ba={"-":"",_:" ",0:"0"},ga=/^\s*\d+/,va=/^%/,_a=/[\\^$*+?|[\]().{}]/g;function ma(t,e,n){var r=t<0?"-":"",i=(r?-t:t)+"",o=i.length;return r+(o<n?new Array(n-o+1).join(e)+i:i)}function xa(t){return t.replace(_a,"\\$&")}function wa(t){return new RegExp("^(?:"+t.map(xa).join("|")+")","i")}function Ta(t){for(var e={},n=-1,r=t.length;++n<r;)e[t[n].toLowerCase()]=n;return e}function Ma(t,e,n){var r=ga.exec(e.slice(n,n+1));return r?(t.w=+r[0],n+r[0].length):-1}function Aa(t,e,n){var r=ga.exec(e.slice(n,n+1));return r?(t.u=+r[0],n+r[0].length):-1}function ka(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.U=+r[0],n+r[0].length):-1}function Ca(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.V=+r[0],n+r[0].length):-1}function Ea(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.W=+r[0],n+r[0].length):-1}function Na(t,e,n){var r=ga.exec(e.slice(n,n+4));return r?(t.y=+r[0],n+r[0].length):-1}function Sa(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),n+r[0].length):-1}function Da(t,e,n){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n,n+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),n+r[0].length):-1}function La(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.m=r[0]-1,n+r[0].length):-1}function ja(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.d=+r[0],n+r[0].length):-1}function qa(t,e,n){var r=ga.exec(e.slice(n,n+3));return r?(t.m=0,t.d=+r[0],n+r[0].length):-1}function Pa(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.H=+r[0],n+r[0].length):-1}function Oa(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.M=+r[0],n+r[0].length):-1}function Ua(t,e,n){var r=ga.exec(e.slice(n,n+2));return r?(t.S=+r[0],n+r[0].length):-1}function Ra(t,e,n){var r=ga.exec(e.slice(n,n+3));return r?(t.L=+r[0],n+r[0].length):-1}function Ha(t,e,n){var r=ga.exec(e.slice(n,n+6));return r?(t.L=Math.floor(r[0]/1e3),n+r[0].length):-1}function Fa(t,e,n){var r=va.exec(e.slice(n,n+1));return r?n+r[0].length:-1}function Ia(t,e,n){var r=ga.exec(e.slice(n));return r?(t.Q=+r[0],n+r[0].length):-1}function Ba(t,e,n){var r=ga.exec(e.slice(n));return r?(t.Q=1e3*+r[0],n+r[0].length):-1}function za(t,e){return ma(t.getDate(),e,2)}function $a(t,e){return ma(t.getHours(),e,2)}function Ya(t,e){return ma(t.getHours()%12||12,e,2)}function Wa(t,e){return ma(1+Uo.count(Vo(t),t),e,3)}function Xa(t,e){return ma(t.getMilliseconds(),e,3)}function Va(t,e){return Xa(t,e)+"000"}function Ja(t,e){return ma(t.getMonth()+1,e,2)}function Qa(t,e){return ma(t.getMinutes(),e,2)}function Ga(t,e){return ma(t.getSeconds(),e,2)}function Za(t){var e=t.getDay();return 0===e?7:e}function Ka(t,e){return ma(Ho.count(Vo(t),t),e,2)}function ts(t,e){var n=t.getDay();return t=n>=4||0===n?zo(t):zo.ceil(t),ma(zo.count(Vo(t),t)+(4===Vo(t).getDay()),e,2)}function es(t){return t.getDay()}function ns(t,e){return ma(Fo.count(Vo(t),t),e,2)}function rs(t,e){return ma(t.getFullYear()%100,e,2)}function is(t,e){return ma(t.getFullYear()%1e4,e,4)}function os(t){var e=t.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+ma(e/60|0,"0",2)+ma(e%60,"0",2)}function as(t,e){return ma(t.getUTCDate(),e,2)}function ss(t,e){return ma(t.getUTCHours(),e,2)}function cs(t,e){return ma(t.getUTCHours()%12||12,e,2)}function us(t,e){return ma(1+Zo.count(ua(t),t),e,3)}function fs(t,e){return ma(t.getUTCMilliseconds(),e,3)}function ls(t,e){return fs(t,e)+"000"}function hs(t,e){return ma(t.getUTCMonth()+1,e,2)}function ds(t,e){return ma(t.getUTCMinutes(),e,2)}function ps(t,e){return ma(t.getUTCSeconds(),e,2)}function ys(t){var e=t.getUTCDay();return 0===e?7:e}function bs(t,e){return ma(ta.count(ua(t),t),e,2)}function gs(t,e){var n=t.getUTCDay();return t=n>=4||0===n?ia(t):ia.ceil(t),ma(ia.count(ua(t),t)+(4===ua(t).getUTCDay()),e,2)}function vs(t){return t.getUTCDay()}function _s(t,e){return ma(ea.count(ua(t),t),e,2)}function ms(t,e){return ma(t.getUTCFullYear()%100,e,2)}function xs(t,e){return ma(t.getUTCFullYear()%1e4,e,4)}function ws(){return"+0000"}function Ts(){return"%"}function Ms(t){return+t}function As(t){return Math.floor(+t/1e3)}!function(t){da=function(t){var e=t.dateTime,n=t.date,r=t.time,i=t.periods,o=t.days,a=t.shortDays,s=t.months,c=t.shortMonths,u=wa(i),f=Ta(i),l=wa(o),h=Ta(o),d=wa(a),p=Ta(a),y=wa(s),b=Ta(s),g=wa(c),v=Ta(c),_={a:function(t){return a[t.getDay()]},A:function(t){return o[t.getDay()]},b:function(t){return c[t.getMonth()]},B:function(t){return s[t.getMonth()]},c:null,d:za,e:za,f:Va,H:$a,I:Ya,j:Wa,L:Xa,m:Ja,M:Qa,p:function(t){return i[+(t.getHours()>=12)]},Q:Ms,s:As,S:Ga,u:Za,U:Ka,V:ts,w:es,W:ns,x:null,X:null,y:rs,Y:is,Z:os,"%":Ts},m={a:function(t){return a[t.getUTCDay()]},A:function(t){return o[t.getUTCDay()]},b:function(t){return c[t.getUTCMonth()]},B:function(t){return s[t.getUTCMonth()]},c:null,d:as,e:as,f:ls,H:ss,I:cs,j:us,L:fs,m:hs,M:ds,p:function(t){return i[+(t.getUTCHours()>=12)]},Q:Ms,s:As,S:ps,u:ys,U:bs,V:gs,w:vs,W:_s,x:null,X:null,y:ms,Y:xs,Z:ws,"%":Ts},x={a:function(t,e,n){var r=d.exec(e.slice(n));return r?(t.w=p[r[0].toLowerCase()],n+r[0].length):-1},A:function(t,e,n){var r=l.exec(e.slice(n));return r?(t.w=h[r[0].toLowerCase()],n+r[0].length):-1},b:function(t,e,n){var r=g.exec(e.slice(n));return r?(t.m=v[r[0].toLowerCase()],n+r[0].length):-1},B:function(t,e,n){var r=y.exec(e.slice(n));return r?(t.m=b[r[0].toLowerCase()],n+r[0].length):-1},c:function(t,n,r){return M(t,e,n,r)},d:ja,e:ja,f:Ha,H:Pa,I:Pa,j:qa,L:Ra,m:La,M:Oa,p:function(t,e,n){var r=u.exec(e.slice(n));return r?(t.p=f[r[0].toLowerCase()],n+r[0].length):-1},Q:Ia,s:Ba,S:Ua,u:Aa,U:ka,V:Ca,w:Ma,W:Ea,x:function(t,e,r){return M(t,n,e,r)},X:function(t,e,n){return M(t,r,e,n)},y:Sa,Y:Na,Z:Da,"%":Fa};function w(t,e){return function(n){var r,i,o,a=[],s=-1,c=0,u=t.length;for(n instanceof Date||(n=new Date(+n));++s<u;)37===t.charCodeAt(s)&&(a.push(t.slice(c,s)),null!=(i=ba[r=t.charAt(++s)])?r=t.charAt(++s):i="e"===r?" ":"0",(o=e[r])&&(r=o(n,i)),a.push(r),c=s+1);return a.push(t.slice(c,s)),a.join("")}}function T(t,e){return function(n){var r,i,o=ha(1900);if(M(o,t,n+="",0)!=n.length)return null;if("Q"in o)return new Date(o.Q);if("p"in o&&(o.H=o.H%12+12*o.p),"V"in o){if(o.V<1||o.V>53)return null;"w"in o||(o.w=1),"Z"in o?(r=(i=(r=la(ha(o.y))).getUTCDay())>4||0===i?ea.ceil(r):ea(r),r=Zo.offset(r,7*(o.V-1)),o.y=r.getUTCFullYear(),o.m=r.getUTCMonth(),o.d=r.getUTCDate()+(o.w+6)%7):(r=(i=(r=e(ha(o.y))).getDay())>4||0===i?Fo.ceil(r):Fo(r),r=Uo.offset(r,7*(o.V-1)),o.y=r.getFullYear(),o.m=r.getMonth(),o.d=r.getDate()+(o.w+6)%7)}else("W"in o||"U"in o)&&("w"in o||(o.w="u"in o?o.u%7:"W"in o?1:0),i="Z"in o?la(ha(o.y)).getUTCDay():e(ha(o.y)).getDay(),o.m=0,o.d="W"in o?(o.w+6)%7+7*o.W-(i+5)%7:o.w+7*o.U-(i+6)%7);return"Z"in o?(o.H+=o.Z/100|0,o.M+=o.Z%100,la(o)):e(o)}}function M(t,e,n,r){for(var i,o,a=0,s=e.length,c=n.length;a<s;){if(r>=c)return-1;if(37===(i=e.charCodeAt(a++))){if(i=e.charAt(a++),!(o=x[i in ba?e.charAt(a++):i])||(r=o(t,n,r))<0)return-1}else if(i!=n.charCodeAt(r++))return-1}return r}return _.x=w(n,_),_.X=w(r,_),_.c=w(e,_),m.x=w(n,m),m.X=w(r,m),m.c=w(e,m),{format:function(t){var e=w(t+="",_);return e.toString=function(){return t},e},parse:function(t){var e=T(t+="",fa);return e.toString=function(){return t},e},utcFormat:function(t){var e=w(t+="",m);return e.toString=function(){return t},e},utcParse:function(t){var e=T(t,la);return e.toString=function(){return t},e}}}(t),da.format,da.parse,pa=da.utcFormat,ya=da.utcParse}({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});Date.prototype.toISOString||pa("%Y-%m-%dT%H:%M:%S.%LZ");+new Date("2000-01-01T00:00:00.000Z")||ya("%Y-%m-%dT%H:%M:%S.%LZ");var ks=function(t){for(var e=t.length/6|0,n=new Array(e),r=0;r<e;)n[r]="#"+t.slice(6*r,6*++r);return n},Cs=(ks("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"),ks("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666"),ks("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666"),ks("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"),ks("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"),ks("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc"),ks("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999")),Es=ks("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3"),Ns=ks("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f"),Ss=function(t){return Fe(t[t.length-1])};Ss(new Array(3).concat("d8b365f5f5f55ab4ac","a6611adfc27d80cdc1018571","a6611adfc27df5f5f580cdc1018571","8c510ad8b365f6e8c3c7eae55ab4ac01665e","8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e","8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e","8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e","5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30","5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(ks)),Ss(new Array(3).concat("af8dc3f7f7f77fbf7b","7b3294c2a5cfa6dba0008837","7b3294c2a5cff7f7f7a6dba0008837","762a83af8dc3e7d4e8d9f0d37fbf7b1b7837","762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837","762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837","762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837","40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b","40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(ks)),Ss(new Array(3).concat("e9a3c9f7f7f7a1d76a","d01c8bf1b6dab8e1864dac26","d01c8bf1b6daf7f7f7b8e1864dac26","c51b7de9a3c9fde0efe6f5d0a1d76a4d9221","c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221","c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221","c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221","8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419","8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(ks)),Ss(new Array(3).concat("998ec3f7f7f7f1a340","5e3c99b2abd2fdb863e66101","5e3c99b2abd2f7f7f7fdb863e66101","542788998ec3d8daebfee0b6f1a340b35806","542788998ec3d8daebf7f7f7fee0b6f1a340b35806","5427888073acb2abd2d8daebfee0b6fdb863e08214b35806","5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806","2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08","2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(ks)),Ss(new Array(3).concat("ef8a62f7f7f767a9cf","ca0020f4a58292c5de0571b0","ca0020f4a582f7f7f792c5de0571b0","b2182bef8a62fddbc7d1e5f067a9cf2166ac","b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac","b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac","b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac","67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061","67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(ks)),Ss(new Array(3).concat("ef8a62ffffff999999","ca0020f4a582bababa404040","ca0020f4a582ffffffbababa404040","b2182bef8a62fddbc7e0e0e09999994d4d4d","b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d","b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d","b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d","67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a","67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(ks)),Ss(new Array(3).concat("fc8d59ffffbf91bfdb","d7191cfdae61abd9e92c7bb6","d7191cfdae61ffffbfabd9e92c7bb6","d73027fc8d59fee090e0f3f891bfdb4575b4","d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4","d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4","d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4","a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695","a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(ks)),Ss(new Array(3).concat("fc8d59ffffbf91cf60","d7191cfdae61a6d96a1a9641","d7191cfdae61ffffbfa6d96a1a9641","d73027fc8d59fee08bd9ef8b91cf601a9850","d73027fc8d59fee08bffffbfd9ef8b91cf601a9850","d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850","d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850","a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837","a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(ks)),Ss(new Array(3).concat("fc8d59ffffbf99d594","d7191cfdae61abdda42b83ba","d7191cfdae61ffffbfabdda42b83ba","d53e4ffc8d59fee08be6f59899d5943288bd","d53e4ffc8d59fee08bffffbfe6f59899d5943288bd","d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd","d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd","9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2","9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(ks)),Ss(new Array(3).concat("e5f5f999d8c92ca25f","edf8fbb2e2e266c2a4238b45","edf8fbb2e2e266c2a42ca25f006d2c","edf8fbccece699d8c966c2a42ca25f006d2c","edf8fbccece699d8c966c2a441ae76238b45005824","f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824","f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(ks)),Ss(new Array(3).concat("e0ecf49ebcda8856a7","edf8fbb3cde38c96c688419d","edf8fbb3cde38c96c68856a7810f7c","edf8fbbfd3e69ebcda8c96c68856a7810f7c","edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b","f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b","f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(ks)),Ss(new Array(3).concat("e0f3dba8ddb543a2ca","f0f9e8bae4bc7bccc42b8cbe","f0f9e8bae4bc7bccc443a2ca0868ac","f0f9e8ccebc5a8ddb57bccc443a2ca0868ac","f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e","f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e","f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(ks)),Ss(new Array(3).concat("fee8c8fdbb84e34a33","fef0d9fdcc8afc8d59d7301f","fef0d9fdcc8afc8d59e34a33b30000","fef0d9fdd49efdbb84fc8d59e34a33b30000","fef0d9fdd49efdbb84fc8d59ef6548d7301f990000","fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000","fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(ks)),Ss(new Array(3).concat("ece2f0a6bddb1c9099","f6eff7bdc9e167a9cf02818a","f6eff7bdc9e167a9cf1c9099016c59","f6eff7d0d1e6a6bddb67a9cf1c9099016c59","f6eff7d0d1e6a6bddb67a9cf3690c002818a016450","fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450","fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(ks)),Ss(new Array(3).concat("ece7f2a6bddb2b8cbe","f1eef6bdc9e174a9cf0570b0","f1eef6bdc9e174a9cf2b8cbe045a8d","f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d","f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b","fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b","fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(ks)),Ss(new Array(3).concat("e7e1efc994c7dd1c77","f1eef6d7b5d8df65b0ce1256","f1eef6d7b5d8df65b0dd1c77980043","f1eef6d4b9dac994c7df65b0dd1c77980043","f1eef6d4b9dac994c7df65b0e7298ace125691003f","f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f","f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(ks)),Ss(new Array(3).concat("fde0ddfa9fb5c51b8a","feebe2fbb4b9f768a1ae017e","feebe2fbb4b9f768a1c51b8a7a0177","feebe2fcc5c0fa9fb5f768a1c51b8a7a0177","feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177","fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177","fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(ks)),Ss(new Array(3).concat("edf8b17fcdbb2c7fb8","ffffcca1dab441b6c4225ea8","ffffcca1dab441b6c42c7fb8253494","ffffccc7e9b47fcdbb41b6c42c7fb8253494","ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84","ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84","ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(ks)),Ss(new Array(3).concat("f7fcb9addd8e31a354","ffffccc2e69978c679238443","ffffccc2e69978c67931a354006837","ffffccd9f0a3addd8e78c67931a354006837","ffffccd9f0a3addd8e78c67941ab5d238443005a32","ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32","ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(ks)),Ss(new Array(3).concat("fff7bcfec44fd95f0e","ffffd4fed98efe9929cc4c02","ffffd4fed98efe9929d95f0e993404","ffffd4fee391fec44ffe9929d95f0e993404","ffffd4fee391fec44ffe9929ec7014cc4c028c2d04","ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04","ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(ks)),Ss(new Array(3).concat("ffeda0feb24cf03b20","ffffb2fecc5cfd8d3ce31a1c","ffffb2fecc5cfd8d3cf03b20bd0026","ffffb2fed976feb24cfd8d3cf03b20bd0026","ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026","ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026","ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(ks)),Ss(new Array(3).concat("deebf79ecae13182bd","eff3ffbdd7e76baed62171b5","eff3ffbdd7e76baed63182bd08519c","eff3ffc6dbef9ecae16baed63182bd08519c","eff3ffc6dbef9ecae16baed64292c62171b5084594","f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594","f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(ks)),Ss(new Array(3).concat("e5f5e0a1d99b31a354","edf8e9bae4b374c476238b45","edf8e9bae4b374c47631a354006d2c","edf8e9c7e9c0a1d99b74c47631a354006d2c","edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32","f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32","f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(ks)),Ss(new Array(3).concat("f0f0f0bdbdbd636363","f7f7f7cccccc969696525252","f7f7f7cccccc969696636363252525","f7f7f7d9d9d9bdbdbd969696636363252525","f7f7f7d9d9d9bdbdbd969696737373525252252525","fffffff0f0f0d9d9d9bdbdbd969696737373525252252525","fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(ks)),Ss(new Array(3).concat("efedf5bcbddc756bb1","f2f0f7cbc9e29e9ac86a51a3","f2f0f7cbc9e29e9ac8756bb154278f","f2f0f7dadaebbcbddc9e9ac8756bb154278f","f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486","fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486","fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(ks)),Ss(new Array(3).concat("fee0d2fc9272de2d26","fee5d9fcae91fb6a4acb181d","fee5d9fcae91fb6a4ade2d26a50f15","fee5d9fcbba1fc9272fb6a4ade2d26a50f15","fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d","fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d","fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(ks)),Ss(new Array(3).concat("fee6cefdae6be6550d","feeddefdbe85fd8d3cd94701","feeddefdbe85fd8d3ce6550da63603","feeddefdd0a2fdae6bfd8d3ce6550da63603","feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04","fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04","fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(ks)),sn(Se(300,.5,0),Se(-240,.5,1)),sn(Se(-100,.75,.35),Se(80,1.5,.8)),sn(Se(260,.75,.35),Se(80,1.5,.8)),Se(),Zt(),Math.PI,Math.PI;function Ds(t){var e=t.length;return function(n){return t[Math.max(0,Math.min(e-1,Math.floor(n*e)))]}}Ds(ks("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")),Ds(ks("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")),Ds(ks("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")),Ds(ks("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));var Ls=function(t){return function(){return t}},js=(Math.abs,Math.atan2,Math.cos,Math.max,Math.min,Math.sin,Math.sqrt,1e-12),qs=Math.PI,Ps=2*qs;function Os(t){this._context=t}Os.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;default:this._context.lineTo(t,e)}}};var Us=function(t){return new Os(t)};function Rs(t){return t[0]}function Hs(t){return t[1]}var Fs=function(){var t=Rs,e=Hs,n=Ls(!0),r=null,i=Us,o=null;function a(a){var s,c,u,f=a.length,l=!1;for(null==r&&(o=i(u=rr())),s=0;s<=f;++s)!(s<f&&n(c=a[s],s,a))===l&&((l=!l)?o.lineStart():o.lineEnd()),l&&o.point(+t(c,s,a),+e(c,s,a));if(u)return o=null,u+""||null}return a.x=function(e){return arguments.length?(t="function"==typeof e?e:Ls(+e),a):t},a.y=function(t){return arguments.length?(e="function"==typeof t?t:Ls(+t),a):e},a.defined=function(t){return arguments.length?(n="function"==typeof t?t:Ls(!!t),a):n},a.curve=function(t){return arguments.length?(i=t,null!=r&&(o=i(r)),a):i},a.context=function(t){return arguments.length?(null==t?r=o=null:o=i(r=t),a):r},a};Bs(Us);function Is(t){this._curve=t}function Bs(t){function e(e){return new Is(t(e))}return e._curve=t,e}Is.prototype={areaStart:function(){this._curve.areaStart()},areaEnd:function(){this._curve.areaEnd()},lineStart:function(){this._curve.lineStart()},lineEnd:function(){this._curve.lineEnd()},point:function(t,e){this._curve.point(e*Math.sin(t),e*-Math.cos(t))}};Array.prototype.slice;var zs={draw:function(t,e){var n=Math.sqrt(e/qs);t.moveTo(n,0),t.arc(0,0,n,0,Ps)}},$s=(Math.sqrt(1/3),Math.sin(qs/10)/Math.sin(7*qs/10)),Ys=(Math.sin(Ps/10),Math.cos(Ps/10),{draw:function(t,e){var n=Math.sqrt(e),r=-n/2;t.rect(r,r,n,n)}}),Ws=(Math.sqrt(3),Math.sqrt(3),Math.sqrt(12),function(){var t=Ls(zs),e=Ls(64),n=null;function r(){var r;if(n||(n=r=rr()),t.apply(this,arguments).draw(n,+e.apply(this,arguments)),r)return n=null,r+""||null}return r.type=function(e){return arguments.length?(t="function"==typeof e?e:Ls(e),r):t},r.size=function(t){return arguments.length?(e="function"==typeof t?t:Ls(+t),r):e},r.context=function(t){return arguments.length?(n=null==t?null:t,r):n},r}),Xs=function(){};function Vs(t,e,n){t._context.bezierCurveTo((2*t._x0+t._x1)/3,(2*t._y0+t._y1)/3,(t._x0+2*t._x1)/3,(t._y0+2*t._y1)/3,(t._x0+4*t._x1+e)/6,(t._y0+4*t._y1+n)/6)}function Js(t){this._context=t}Js.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){switch(this._point){case 3:Vs(this,this._x1,this._y1);case 2:this._context.lineTo(this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;break;case 2:this._point=3,this._context.lineTo((5*this._x0+this._x1)/6,(5*this._y0+this._y1)/6);default:Vs(this,t,e)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=e}};function Qs(t){this._context=t}Qs.prototype={areaStart:Xs,areaEnd:Xs,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._y0=this._y1=this._y2=this._y3=this._y4=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x2,this._y2),this._context.closePath();break;case 2:this._context.moveTo((this._x2+2*this._x3)/3,(this._y2+2*this._y3)/3),this._context.lineTo((this._x3+2*this._x2)/3,(this._y3+2*this._y2)/3),this._context.closePath();break;case 3:this.point(this._x2,this._y2),this.point(this._x3,this._y3),this.point(this._x4,this._y4)}},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._x2=t,this._y2=e;break;case 1:this._point=2,this._x3=t,this._y3=e;break;case 2:this._point=3,this._x4=t,this._y4=e,this._context.moveTo((this._x0+4*this._x1+t)/6,(this._y0+4*this._y1+e)/6);break;default:Vs(this,t,e)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=e}};function Gs(t){this._context=t}Gs.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3;var n=(this._x0+4*this._x1+t)/6,r=(this._y0+4*this._y1+e)/6;this._line?this._context.lineTo(n,r):this._context.moveTo(n,r);break;case 3:this._point=4;default:Vs(this,t,e)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=e}};function Zs(t,e){this._basis=new Js(t),this._beta=e}Zs.prototype={lineStart:function(){this._x=[],this._y=[],this._basis.lineStart()},lineEnd:function(){var t=this._x,e=this._y,n=t.length-1;if(n>0)for(var r,i=t[0],o=e[0],a=t[n]-i,s=e[n]-o,c=-1;++c<=n;)r=c/n,this._basis.point(this._beta*t[c]+(1-this._beta)*(i+r*a),this._beta*e[c]+(1-this._beta)*(o+r*s));this._x=this._y=null,this._basis.lineEnd()},point:function(t,e){this._x.push(+t),this._y.push(+e)}};(function t(e){function n(t){return 1===e?new Js(t):new Zs(t,e)}return n.beta=function(e){return t(+e)},n})(.85);function Ks(t,e,n){t._context.bezierCurveTo(t._x1+t._k*(t._x2-t._x0),t._y1+t._k*(t._y2-t._y0),t._x2+t._k*(t._x1-e),t._y2+t._k*(t._y1-n),t._x2,t._y2)}function tc(t,e){this._context=t,this._k=(1-e)/6}tc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:Ks(this,this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2,this._x1=t,this._y1=e;break;case 2:this._point=3;default:Ks(this,t,e)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return new tc(t,e)}return n.tension=function(e){return t(+e)},n})(0);function ec(t,e){this._context=t,this._k=(1-e)/6}ec.prototype={areaStart:Xs,areaEnd:Xs,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._x3=t,this._y3=e;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=e);break;case 2:this._point=3,this._x5=t,this._y5=e;break;default:Ks(this,t,e)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return new ec(t,e)}return n.tension=function(e){return t(+e)},n})(0);function nc(t,e){this._context=t,this._k=(1-e)/6}nc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:Ks(this,t,e)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return new nc(t,e)}return n.tension=function(e){return t(+e)},n})(0);function rc(t,e,n){var r=t._x1,i=t._y1,o=t._x2,a=t._y2;if(t._l01_a>js){var s=2*t._l01_2a+3*t._l01_a*t._l12_a+t._l12_2a,c=3*t._l01_a*(t._l01_a+t._l12_a);r=(r*s-t._x0*t._l12_2a+t._x2*t._l01_2a)/c,i=(i*s-t._y0*t._l12_2a+t._y2*t._l01_2a)/c}if(t._l23_a>js){var u=2*t._l23_2a+3*t._l23_a*t._l12_a+t._l12_2a,f=3*t._l23_a*(t._l23_a+t._l12_a);o=(o*u+t._x1*t._l23_2a-e*t._l12_2a)/f,a=(a*u+t._y1*t._l23_2a-n*t._l12_2a)/f}t._context.bezierCurveTo(r,i,o,a,t._x2,t._y2)}function ic(t,e){this._context=t,this._alpha=e}ic.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:this.point(this._x2,this._y2)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){if(t=+t,e=+e,this._point){var n=this._x2-t,r=this._y2-e;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(n*n+r*r,this._alpha))}switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;break;case 2:this._point=3;default:rc(this,t,e)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return e?new ic(t,e):new tc(t,0)}return n.alpha=function(e){return t(+e)},n})(.5);function oc(t,e){this._context=t,this._alpha=e}oc.prototype={areaStart:Xs,areaEnd:Xs,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,e){if(t=+t,e=+e,this._point){var n=this._x2-t,r=this._y2-e;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(n*n+r*r,this._alpha))}switch(this._point){case 0:this._point=1,this._x3=t,this._y3=e;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=e);break;case 2:this._point=3,this._x5=t,this._y5=e;break;default:rc(this,t,e)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return e?new oc(t,e):new ec(t,0)}return n.alpha=function(e){return t(+e)},n})(.5);function ac(t,e){this._context=t,this._alpha=e}ac.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){if(t=+t,e=+e,this._point){var n=this._x2-t,r=this._y2-e;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(n*n+r*r,this._alpha))}switch(this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:rc(this,t,e)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=e}};(function t(e){function n(t){return e?new ac(t,e):new nc(t,0)}return n.alpha=function(e){return t(+e)},n})(.5);function sc(t){this._context=t}sc.prototype={areaStart:Xs,areaEnd:Xs,lineStart:function(){this._point=0},lineEnd:function(){this._point&&this._context.closePath()},point:function(t,e){t=+t,e=+e,this._point?this._context.lineTo(t,e):(this._point=1,this._context.moveTo(t,e))}};function cc(t){return t<0?-1:1}function uc(t,e,n){var r=t._x1-t._x0,i=e-t._x1,o=(t._y1-t._y0)/(r||i<0&&-0),a=(n-t._y1)/(i||r<0&&-0),s=(o*i+a*r)/(r+i);return(cc(o)+cc(a))*Math.min(Math.abs(o),Math.abs(a),.5*Math.abs(s))||0}function fc(t,e){var n=t._x1-t._x0;return n?(3*(t._y1-t._y0)/n-e)/2:e}function lc(t,e,n){var r=t._x0,i=t._y0,o=t._x1,a=t._y1,s=(o-r)/3;t._context.bezierCurveTo(r+s,i+s*e,o-s,a-s*n,o,a)}function hc(t){this._context=t}function dc(t){this._context=new pc(t)}function pc(t){this._context=t}function yc(t){this._context=t}function bc(t){var e,n,r=t.length-1,i=new Array(r),o=new Array(r),a=new Array(r);for(i[0]=0,o[0]=2,a[0]=t[0]+2*t[1],e=1;e<r-1;++e)i[e]=1,o[e]=4,a[e]=4*t[e]+2*t[e+1];for(i[r-1]=2,o[r-1]=7,a[r-1]=8*t[r-1]+t[r],e=1;e<r;++e)n=i[e]/o[e-1],o[e]-=n,a[e]-=n*a[e-1];for(i[r-1]=a[r-1]/o[r-1],e=r-2;e>=0;--e)i[e]=(a[e]-i[e+1])/o[e];for(o[r-1]=(t[r]+i[r-1])/2,e=0;e<r-1;++e)o[e]=2*t[e+1]-i[e+1];return[i,o]}hc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=this._t0=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x1,this._y1);break;case 3:lc(this,this._t0,fc(this,this._t0))}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,e){var n=NaN;if(e=+e,(t=+t)!==this._x1||e!==this._y1){switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;break;case 2:this._point=3,lc(this,fc(this,n=uc(this,t,e)),n);break;default:lc(this,this._t0,n=uc(this,t,e))}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=e,this._t0=n}}},(dc.prototype=Object.create(hc.prototype)).point=function(t,e){hc.prototype.point.call(this,e,t)},pc.prototype={moveTo:function(t,e){this._context.moveTo(e,t)},closePath:function(){this._context.closePath()},lineTo:function(t,e){this._context.lineTo(e,t)},bezierCurveTo:function(t,e,n,r,i,o){this._context.bezierCurveTo(e,t,r,n,o,i)}},yc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=[],this._y=[]},lineEnd:function(){var t=this._x,e=this._y,n=t.length;if(n)if(this._line?this._context.lineTo(t[0],e[0]):this._context.moveTo(t[0],e[0]),2===n)this._context.lineTo(t[1],e[1]);else for(var r=bc(t),i=bc(e),o=0,a=1;a<n;++o,++a)this._context.bezierCurveTo(r[0][o],i[0][o],r[1][o],i[1][o],t[a],e[a]);(this._line||0!==this._line&&1===n)&&this._context.closePath(),this._line=1-this._line,this._x=this._y=null},point:function(t,e){this._x.push(+t),this._y.push(+e)}};function gc(t,e){this._context=t,this._t=e}gc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&2===this._point&&this._context.lineTo(this._x,this._y),(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(t,e){switch(t=+t,e=+e,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,e):this._context.moveTo(t,e);break;case 1:this._point=2;default:if(this._t<=0)this._context.lineTo(this._x,e),this._context.lineTo(t,e);else{var n=this._x*(1-this._t)+t*this._t;this._context.lineTo(n,this._y),this._context.lineTo(n,e)}}this._x=t,this._y=e}};function vc(){this._=null}function _c(t){t.U=t.C=t.L=t.R=t.P=t.N=null}function mc(t,e){var n=e,r=e.R,i=n.U;i?i.L===n?i.L=r:i.R=r:t._=r,r.U=i,n.U=r,n.R=r.L,n.R&&(n.R.U=n),r.L=n}function xc(t,e){var n=e,r=e.L,i=n.U;i?i.L===n?i.L=r:i.R=r:t._=r,r.U=i,n.U=r,n.L=r.R,n.L&&(n.L.U=n),r.R=n}function wc(t){for(;t.L;)t=t.L;return t}vc.prototype={constructor:vc,insert:function(t,e){var n,r,i;if(t){if(e.P=t,e.N=t.N,t.N&&(t.N.P=e),t.N=e,t.R){for(t=t.R;t.L;)t=t.L;t.L=e}else t.R=e;n=t}else this._?(t=wc(this._),e.P=null,e.N=t,t.P=t.L=e,n=t):(e.P=e.N=null,this._=e,n=null);for(e.L=e.R=null,e.U=n,e.C=!0,t=e;n&&n.C;)n===(r=n.U).L?(i=r.R)&&i.C?(n.C=i.C=!1,r.C=!0,t=r):(t===n.R&&(mc(this,n),n=(t=n).U),n.C=!1,r.C=!0,xc(this,r)):(i=r.L)&&i.C?(n.C=i.C=!1,r.C=!0,t=r):(t===n.L&&(xc(this,n),n=(t=n).U),n.C=!1,r.C=!0,mc(this,r)),n=t.U;this._.C=!1},remove:function(t){t.N&&(t.N.P=t.P),t.P&&(t.P.N=t.N),t.N=t.P=null;var e,n,r,i=t.U,o=t.L,a=t.R;if(n=o?a?wc(a):o:a,i?i.L===t?i.L=n:i.R=n:this._=n,o&&a?(r=n.C,n.C=t.C,n.L=o,o.U=n,n!==a?(i=n.U,n.U=t.U,t=n.R,i.L=t,n.R=a,a.U=n):(n.U=i,i=n,t=n.R)):(r=t.C,t=n),t&&(t.U=i),!r)if(t&&t.C)t.C=!1;else{do{if(t===this._)break;if(t===i.L){if((e=i.R).C&&(e.C=!1,i.C=!0,mc(this,i),e=i.R),e.L&&e.L.C||e.R&&e.R.C){e.R&&e.R.C||(e.L.C=!1,e.C=!0,xc(this,e),e=i.R),e.C=i.C,i.C=e.R.C=!1,mc(this,i),t=this._;break}}else if((e=i.L).C&&(e.C=!1,i.C=!0,xc(this,i),e=i.L),e.L&&e.L.C||e.R&&e.R.C){e.L&&e.L.C||(e.R.C=!1,e.C=!0,mc(this,e),e=i.L),e.C=i.C,i.C=e.L.C=!1,xc(this,i),t=this._;break}e.C=!0,t=i,i=i.U}while(!t.C);t&&(t.C=!1)}}};var Tc=vc;function Mc(t,e,n,r){var i=[null,null],o=Wc.push(i)-1;return i.left=t,i.right=e,n&&kc(i,t,e,n),r&&kc(i,e,t,r),$c[t.index].halfedges.push(o),$c[e.index].halfedges.push(o),i}function Ac(t,e,n){var r=[e,n];return r.left=t,r}function kc(t,e,n,r){t[0]||t[1]?t.left===n?t[1]=r:t[0]=r:(t[0]=r,t.left=e,t.right=n)}function Cc(t,e,n,r,i){var o,a=t[0],s=t[1],c=a[0],u=a[1],f=0,l=1,h=s[0]-c,d=s[1]-u;if(o=e-c,h||!(o>0)){if(o/=h,h<0){if(o<f)return;o<l&&(l=o)}else if(h>0){if(o>l)return;o>f&&(f=o)}if(o=r-c,h||!(o<0)){if(o/=h,h<0){if(o>l)return;o>f&&(f=o)}else if(h>0){if(o<f)return;o<l&&(l=o)}if(o=n-u,d||!(o>0)){if(o/=d,d<0){if(o<f)return;o<l&&(l=o)}else if(d>0){if(o>l)return;o>f&&(f=o)}if(o=i-u,d||!(o<0)){if(o/=d,d<0){if(o>l)return;o>f&&(f=o)}else if(d>0){if(o<f)return;o<l&&(l=o)}return!(f>0||l<1)||(f>0&&(t[0]=[c+f*h,u+f*d]),l<1&&(t[1]=[c+l*h,u+l*d]),!0)}}}}}function Ec(t,e,n,r,i){var o=t[1];if(o)return!0;var a,s,c=t[0],u=t.left,f=t.right,l=u[0],h=u[1],d=f[0],p=f[1],y=(l+d)/2,b=(h+p)/2;if(p===h){if(y<e||y>=r)return;if(l>d){if(c){if(c[1]>=i)return}else c=[y,n];o=[y,i]}else{if(c){if(c[1]<n)return}else c=[y,i];o=[y,n]}}else if(s=b-(a=(l-d)/(p-h))*y,a<-1||a>1)if(l>d){if(c){if(c[1]>=i)return}else c=[(n-s)/a,n];o=[(i-s)/a,i]}else{if(c){if(c[1]<n)return}else c=[(i-s)/a,i];o=[(n-s)/a,n]}else if(h<p){if(c){if(c[0]>=r)return}else c=[e,a*e+s];o=[r,a*r+s]}else{if(c){if(c[0]<e)return}else c=[r,a*r+s];o=[e,a*e+s]}return t[0]=c,t[1]=o,!0}function Nc(t,e){var n=t.site,r=e.left,i=e.right;return n===i&&(i=r,r=n),i?Math.atan2(i[1]-r[1],i[0]-r[0]):(n===r?(r=e[1],i=e[0]):(r=e[0],i=e[1]),Math.atan2(r[0]-i[0],i[1]-r[1]))}function Sc(t,e){return e[+(e.left!==t.site)]}function Dc(t,e){return e[+(e.left===t.site)]}var Lc,jc=[];function qc(t){var e=t.P,n=t.N;if(e&&n){var r=e.site,i=t.site,o=n.site;if(r!==o){var a=i[0],s=i[1],c=r[0]-a,u=r[1]-s,f=o[0]-a,l=o[1]-s,h=2*(c*l-u*f);if(!(h>=-Vc)){var d=c*c+u*u,p=f*f+l*l,y=(l*d-u*p)/h,b=(c*p-f*d)/h,g=jc.pop()||new function(){_c(this),this.x=this.y=this.arc=this.site=this.cy=null};g.arc=t,g.site=i,g.x=y+a,g.y=(g.cy=b+s)+Math.sqrt(y*y+b*b),t.circle=g;for(var v=null,_=Yc._;_;)if(g.y<_.y||g.y===_.y&&g.x<=_.x){if(!_.L){v=_.P;break}_=_.L}else{if(!_.R){v=_;break}_=_.R}Yc.insert(v,g),v||(Lc=g)}}}}function Pc(t){var e=t.circle;e&&(e.P||(Lc=e.N),Yc.remove(e),jc.push(e),_c(e),t.circle=null)}var Oc=[];function Uc(t){var e=Oc.pop()||new function(){_c(this),this.edge=this.site=this.circle=null};return e.site=t,e}function Rc(t){Pc(t),zc.remove(t),Oc.push(t),_c(t)}function Hc(t){var e=t.circle,n=e.x,r=e.cy,i=[n,r],o=t.P,a=t.N,s=[t];Rc(t);for(var c=o;c.circle&&Math.abs(n-c.circle.x)<Xc&&Math.abs(r-c.circle.cy)<Xc;)o=c.P,s.unshift(c),Rc(c),c=o;s.unshift(c),Pc(c);for(var u=a;u.circle&&Math.abs(n-u.circle.x)<Xc&&Math.abs(r-u.circle.cy)<Xc;)a=u.N,s.push(u),Rc(u),u=a;s.push(u),Pc(u);var f,l=s.length;for(f=1;f<l;++f)u=s[f],c=s[f-1],kc(u.edge,c.site,u.site,i);c=s[0],(u=s[l-1]).edge=Mc(c.site,u.site,null,i),qc(c),qc(u)}function Fc(t){for(var e,n,r,i,o=t[0],a=t[1],s=zc._;s;)if((r=Ic(s,a)-o)>Xc)s=s.L;else{if(!((i=o-Bc(s,a))>Xc)){r>-Xc?(e=s.P,n=s):i>-Xc?(e=s,n=s.N):e=n=s;break}if(!s.R){e=s;break}s=s.R}!function(t){$c[t.index]={site:t,halfedges:[]}}(t);var c=Uc(t);if(zc.insert(e,c),e||n){if(e===n)return Pc(e),n=Uc(e.site),zc.insert(c,n),c.edge=n.edge=Mc(e.site,c.site),qc(e),void qc(n);if(n){Pc(e),Pc(n);var u=e.site,f=u[0],l=u[1],h=t[0]-f,d=t[1]-l,p=n.site,y=p[0]-f,b=p[1]-l,g=2*(h*b-d*y),v=h*h+d*d,_=y*y+b*b,m=[(b*v-d*_)/g+f,(h*_-y*v)/g+l];kc(n.edge,u,p,m),c.edge=Mc(u,t,null,m),n.edge=Mc(t,p,null,m),qc(e),qc(n)}else c.edge=Mc(e.site,c.site)}}function Ic(t,e){var n=t.site,r=n[0],i=n[1],o=i-e;if(!o)return r;var a=t.P;if(!a)return-1/0;var s=(n=a.site)[0],c=n[1],u=c-e;if(!u)return s;var f=s-r,l=1/o-1/u,h=f/u;return l?(-h+Math.sqrt(h*h-2*l*(f*f/(-2*u)-c+u/2+i-o/2)))/l+r:(r+s)/2}function Bc(t,e){var n=t.N;if(n)return Ic(n,e);var r=t.site;return r[1]===e?r[0]:1/0}var zc,$c,Yc,Wc,Xc=1e-6,Vc=1e-12;function Jc(t,e,n){return(t[0]-n[0])*(e[1]-t[1])-(t[0]-e[0])*(n[1]-t[1])}function Qc(t,e){return e[1]-t[1]||e[0]-t[0]}function Gc(t,e){var n,r,i,o=t.sort(Qc).pop();for(Wc=[],$c=new Array(t.length),zc=new Tc,Yc=new Tc;;)if(i=Lc,o&&(!i||o[1]<i.y||o[1]===i.y&&o[0]<i.x))o[0]===n&&o[1]===r||(Fc(o),n=o[0],r=o[1]),o=t.pop();else{if(!i)break;Hc(i.arc)}if(function(){for(var t,e,n,r,i=0,o=$c.length;i<o;++i)if((t=$c[i])&&(r=(e=t.halfedges).length)){var a=new Array(r),s=new Array(r);for(n=0;n<r;++n)a[n]=n,s[n]=Nc(t,Wc[e[n]]);for(a.sort(function(t,e){return s[e]-s[t]}),n=0;n<r;++n)s[n]=e[a[n]];for(n=0;n<r;++n)e[n]=s[n]}}(),e){var a=+e[0][0],s=+e[0][1],c=+e[1][0],u=+e[1][1];!function(t,e,n,r){for(var i,o=Wc.length;o--;)Ec(i=Wc[o],t,e,n,r)&&Cc(i,t,e,n,r)&&(Math.abs(i[0][0]-i[1][0])>Xc||Math.abs(i[0][1]-i[1][1])>Xc)||delete Wc[o]}(a,s,c,u),function(t,e,n,r){var i,o,a,s,c,u,f,l,h,d,p,y,b=$c.length,g=!0;for(i=0;i<b;++i)if(o=$c[i]){for(a=o.site,s=(c=o.halfedges).length;s--;)Wc[c[s]]||c.splice(s,1);for(s=0,u=c.length;s<u;)p=(d=Dc(o,Wc[c[s]]))[0],y=d[1],l=(f=Sc(o,Wc[c[++s%u]]))[0],h=f[1],(Math.abs(p-l)>Xc||Math.abs(y-h)>Xc)&&(c.splice(s,0,Wc.push(Ac(a,d,Math.abs(p-t)<Xc&&r-y>Xc?[t,Math.abs(l-t)<Xc?h:r]:Math.abs(y-r)<Xc&&n-p>Xc?[Math.abs(h-r)<Xc?l:n,r]:Math.abs(p-n)<Xc&&y-e>Xc?[n,Math.abs(l-n)<Xc?h:e]:Math.abs(y-e)<Xc&&p-t>Xc?[Math.abs(h-e)<Xc?l:t,e]:null))-1),++u);u&&(g=!1)}if(g){var v,_,m,x=1/0;for(i=0,g=null;i<b;++i)(o=$c[i])&&(m=(v=(a=o.site)[0]-t)*v+(_=a[1]-e)*_)<x&&(x=m,g=o);if(g){var w=[t,e],T=[t,r],M=[n,r],A=[n,e];g.halfedges.push(Wc.push(Ac(a=g.site,w,T))-1,Wc.push(Ac(a,T,M))-1,Wc.push(Ac(a,M,A))-1,Wc.push(Ac(a,A,w))-1)}}for(i=0;i<b;++i)(o=$c[i])&&(o.halfedges.length||delete $c[i])}(a,s,c,u)}this.edges=Wc,this.cells=$c,zc=Yc=Wc=$c=null}Gc.prototype={constructor:Gc,polygons:function(){var t=this.edges;return this.cells.map(function(e){var n=e.halfedges.map(function(n){return Sc(e,t[n])});return n.data=e.site.data,n})},triangles:function(){var t=[],e=this.edges;return this.cells.forEach(function(n,r){if(o=(i=n.halfedges).length)for(var i,o,a,s=n.site,c=-1,u=e[i[o-1]],f=u.left===s?u.right:u.left;++c<o;)a=f,f=(u=e[i[c]]).left===s?u.right:u.left,a&&f&&r<a.index&&r<f.index&&Jc(s,a,f)<0&&t.push([s.data,a.data,f.data])}),t},links:function(){return this.edges.filter(function(t){return t.right}).map(function(t){return{source:t.left.data,target:t.right.data}})},find:function(t,e,n){for(var r,i,o=this,a=o._found||0,s=o.cells.length;!(i=o.cells[a]);)if(++a>=s)return null;var c=t-i.site[0],u=e-i.site[1],f=c*c+u*u;do{i=o.cells[r=a],a=null,i.halfedges.forEach(function(n){var r=o.edges[n],s=r.left;if(s!==i.site&&s||(s=r.right)){var c=t-s[0],u=e-s[1],l=c*c+u*u;l<f&&(f=l,a=s.index)}})}while(null!==a);return o._found=r,null==n||f<=n*n?i.site:null}};function Zc(t,e,n){this.k=t,this.x=e,this.y=n}Zc.prototype={constructor:Zc,scale:function(t){return 1===t?this:new Zc(this.k*t,this.x,this.y)},translate:function(t,e){return 0===t&0===e?this:new Zc(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};new Zc(1,0,0);Zc.prototype;n(9);var Kc=n(0),tu=n.n(Kc),eu=n(2),nu=n(1),ru=(n(4),Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t});function iu(t,e,n){var r=this,i=function(){if(t.length>0){var o=t.shift();o&&o.apply(r,[e,i])}else n(e)};i()}function ou(t,e){var n;try{n=JSON.stringify(t)}catch(t){throw new Error("Network request failed. Payload is not serializable: "+t.message)}return ru({body:n,method:"POST"},e,{headers:ru({Accept:"*/*","Content-Type":"application/json"},e.headers||[])})}function au(t){void 0===t&&(t={});var e=t.constructOptions,n=t.customFetch,r=t.uri||"/graphql",i=[],o=[],a=[],s=[],c=function(t){var c,u={},f=Array.isArray(t);return function(t,e){return new Promise(function(n,r){iu(e?o.slice():i.slice(),t,n)})}(f?{requests:t,options:u}:{request:t,options:u},f).then(function(t){return(e||ou)(t.request||t.requests,t.options)}).then(function(t){return u=ru({},t),(n||fetch)(r,u)}).then(function(t){return t.text().then(function(e){try{var n=JSON.parse(e);return t.raw=e,t.parsed=n,t}catch(n){return c=n,t.raw=e,t}})}).then(function(t){return function(t,e){return new Promise(function(n,r){iu(e?s.slice():a.slice(),t,n)})}({response:t,options:u},f)}).then(function(t){var e=t.response;if(e.parsed){if(!f)return ru({},e.parsed);if(Array.isArray(e.parsed))return e.parsed;!function(t){var e=new Error("A batched Operation of responses for ");throw e.response=t,e}(e)}else!function(t,e){var n;throw(n=t&&t.status>=300?new Error("Network request failed with status "+t.status+' - "'+t.statusText+'"'):new Error("Network request failed to return valid JSON")).response=t,n.parseError=e,n}(e,c)})};return c.use=function(t){if("function"!=typeof t)throw new Error("Middleware must be a function");return i.push(t),c},c.useAfter=function(t){if("function"!=typeof t)throw new Error("Afterware must be a function");return a.push(t),c},c.batchUse=function(t){if("function"!=typeof t)throw new Error("Middleware must be a function");return o.push(t),c},c.batchUseAfter=function(t){if("function"!=typeof t)throw new Error("Afterware must be a function");return s.push(t),c},c}n.d(e,"loadurl",function(){return fu}),n.d(e,"onQuartileChange",function(){return hu});let su={},cu={},uu={};function fu(){let t,e,n,r=document.getElementsByClassName("benchmarkingChart"),i=0;for(n of(i=0,r)){let r="https://"+(tu()(n).data("mode")?"dev-openebench":"openebench")+".bsc.es/";e=n.getAttribute("data-id");var o=n.getAttribute("metric_x"),a=n.getAttribute("metric_y");t=(e+i).replace(":","_"),n.id=t;let c=t+"__none",u=t+"__squares",f=t+"__diagonals",l=t+"__clusters";Nt("#"+t).append("div").attr("id","tooltip_container");let h=Nt("#"+t).append("form").append("select").attr("class","classificators_list").attr("id",t+"_dropdown_list").on("change",function(t){let e=document.getElementById(this.options[this.selectedIndex].id.split("__")[0]),n=e.getAttribute("metric_x"),r=e.getAttribute("metric_y");hu(this.options[this.selectedIndex].id,n,r,uu)}).append("optgroup").attr("label","Select a classification method:");if(h.append("option").attr("class","selection_option").attr("id",c).attr("title","Show only raw data").attr("selected","disabled").attr("data-toggle","list_tooltip").attr("data-container","#tooltip_container").text("NO CLASSIFICATION"),h.append("option").attr("class","selection_option").attr("id",u).attr("title","Apply square quartiles classification method (based on the 0.5 quartile of the X and Y metrics)").attr("data-toggle","list_tooltip").attr("data-container","#tooltip_container").text("SQUARE QUARTILES"),h.append("option").attr("class","selection_option").attr("id",f).attr("title","Apply diagonal quartiles classifcation method (based on the assignment of a score to each participant proceeding from its distance to the 'optimal performance' corner)").attr("data-toggle","list_tooltip").attr("data-container","#tooltip_container").text("DIAGONAL QUARTILES"),h.append("option").attr("class","selection_option").attr("id",l).attr("title","Apply K-Means clustering method (group the participants using the K-means clustering algorithm and sort the clusters according to the performance)").attr("data-toggle","list_tooltip").attr("data-container","#tooltip_container").text("K-MEANS CLUSTERING"),lu(r+"sciapi/graphql",'query getDatasets($challenge_id: String!){\n                          getDatasets(datasetFilters:{challenge_id: $challenge_id, type:"assessment"}) {\n                              _id\n                              community_ids\n                              datalink{\n                                  inline_data\n                              }\n                              depends_on{\n                                  tool_id\n                                  metrics_id\n                              }\n                          }\n                        }',e,t,o,a),"true"==n.getAttribute("toTable")){let n=t+"_table";var s=tu()('<br><br><table id="'+n+'" data-id="'+e+'" class="benchmarkingTable"></table>');tu()("#"+t).append(s)}i++}}function lu(t,e,n,r,i,o){try{const a=au({uri:t});a({query:e,variables:{challenge_id:n}}).then(t=>{let e=t.data.getDatasets;if(0==e.length){document.getElementById(r+"_dropdown_list").remove();var s=document.createElement("td");s.id="no_benchmark_data";var c=document.createTextNode("No data available for the selected challenge: "+n);s.appendChild(c),document.getElementById(r).appendChild(s)}else{(()=>a({query:"query getTools($community_id: String!){\n                        getTools(toolFilters:{community_id: $community_id}) {\n                            _id\n                            name\n                        }\n                        getMetrics {\n                          _id\n                          title\n                          representation_hints\n                        }\n                    }",variables:{community_id:e[0].community_ids[0]}}))().then(t=>{let n=t.data.getTools,a=t.data.getMetrics,s={};n.forEach(function(t){s[t._id]=t.name});let c={},u={};a.forEach(function(t){c[t._id]=t.title,null!=t.representation_hints.optimization?u[t._id]=t.representation_hints.optimization:u[t._id]=null}),"minimize"==u[i]||"minimize"==u[o]?uu[r]="bottom-right":uu[r]="top-right",function(t,e,n,r,i,o,a){try{let c={};t.forEach(function(t){let n=e[t.depends_on.tool_id];n in c||(c[n]=new Array(3));let o=parseFloat(t.datalink.inline_data.value);t.depends_on.metrics_id==r?c[n][0]=o:t.depends_on.metrics_id==i&&(c[n][1]=o,void 0!==t.datalink.inline_data.error?c[n][2]=parseFloat(t.datalink.inline_data.error):c[n][2]=0)});let u=[];Object.keys(c).forEach(t=>{let e={};e.toolname=t,e.x=c[t][0],e.y=c[t][1],e.e=c[t][2],u.push(e)}),su[n]=u,cu[n]=o;var s=document.getElementById(n+"_dropdown_list");let f=s.options[s.selectedIndex].id;pu(u,n,f,r,i,o,a)}catch(t){console.log(`Invalid Url Error: ${t.stack} `)}}(e,s,r,i,o,c,uu)})}})}catch(t){console.log(`Invalid Url Error: ${t.stack} `)}}function hu(t,e,n,r){var i=t.split("__")[0];Nt("#svg_"+i).remove();let o=t;pu(su[i],i,o,e,n,cu[i],r)}function du(t,e,n,r,i,o,a,s,c,u,f,l){let h;null!=document.getElementById(c+"_table")&&(document.getElementById(c+"_table").innerHTML="",h=!0),function(t,e,n,r,i){e.append("svg:defs").append("svg:marker").attr("id","opt_triangle").attr("class",function(e){return t+"___better_annotation"}).attr("refX",6).attr("refY",6).attr("markerWidth",30).attr("markerHeight",30).attr("markerUnits","userSpaceOnUse").attr("orient","auto").append("path").attr("d","M 0 0 12 6 0 12 3 6").style("fill","black").style("opacity",.7);let o,a,s,c,u,f=n.domain(),l=r.domain();"bottom-right"==i?(o=f[1]-.05*(f[1]-f[0]),a=l[1]-.9*(l[1]-l[0]),s=f[1]-.009*(f[1]-f[0]),c=l[1]-.97*(l[1]-l[0]),u=0):"top-right"==i&&(o=f[1]-.05*(f[1]-f[0]),a=l[1]-.1*(l[1]-l[0]),s=f[1]-.009*(f[1]-f[0]),c=l[1]-.03*(l[1]-l[0]),u=1);e.append("line").attr("class",function(e){return t+"___better_annotation"}).attr("x1",n(o)).attr("y1",r(a)).attr("x2",n(s)).attr("y2",r(c)).attr("stroke","black").attr("stroke-width",2).attr("marker-end","url(#opt_triangle)").style("opacity",.4);e.append("text").attr("class",function(e){return t+"___better_annotation"}).attr("x",n(f[1])).attr("y",r(l[u])).style("opacity",.4).style("font-size",".7vw").text("better")}(c,e,n,r,l),u==c+"__squares"?(yu(t,e,n,r,i,o,a,s,c,l),function(t,e,n,r,i,o,a,s,c,u){let f=_u(t,o),l=f.map(t=>t.x).sort(function(t,e){return t-e}),h=f.map(t=>t.y).sort(function(t,e){return t-e}),d=b(l,.5),p=b(h,.5),y=n.domain(),g=r.domain(),v=Fr(",");e.append("line").attr("x1",n(d)).attr("y1",r(g[0])).attr("x2",n(d)).attr("y2",r(g[1])).attr("id",function(t){return s+"___x_quartile"}).attr("stroke","#0A58A2").attr("stroke-width",2).style("stroke-dasharray","20, 5").style("opacity",.4).on("mouseover",function(t){i.transition().duration(100).style("opacity",.9),i.html("X quartile = "+v(d)).style("left",_t.pageX+"px").style("top",_t.pageY+"px")}).on("mouseout",function(t){i.transition().duration(1e3).style("opacity",0)}),e.append("line").attr("x1",n(y[0])).attr("y1",r(p)).attr("x2",n(y[1])).attr("y2",r(p)).attr("id",function(t){return s+"___y_quartile"}).attr("stroke","#0A58A2").attr("stroke-width",2).style("stroke-dasharray","20, 5").style("opacity",.4).on("mouseover",function(t){i.transition().duration(100).style("opacity",.9),i.html("Y quartile = "+v(p)).style("left",_t.pageX+"px").style("top",_t.pageY+"px")}).on("mouseout",function(t){i.transition().duration(1500).style("opacity",0)}),1==c&&function(t,e,n,r,i,o,a,s){"bottom-right"==t?e.forEach(function(t){t.x>=n&&t.y<=r?t.quartile=1:t.x>=n&&t.y>r?t.quartile=3:t.x<n&&t.y>r?t.quartile=4:t.x<n&&t.y<=r&&(t.quartile=2)}):"top-right"==t&&e.forEach(function(t){t.x>=n&&t.y<r?t.quartile=3:t.x>=n&&t.y>=r?t.quartile=1:t.x<n&&t.y>=r?t.quartile=2:t.x<n&&t.y<r&&(t.quartile=4)});mu(i,e,a,s),xu(i,o,s)}(a,f,d,p,s,u,t,o)}(t,e,n,r,i,s,l,c,h,f),function(t,e,n,r,i){let o,a,s,c,u=e.domain(),f=n.domain();"bottom-right"==r?(o="1",a="2",s="3",c="4"):"top-right"==r&&(o="3",a="4",s="1",c="2");t.append("text").attr("id",function(t){return i+"___num_bottom_right"}).attr("x",e(u[1]-.05*(u[1]-u[0]))).attr("y",n(f[1]-.97*(f[1]-f[0]))).style("opacity",.4).style("font-size","2vw").style("fill","#0A58A2").text(o),t.append("text").attr("id",function(t){return i+"___num_bottom_left"}).attr("x",e(u[1]-.98*(u[1]-u[0]))).attr("y",n(f[1]-.97*(f[1]-f[0]))).style("opacity",.4).style("font-size","2vw").style("fill","#0A58A2").text(a),t.append("text").attr("id",function(t){return i+"___num_top_right"}).attr("x",e(u[1]-.05*(u[1]-u[0]))).attr("y",n(f[1]-.1*(f[1]-f[0]))).style("opacity",.4).style("font-size","2vw").style("fill","#0A58A2").text(s),t.append("text").attr("id",function(t){return i+"___num_top_left"}).attr("x",e(u[1]-.98*(u[1]-u[0]))).attr("y",n(f[1]-.1*(f[1]-f[0]))).style("opacity",.4).style("font-size","2vw").style("fill","#0A58A2").text(c)}(e,n,r,l,c)):u==c+"__diagonals"?(yu(t,e,n,r,i,o,a,s,c,l),function(t,e,n,r,i,o,a,s,c,u,f,l){let h=_u(t,s),d=h.map(t=>t.x),p=h.map(t=>t.y),y=gu(d,p),[g,v]=[y[0],y[1]],_=Math.max.apply(null,d),m=Math.max.apply(null,p),x=[],w={};for(let t=0;t<g.length;t++)"bottom-right"==c?(x.push(g[t]+(1-v[t])),w[g[t]+(1-v[t])]=[d[t],p[t]],h[t].score=g[t]+(1-v[t])):"top-right"==c&&(x.push(g[t]+v[t]),w[g[t]+v[t]]=[d[t],p[t]],h[t].score=g[t]+v[t]);x.sort(function(t,e){return e-t});let T=b(x,.25),M=b(x,.5),A=b(x,.75),k=0;[vu(x,w,T,c,_,m,e,n,r),vu(x,w,M,c,_,m,e,n,r),vu(x,w,A,c,_,m,e,n,r)].forEach(t=>{let[i,s]=[t[0],t[1]];e.append("line").attr("clip-path","url(#clip)").attr("x1",n(i[0])).attr("y1",r(s[0])).attr("x2",n(i[1])).attr("y2",r(s[1])).attr("id",function(t){return u+"___diag_quartile_"+k}).attr("stroke","#0A58A2").attr("stroke-width",2).style("stroke-dasharray","20, 5").style("opacity",.4),e.append("clipPath").attr("id","clip").append("rect").attr("width",o).attr("height",a),k+=1}),1==f&&function(t,e,n,r,i,o,a,s,c,u,f){let l=[[],[],[],[]];t.forEach(function(t){t.score>e?(t.quartile=1,l[0].push([t.x,t.y])):t.score>n&&t.score<=e?(t.quartile=2,l[1].push([t.x,t.y])):t.score>r&&t.score<=n?(t.quartile=3,l[2].push([t.x,t.y])):t.score<=r&&(t.quartile=4,l[3].push([t.x,t.y]))});let h=1;l.forEach(function(t){var e=function(t){return t.reduce(function(e,n){return[e[0]+n[0]/t.length,e[1]+n[1]/t.length]},[0,0])}(t);o.append("text").attr("class",function(t){return i+"___diag_num"}).attr("x",a(e[0])).attr("y",s(e[1])).style("opacity",.4).style("font-size","2vw").style("fill","#0A58A2").text(h),h++}),mu(i,t,u,f),xu(i,c,f)}(h,T,M,A,u,e,n,r,l,t,s)}(t,e,n,r,0,o,a,s,l,c,h,f)):u==c+"__clusters"?(yu(t,e,n,r,i,o,a,s,c,l),function(t,e,n,r,i,o,a,s,c,u,f,l){let h=_u(t,s),d=h.map(t=>t.x),p=h.map(t=>t.y),y=[];for(let t=0;t<d.length;t++)y.push([d[t],p[t]]);nu.k(4),nu.iterations(500),nu.data(y);let b=nu.clusters(),g=[],v=[];b.forEach(function(t){g.push(t.centroid[0]),v.push(t.centroid[1])});let[_,m]=gu(g,v),x=[];if("top-right"==c)for(let t=0;t<_.length;t++){let e=_[t]+m[t];x.push(e),b[t].score=e}else if("bottom-right"==c)for(let t=0;t<_.length;t++){let e=_[t]+(1-m[t]);x.push(e),b[t].score=e}let w=function(t,e){return t.sort(function(t,n){var r=t[e],i=n[e];return-1*(r<i?-1:r>i?1:0)})}(b,"score");w=function(t,e,n,r,i){let o=1;var a=[];return i.forEach(function(i){var s=[];i.cluster=o,t.append("text").attr("class",function(t){return e+"___cluster_num"}).attr("x",n(i.centroid[0])).attr("y",r(i.centroid[1])).style("opacity",.9).style("font-size","2vw").style("fill","#0A58A2").text(o),i.points.forEach(function(o){s.push([o[0],o[1]]),t.append("line").attr("x1",n(i.centroid[0])).attr("y1",r(i.centroid[1])).attr("x2",n(o[0])).attr("y2",r(o[1])).attr("class",function(t){return e+"___clust_lines"}).attr("stroke","#0A58A2").attr("stroke-width",2).style("stroke-dasharray","20, 5").style("opacity",.4)});var c=ao(s);a.push({points:c}),o++}),t.selectAll("polygon").data(a).enter().append("polygon").attr("points",function(t){if(null!=t.points)return t.points.map(function(t){return[n(t[0]),r(t[1])].join(",")}).join(" ")}).attr("class",function(t){return e+"___clust_polygons"}).attr("fill","#0A58A2").style("opacity",.1),i}(e,u,n,r,w),1==f&&function(t,e,n,r,i,o){t.forEach(function(t){let n=[t.x,t.y];e.forEach(function(e){1==function(t,e){var n=JSON.stringify(e);return t.some(function(t){return JSON.stringify(t)===n})}(e.points,n)&&(t.quartile=e.cluster)})}),mu(n,t,i,o),xu(n,r,o)}(h,w,u,l,t,s)}(t,e,n,r,0,0,0,s,l,c,h,f)):yu(t,e,n,r,i,o,a,s,c,l)}function pu(t,e,n,r,i,o,a){let s={top:20,right:40,bottom:function(t){return t.length%5==0?90+20*Math.trunc(t.length/5):t.lenght%5!=0?90+20*(Math.trunc(t.length/5)+1):void 0}(t),left:60},c=Math.round(.6818*tu()(window).width())-s.left-s.right,u=Math.round(.5787037*tu()(window).height())-s.top-s.bottom,f=ko().range([0,c]).domain([_(t,function(t){return t.x}),g(t,function(t){return t.x})]).nice(),l=_(t,function(t){return t.y}),h=g(t,function(t){return t.y}),d=ko().range([u,0]).domain([l-.3*(h-l),h+.3*(h-l)]).nice(),p=D(f).ticks(12),y=L(d).ticks(12*u/c),b=(Fs().x(function(t){return f(t.x)}).y(function(t){return d(t.y)}),Nt("#"+e).append("div").attr("class","benchmark_tooltip").style("opacity",0)),v=Nt("#"+e).append("svg").attr("class","benchmarkingSVG").attr("viewBox","0 0 "+(c+s.left+s.right)+" "+(u+s.top+s.bottom)).attr("preserveAspectRatio","xMinYMin meet").attr("id","svg_"+e).attr("width",c+s.left+s.right).attr("height",u+s.top+s.bottom).append("g").attr("transform","translate("+s.left+","+s.top+")");v.append("g").append("rect").attr("width",c).attr("height",u).attr("class","plot-bg"),v.append("g").attr("class","axis axis--x").attr("transform","translate(0,"+u+")").call(p),v.append("g").attr("class","axis axis--y").call(y),v.append("text").attr("transform","translate("+c/2+" ,"+(u+s.top+Math.round(.0347*tu()(window).height()))+")").style("text-anchor","middle").style("font-weight","bold").style("font-size",".75vw").text(o[r]),v.append("text").attr("transform","rotate(-90)").attr("y",0-s.left).attr("x",0-u/2).attr("dy","1em").style("text-anchor","middle").style("font-weight","bold").style("font-size",".75vw").text(o[i]),v.append("line").attr("x1",0).attr("y1",u+s.top+Math.round(.0347*tu()(window).height())).attr("x2",Math.round(.02083*tu()(window).width())).attr("y2",u+s.top+Math.round(.0347*tu()(window).height())).attr("stroke","grey").attr("stroke-width",2).style("stroke-dasharray","15, 5").style("opacity",.7),v.append("text").attr("transform","translate("+Math.round(.05208*tu()(window).width())+" ,"+(u+s.top+Math.round(.0347*tu()(window).height())+5)+")").style("text-anchor","middle").style("font-size",".75vw").text("Pareto frontier");var m=D().ticks(12).tickFormat("").tickSize(u).scale(f),x=L().ticks(12*u/c).tickFormat("").tickSize(-c).scale(d);v.append("g").attr("class","bench_grid").call(m),v.append("g").attr("class","bench_grid").call(x);let w=[],T=yo(Cs.concat(Ns).concat(Es));var M={};t.forEach(function(t){M[t.toolname]=T(t.toolname)}),function(t,e,n,r,i,o,a,s,c,u,f){t.append("g").selectAll("line").data(e).enter().append("line").attr("class","error-line").attr("id",function(t){return s+"___line"+t.toolname.replace(/[\. ()/-]/g,"_")}).attr("x1",function(t){return n(t.x)}).attr("y1",function(t){return r(t.y+t.e)}).attr("x2",function(t){return n(t.x)}).attr("y2",function(t){return r(t.y-t.e)}),t.append("g").selectAll("line").data(e).enter().append("line").attr("id",function(t){return s+"___top"+t.toolname.replace(/[\. ()/-]/g,"_")}).attr("class","error-cap").attr("x1",function(t){return n(t.x)-4}).attr("y1",function(t){return r(t.y+t.e)}).attr("x2",function(t){return n(t.x)+4}).attr("y2",function(t){return r(t.y+t.e)}),t.append("g").selectAll("line").data(e).enter().append("line").attr("id",function(t){return s+"___bottom"+t.toolname.replace(/[\. ()/-]/g,"_")}).attr("class","error-cap").attr("x1",function(t){return n(t.x)-4}).attr("y1",function(t){return r(t.y-t.e)}).attr("x2",function(t){return n(t.x)+4}).attr("y2",function(t){return r(t.y-t.e)});let l=Ws(),h=Fr(","),d=Fr(".4f");t.selectAll(".dots").data(e).enter().append("path").attr("class","benchmark_path").attr("d",l.type(function(){return Ys})).attr("id",function(t){return s+"___"+t.toolname.replace(/[\. ()/-]/g,"_")}).attr("class","line").attr("transform",function(t){return"translate("+n(t.x)+","+r(t.y)+")"}).attr("r",6).style("fill",function(t){return a(o(t))}).on("mouseover",function(t){let e=s+"___"+t.toolname.replace(/[\. ()/-]/g,"_");1==Nt("#"+e).style("opacity")&&(i.transition().duration(100).style("opacity",.9),i.html("<b>"+t.toolname+"</b><br/>"+f[c]+": "+h(t.x)+"<br/>"+f[u]+": "+d(t.y)).style("left",_t.pageX+"px").style("top",_t.pageY+"px"))}).on("mouseout",function(t){i.transition().duration(1500).style("opacity",0)})}(v,t,f,d,b,function(t){return t.toolname},T,e,r,i,o),function(t,e,n,r,i,o,a,s,c,u,f,l,h,d){let p=e.selectAll(".legend").data(u).enter().append("g").attr("class","legend").attr("transform",function(t,e){return"translate("+(-o+e%5*Math.round(.113636*tu()(window).width()))+","+(a+Math.round(.0862962*tu()(window).height())+Math.floor(e/5)*Math.round(.0231481*tu()(window).height()))+")"});p.append("rect").attr("x",o+Math.round(.010227*tu()(window).width())).attr("width",Math.round(.010227*tu()(window).width())).attr("height",Math.round(.020833*tu()(window).height())).attr("id",function(t){return l+"___leg_rect"+t.replace(/[\. ()/-]/g,"_")}).attr("class","benchmark_legend_rect").style("fill",c).on("click",function(c){let u=Nt("text#"+l+"___"+c.replace(/[\. ()/-]/g,"_")),f=u._groups[0][0].id;if(t.length-s.length-1>=4){let c=this;bu(f,t,e,n,r,i,o,a,s,l,h,c,d)}else if(t.length-s.length-1<4&&0==Nt("#"+f).style("opacity")){let c=this;bu(f,t,e,n,r,i,o,a,s,l,h,c,d)}else{tu()(".removal_alert").remove();var p=tu()('<div class="removal_alert">                                <span class="closebtn" onclick="(this.parentNode.remove());">&times;</span>                                At least four participants are required for the benchmark!!                              </div>');tu()("#"+l).append(p),setTimeout(function(){tu()(".removal_alert").length>0&&tu()(".removal_alert").remove()},5e3)}}).on("mouseover",function(t){let e=Nt("text#"+l+"___"+t.replace(/[\. ()/-]/g,"_")),n=e._groups[0][0].id,r=n.split("___")[1];0==Nt("#"+n).style("opacity")?(Nt(this).style("opacity",1),Nt("text#"+l+"___"+r).style("opacity",1)):(Nt(this).style("opacity",.2),Nt("text#"+l+"___"+r).style("opacity",.2))}).on("mouseout",function(t){let e=Nt("text#"+l+"___"+t.replace(/[\. ()/-]/g,"_")),n=e._groups[0][0].id,r=n.split("___")[1];0==Nt("#"+n).style("opacity")?(Nt(this).style("opacity",.2),Nt("text#"+l+"___"+r).style("opacity",.2)):(Nt(this).style("opacity",1),Nt("text#"+l+"___"+r).style("opacity",1))}),p.append("text").attr("x",o+Math.round(.022727*tu()(window).width())).attr("y",Math.round(.01041*tu()(window).height())).attr("id",function(t){return l+"___"+t.replace(/[\. ()/-]/g,"_")}).attr("dy",".35em").style("text-anchor","start").style("font-size",".7vw").text(function(t){return t})}(t,v,f,d,b,c,u,w,T,T.domain(),0,e,n,M),du(t,v,f,d,b,c,u,w,e,n,M,a[e])}function yu(t,e,n,r,i,o,a,s,c,u){const f=[];let l;_u(t,s).forEach(function(t){f.push([t.x,t.y])});let h=n.domain(),d=r.domain();"bottom-right"==u?((l=eu.getParetoFrontier(f,{optimize:"bottomRight"})).unshift([l[0][0],d[1]]),l.push([h[0],l[l.length-1][1]])):"top-right"==u&&((l=eu.getParetoFrontier(f,{optimize:"topRight"})).unshift([l[0][0],d[0]]),l.push([h[0],l[l.length-1][1]]));for(var p=0;p<l.length-1;p++)e.append("line").attr("clip-path","url(#clip)").attr("x1",n(l[p][0])).attr("y1",r(l[p][1])).attr("x2",n(l[p+1][0])).attr("y2",r(l[p+1][1])).attr("id",function(t){return c+"___pareto"}).attr("stroke","grey").attr("stroke-width",2).style("stroke-dasharray","20, 5").style("opacity",.4)}function bu(t,e,n,r,i,o,a,s,c,u,f,l,h){let d=t.split("___")[1];if(n.selectAll("#"+u+"___x_quartile").remove(),n.selectAll("#"+u+"___y_quartile").remove(),n.selectAll("#"+u+"___diag_quartile_0").remove(),n.selectAll("#"+u+"___diag_quartile_1").remove(),n.selectAll("#"+u+"___diag_quartile_2").remove(),n.selectAll("#"+u+"___num_bottom_right").remove(),n.selectAll("#"+u+"___num_top_right").remove(),n.selectAll("#"+u+"___num_bottom_left").remove(),n.selectAll("#"+u+"___num_top_left").remove(),n.selectAll("#"+u+"___pareto").remove(),n.selectAll("."+u+"___diag_num").remove(),n.selectAll("."+u+"___cluster_num").remove(),n.selectAll("."+u+"___clust_lines").remove(),n.selectAll("."+u+"___clust_polygons").remove(),n.selectAll("."+u+"___better_annotation").remove(),0==Nt("#"+t).style("opacity")){Nt("#"+t).style("opacity",1),Nt("#"+u+"___top"+d).style("opacity",1),Nt("#"+u+"___bottom"+d).style("opacity",1),Nt("#"+u+"___line"+d).style("opacity",1);let p=tu.a.inArray(d.replace(/_/g,"-"),c);c.splice(p,1),du(e,n,r,i,o,a,s,c,u,f,h,uu[u]),Nt(l).style("opacity",1),Nt("text#"+u+"___"+d).style("opacity",1)}else Nt("#"+t).style("opacity",0),Nt("#"+u+"___top"+d).style("opacity",0),Nt("#"+u+"___bottom"+d).style("opacity",0),Nt("#"+u+"___line"+d).style("opacity",0),c.push(d.replace(/_/g,"-")),du(e,n,r,i,o,a,s,c,u,f,h,uu[u]),Nt(l).style("opacity",.2),Nt("text#"+u+"___"+d).style("opacity",.2)}function gu(t,e){let n=Math.max.apply(null,t),r=Math.max.apply(null,e);return[t.map(function(t){return t/n}),e.map(function(t){return t/r})]}function vu(t,e,n,r,i,o,a,s,c){let u;for(let r=0;r<t.length;r++)if(t[r]<=n){u=[[e[t[r-1]][0],e[t[r-1]][1]],[e[t[r]][0],e[t[r]][1]]];break}let f,l,h=[(u[0][0]+u[1][0])/2,(u[0][1]+u[1][1])/2];return"bottom-right"==r?(f=[h[0]-2*i,h[0]+2*i],l=[h[1]-2*o,h[1]+2*o]):"top-right"==r&&(f=[h[0]+2*i,h[0]-2*i],l=[h[1]-2*o,h[1]+2*o]),[f,l]}function _u(t,e){let n=[];return t.forEach(t=>{-1==tu.a.inArray(t.toolname.replace(/[\. ()/_]/g,"-"),e)&&n.push(t)}),n}function mu(t,e,n,r){var i=document.getElementById(t+"_table"),o=i.insertRow(-1);o.insertCell(0).innerHTML="<b>TOOL</b>",o.insertCell(1).innerHTML="<b>QUARTILE</b>",n.forEach(function(n){var o=i.insertRow(-1);if(o.insertCell(0).innerHTML=n.toolname,-1==tu.a.inArray(n.toolname.replace(/[\. ()/_]/g,"-"),r)){let t=e.find(t=>t.toolname.replace(/[\. ()/_]/g,"-")===n.toolname.replace(/[\. ()/_]/g,"-"));o.insertCell(1).innerHTML=t.quartile}else o.insertCell(1).innerHTML="--";var a=o.cells[0];a.id=t+"___cell"+n.toolname.replace(/[\. ()/-]/g,"_"),a.addEventListener("click",function(e){let n=this.id,r=t+"___leg_rect"+n.split("___cell")[1];document.getElementById(r).dispatchEvent(new Event("click"))}),a.addEventListener("mouseover",function(t){let e=this.id;Nt(this).style("cursor","pointer");e.split("___cell")[1];1==Nt(this).style("opacity")||.5==Nt(this).style("opacity")?(tu()(this).css("opacity",.7),tu()(this).closest("tr").css("opacity",.7)):(tu()(this).css("opacity",1),tu()(this).closest("tr").css("opacity",1))}),a.addEventListener("mouseout",function(e){let n=this.id;Nt(this).style("cursor","default");let r=t+"___leg_rect"+n.split("___cell")[1];.2==Nt("#"+r).style("opacity")||.5==Nt("#"+r).style("opacity")?(tu()(this).css("opacity",.5),tu()(this).closest("tr").css("opacity",.5)):(tu()(this).css("opacity",1),tu()(this).closest("tr").css("opacity",1))})})}function xu(t,e,n){var r=Object.keys(e);tu()("#"+t+"_table td").each(function(){var t=tu()(this).html();1==t?tu()(this).css({background:"#238b45"}):2==t?tu()(this).css({background:"#74c476"}):3==t?tu()(this).css({background:"#bae4b3"}):4==t?tu()(this).css({background:"#edf8e9"}):"--"==t?tu()(this).css({background:"#f0f0f5"}):tu.a.inArray(t,r)>-1&&-1==tu.a.inArray(t.replace(/[\. ()/_]/g,"-"),n)?tu()(this).css({background:"linear-gradient(to left, white 92%, "+e[t]+" 8%)"}):tu.a.inArray(t.replace(/[\. ()/_]/g,"-"),n)>-1?(tu()(this).css({background:"linear-gradient(to left, white 92%, "+e[t]+" 8%)",opacity:.5}),tu()(this).closest("tr").css("opacity",.5)):tu()(this).css({background:"#FFFFFF"})})}fu()},function(t,e){!function(t){"use strict";if(!t.fetch){var e={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(e.arrayBuffer)var n=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(t){return t&&DataView.prototype.isPrototypeOf(t)},i=ArrayBuffer.isView||function(t){return t&&n.indexOf(Object.prototype.toString.call(t))>-1};f.prototype.append=function(t,e){t=s(t),e=c(e);var n=this.map[t];this.map[t]=n?n+","+e:e},f.prototype.delete=function(t){delete this.map[s(t)]},f.prototype.get=function(t){return t=s(t),this.has(t)?this.map[t]:null},f.prototype.has=function(t){return this.map.hasOwnProperty(s(t))},f.prototype.set=function(t,e){this.map[s(t)]=c(e)},f.prototype.forEach=function(t,e){for(var n in this.map)this.map.hasOwnProperty(n)&&t.call(e,this.map[n],n,this)},f.prototype.keys=function(){var t=[];return this.forEach(function(e,n){t.push(n)}),u(t)},f.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),u(t)},f.prototype.entries=function(){var t=[];return this.forEach(function(e,n){t.push([n,e])}),u(t)},e.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var o=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},y.call(b.prototype),y.call(v.prototype),v.prototype.clone=function(){return new v(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},v.error=function(){var t=new v(null,{status:0,statusText:""});return t.type="error",t};var a=[301,302,303,307,308];v.redirect=function(t,e){if(-1===a.indexOf(e))throw new RangeError("Invalid status code");return new v(null,{status:e,headers:{location:t}})},t.Headers=f,t.Request=b,t.Response=v,t.fetch=function(t,n){return new Promise(function(r,i){var o=new b(t,n),a=new XMLHttpRequest;a.onload=function(){var t={status:a.status,statusText:a.statusText,headers:function(t){var e=new f;return t.split(/\r?\n/).forEach(function(t){var n=t.split(":"),r=n.shift().trim();if(r){var i=n.join(":").trim();e.append(r,i)}}),e}(a.getAllResponseHeaders()||"")};t.url="responseURL"in a?a.responseURL:t.headers.get("X-Request-URL");var e="response"in a?a.response:a.responseText;r(new v(e,t))},a.onerror=function(){i(new TypeError("Network request failed"))},a.ontimeout=function(){i(new TypeError("Network request failed"))},a.open(o.method,o.url,!0),"include"===o.credentials&&(a.withCredentials=!0),"responseType"in a&&e.blob&&(a.responseType="blob"),o.headers.forEach(function(t,e){a.setRequestHeader(e,t)}),a.send(void 0===o._bodyInit?null:o._bodyInit)})},t.fetch.polyfill=!0}function s(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function c(t){return"string"!=typeof t&&(t=String(t)),t}function u(t){var n={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return e.iterable&&(n[Symbol.iterator]=function(){return n}),n}function f(t){this.map={},t instanceof f?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function l(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function h(t){return new Promise(function(e,n){t.onload=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function d(t){var e=new FileReader,n=h(e);return e.readAsArrayBuffer(t),n}function p(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(e.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(e.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(e.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(e.arrayBuffer&&e.blob&&r(t))this._bodyArrayBuffer=p(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!e.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!i(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=p(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):e.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},e.blob&&(this.blob=function(){var t=l(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?l(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(d)}),this.text=function(){var t=l(this);if(t)return t;if(this._bodyBlob)return function(t){var e=new FileReader,n=h(e);return e.readAsText(t),n}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),n=new Array(e.length),r=0;r<e.length;r++)n[r]=String.fromCharCode(e[r]);return n.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},e.formData&&(this.formData=function(){return this.text().then(g)}),this.json=function(){return this.text().then(JSON.parse)},this}function b(t,e){var n=(e=e||{}).body;if(t instanceof b){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new f(t.headers)),this.method=t.method,this.mode=t.mode,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new f(e.headers)),this.method=function(t){var e=t.toUpperCase();return o.indexOf(e)>-1?e:t}(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function g(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var n=t.split("="),r=n.shift().replace(/\+/g," "),i=n.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(i))}}),e}function v(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new f(e.headers),this.url=e.url||"",this._initBody(t)}}("undefined"!=typeof self?self:this)},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var i,o=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?t:(i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")})}},function(t,e,n){var r={},i=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),o=function(t){var e={};return function(t){if("function"==typeof t)return t();if(void 0===e[t]){var n=function(t){return document.querySelector(t)}.call(this,t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}}(),a=null,s=0,c=[],u=n(5);function f(t,e){for(var n=0;n<t.length;n++){var i=t[n],o=r[i.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](i.parts[a]);for(;a<i.parts.length;a++)o.parts.push(b(i.parts[a],e))}else{var s=[];for(a=0;a<i.parts.length;a++)s.push(b(i.parts[a],e));r[i.id]={id:i.id,refs:1,parts:s}}}}function l(t,e){for(var n=[],r={},i=0;i<t.length;i++){var o=t[i],a=e.base?o[0]+e.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function h(t,e){var n=o(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),c.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=o(t.insertInto+" "+t.insertAt.before);n.insertBefore(e,i)}}function d(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=c.indexOf(t);e>=0&&c.splice(e,1)}function p(t){var e=document.createElement("style");return void 0===t.attrs.type&&(t.attrs.type="text/css"),y(e,t.attrs),h(t,e),e}function y(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function b(t,e){var n,r,i,o;if(e.transform&&t.css){if(!(o=e.transform(t.css)))return function(){};t.css=o}if(e.singleton){var c=s++;n=a||(a=p(e)),r=v.bind(null,n,c,!1),i=v.bind(null,n,c,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",y(e,t.attrs),h(t,e),e}(e),r=function(t,e,n){var r=n.css,i=n.sourceMap,o=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||o)&&(r=u(r));i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}.bind(null,n,e),i=function(){d(n),n.href&&URL.revokeObjectURL(n.href)}):(n=p(e),r=function(t,e){var n=e.css,r=e.media;r&&t.setAttribute("media",r);if(t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}.bind(null,n),i=function(){d(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else i()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=i()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=l(t,e);return f(n,e),function(t){for(var i=[],o=0;o<n.length;o++){var a=n[o];(s=r[a.id]).refs--,i.push(s)}t&&f(l(t,e),e);for(o=0;o<i.length;o++){var s;if(0===(s=i[o]).refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete r[s.id]}}}};var g=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}();function v(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=g(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=function(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}(r),o=r.sources.map(function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"});return[n].concat(o).concat([i]).join("\n")}return[n].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){(t.exports=n(7)(!1)).push([t.i,'\n  \n  .error-line {\n    stroke:black;\n    stroke-dasharray: 2,2;\n  }\n  \n  .error-cap {\n    stroke:black;\n    stroke-width: 1px;\n  }\n  \n    div.benchmark_tooltip {\n      background-color: #fff;\n      padding: 7px;\n      text-shadow: #f5f5f5 0 1px 0;\n      font: 15px Helvetica Neue;\n      border: 4.5px solid;\n      border-color: #0A58A2;\n      border-radius: 3px;\n      opacity: 0.95;\n      position: absolute;\n      box-shadow: rgba(0, 0, 0, 0.3) 0 10px 15px;\n    }\n  \n  .benchmark_tooltip:after {\n      content: " ";\n      position: absolute;\n      top: 50%;\n      right: 100%;\n      margin-top: -10px;\n      border-width: 10px;\n      border-style: solid;\n      border-color: transparent transparent transparent transparent;\n      \n  }\n  \n   .plot-bg {\n     fill:#F8F8F8;\n     stroke: black;\n   }\n      \n   .axis path,\n   .axis line {\n       fill: none;\n       stroke: grey;\n       stroke-width: 1;\n       shape-rendering: crispEdges;\n   }\n\n   .bench_grid {\n    stroke-opacity: 0.1;\n    stroke-dasharray: 7,5;\n  }\n\n    \n    .classificators_list{\n        background-color: #0A58A2; \n        border-radius: 8px;\n        color: #fff;\n        font-size: 1vw;\n        padding-left: 25px;\n        padding-right: 25px;\n        text-align: center;\n        width: 20vw;\n    \n        }\n    \n    .classificators_list:hover {\n        background-color: #b3cde0;\n    \n    }\n\n    .benchmarkingTable td {\n        border: 2px solid black;\n        border-collapse: collapse;\n        text-align: center;\n        font-size: .7vw;\n    }\n\n    .benchmarkingTable {\n        width: 17vw; \n        border-collapse: collapse; \n        background-color: #f0f0f0;\n        border: 5px solid black; \n        float: right;\n    }\n\n    .benchmark_legend_rect {\n        cursor: pointer;\n    }\n\n    .benchmarkingChart{\n        width: 90vw;\n    }\n\n    .benchmarkingSVG{\n        width: 68vw;\n    }\n      .axis--x {\n          font-size: 12px;\n      }\n\n      .axis--y {\n        font-size: 12px;\n    }\n\n    .removal_alert {\n        padding: 10px;\n        background-color: #ffcccc;\n        color: #D10000;\n    }\n    \n    .closebtn {\n        margin-left: 15px;\n        color: #D10000;\n        font-weight: bold;\n        float: right;\n        font-size: 22px;\n        line-height: 20px;\n        cursor: pointer;\n        transition: 0.3s;\n    }\n    \n    .closebtn:hover {\n        color: white;\n    }',""])},function(t,e,n){var r=n(8);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(6)(r,i);r.locals&&(t.exports=r.locals)}]));

/***/ }),

/***/ "./src/app/scientific/shared/benchmarkingTable.js":
/*!********************************************************!*\
  !*** ./src/app/scientific/shared/benchmarkingTable.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

!function(e,t){for(var n in t)e[n]=t[n]}(this,function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=8)}([function(e,t,n){var r;
    /*!
     * jQuery JavaScript Library v3.4.1
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2019-05-01T21:04Z
     */
    /*!
     * jQuery JavaScript Library v3.4.1
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2019-05-01T21:04Z
     */
    !function(t,n){"use strict";"object"==typeof e.exports?e.exports=t.document?n(t,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return n(e)}:n(t)}("undefined"!=typeof window?window:this,function(n,o){"use strict";var i=[],a=n.document,s=Object.getPrototypeOf,u=i.slice,l=i.concat,c=i.push,f=i.indexOf,p={},d=p.toString,h=p.hasOwnProperty,y=h.toString,m=y.call(Object),g={},v=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},b=function(e){return null!=e&&e===e.window},x={type:!0,src:!0,nonce:!0,noModule:!0};function w(e,t,n){var r,o,i=(n=n||a).createElement("script");if(i.text=e,t)for(r in x)(o=t[r]||t.getAttribute&&t.getAttribute(r))&&i.setAttribute(r,o);n.head.appendChild(i).parentNode.removeChild(i)}function T(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?p[d.call(e)]||"object":typeof e}var E=function(e,t){return new E.fn.init(e,t)},C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;function A(e){var t=!!e&&"length"in e&&e.length,n=T(e);return!v(e)&&!b(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}E.fn=E.prototype={jquery:"3.4.1",constructor:E,length:0,toArray:function(){return u.call(this)},get:function(e){return null==e?u.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=E.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return E.each(this,e)},map:function(e){return this.pushStack(E.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(u.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:c,sort:i.sort,splice:i.splice},E.extend=E.fn.extend=function(){var e,t,n,r,o,i,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||v(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(E.isPlainObject(r)||(o=Array.isArray(r)))?(n=a[t],i=o&&!Array.isArray(n)?[]:o||E.isPlainObject(n)?n:{},o=!1,a[t]=E.extend(l,i,r)):void 0!==r&&(a[t]=r));return a},E.extend({expando:"jQuery"+("3.4.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==d.call(e))&&(!(t=s(e))||"function"==typeof(n=h.call(t,"constructor")&&t.constructor)&&y.call(n)===m)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t){w(e,{nonce:t&&t.nonce})},each:function(e,t){var n,r=0;if(A(e))for(n=e.length;r<n&&!1!==t.call(e[r],r,e[r]);r++);else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(A(Object(e))?E.merge(n,"string"==typeof e?[e]:e):c.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:f.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,o=e.length;r<n;r++)e[o++]=t[r];return e.length=o,e},grep:function(e,t,n){for(var r=[],o=0,i=e.length,a=!n;o<i;o++)!t(e[o],o)!==a&&r.push(e[o]);return r},map:function(e,t,n){var r,o,i=0,a=[];if(A(e))for(r=e.length;i<r;i++)null!=(o=t(e[i],i,n))&&a.push(o);else for(i in e)null!=(o=t(e[i],i,n))&&a.push(o);return l.apply([],a)},guid:1,support:g}),"function"==typeof Symbol&&(E.fn[Symbol.iterator]=i[Symbol.iterator]),E.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){p["[object "+t+"]"]=t.toLowerCase()});var S=
    /*!
     * Sizzle CSS Selector Engine v2.3.4
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://js.foundation/
     *
     * Date: 2019-04-08
     */
    function(e){var t,n,r,o,i,a,s,u,l,c,f,p,d,h,y,m,g,v,b,x="sizzle"+1*new Date,w=e.document,T=0,E=0,C=ue(),A=ue(),S=ue(),k=ue(),j=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,D=[],L=D.pop,O=D.push,q=D.push,_=D.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",H="[\\x20\\t\\r\\n\\f]",B="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+H+"*("+B+")(?:"+H+"*([*^$|!~]?=)"+H+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+B+"))|)"+H+"*\\]",M=":("+B+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",U=new RegExp(H+"+","g"),F=new RegExp("^"+H+"+|((?:^|[^\\\\])(?:\\\\.)*)"+H+"+$","g"),$=new RegExp("^"+H+"*,"+H+"*"),W=new RegExp("^"+H+"*([>+~]|"+H+")"+H+"*"),z=new RegExp(H+"|>"),X=new RegExp(M),G=new RegExp("^"+B+"$"),V={ID:new RegExp("^#("+B+")"),CLASS:new RegExp("^\\.("+B+")"),TAG:new RegExp("^("+B+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+M),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+H+"*(even|odd|(([+-]|)(\\d*)n|)"+H+"*(?:([+-]|)"+H+"*(\\d+)|))"+H+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+H+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+H+"*((?:-\\d)?\\d*)"+H+"*\\)|)(?=[^-]|$)","i")},J=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\([\\da-f]{1,6}"+H+"?|("+H+")|.)","ig"),ne=function(e,t,n){var r="0x"+t-65536;return r!=r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,oe=function(e,t){return t?"\0"===e?"�":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},ie=function(){p()},ae=xe(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{q.apply(D=_.call(w.childNodes),w.childNodes),D[w.childNodes.length].nodeType}catch(e){q={apply:D.length?function(e,t){O.apply(e,_.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}function se(e,t,r,o){var i,s,l,c,f,h,g,v=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!o&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,y)){if(11!==T&&(f=Z.exec(e)))if(i=f[1]){if(9===T){if(!(l=t.getElementById(i)))return r;if(l.id===i)return r.push(l),r}else if(v&&(l=v.getElementById(i))&&b(t,l)&&l.id===i)return r.push(l),r}else{if(f[2])return q.apply(r,t.getElementsByTagName(e)),r;if((i=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return q.apply(r,t.getElementsByClassName(i)),r}if(n.qsa&&!k[e+" "]&&(!m||!m.test(e))&&(1!==T||"object"!==t.nodeName.toLowerCase())){if(g=e,v=t,1===T&&z.test(e)){for((c=t.getAttribute("id"))?c=c.replace(re,oe):t.setAttribute("id",c=x),s=(h=a(e)).length;s--;)h[s]="#"+c+" "+be(h[s]);g=h.join(","),v=ee.test(e)&&ge(t.parentNode)||t}try{return q.apply(r,v.querySelectorAll(g)),r}catch(t){k(e,!0)}finally{c===x&&t.removeAttribute("id")}}}return u(e.replace(F,"$1"),t,r,o)}function ue(){var e=[];return function t(n,o){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=o}}function le(e){return e[x]=!0,e}function ce(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){for(var n=e.split("|"),o=n.length;o--;)r.attrHandle[n[o]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function de(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function he(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ye(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ae(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function me(e){return le(function(t){return t=+t,le(function(n,r){for(var o,i=e([],n.length,t),a=i.length;a--;)n[o=i[a]]&&(n[o]=!(r[o]=n[o]))})})}function ge(e){return e&&void 0!==e.getElementsByTagName&&e}for(t in n=se.support={},i=se.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!J.test(t||n&&n.nodeName||"HTML")},p=se.setDocument=function(e){var t,o,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(h=(d=a).documentElement,y=!i(d),w!==d&&(o=d.defaultView)&&o.top!==o&&(o.addEventListener?o.addEventListener("unload",ie,!1):o.attachEvent&&o.attachEvent("onunload",ie)),n.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ce(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=K.test(d.getElementsByClassName),n.getById=ce(function(e){return h.appendChild(e).id=x,!d.getElementsByName||!d.getElementsByName(x).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&y){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&y){var n,r,o,i=t.getElementById(e);if(i){if((n=i.getAttributeNode("id"))&&n.value===e)return[i];for(o=t.getElementsByName(e),r=0;i=o[r++];)if((n=i.getAttributeNode("id"))&&n.value===e)return[i]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],o=0,i=t.getElementsByTagName(e);if("*"===e){for(;n=i[o++];)1===n.nodeType&&r.push(n);return r}return i},r.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&y)return t.getElementsByClassName(e)},g=[],m=[],(n.qsa=K.test(d.querySelectorAll))&&(ce(function(e){h.appendChild(e).innerHTML="<a id='"+x+"'></a><select id='"+x+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+H+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||m.push("\\["+H+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+x+"-]").length||m.push("~="),e.querySelectorAll(":checked").length||m.push(":checked"),e.querySelectorAll("a#"+x+"+*").length||m.push(".#.+[+~]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&m.push("name"+H+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),m.push(",.*:")})),(n.matchesSelector=K.test(v=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ce(function(e){n.disconnectedMatch=v.call(e,"*"),v.call(e,"[s!='']:x"),g.push("!=",M)}),m=m.length&&new RegExp(m.join("|")),g=g.length&&new RegExp(g.join("|")),t=K.test(h.compareDocumentPosition),b=t||K.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},j=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&b(w,e)?-1:t===d||t.ownerDocument===w&&b(w,t)?1:c?P(c,e)-P(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,o=e.parentNode,i=t.parentNode,a=[e],s=[t];if(!o||!i)return e===d?-1:t===d?1:o?-1:i?1:c?P(c,e)-P(c,t):0;if(o===i)return pe(e,t);for(n=e;n=n.parentNode;)a.unshift(n);for(n=t;n=n.parentNode;)s.unshift(n);for(;a[r]===s[r];)r++;return r?pe(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),n.matchesSelector&&y&&!k[t+" "]&&(!g||!g.test(t))&&(!m||!m.test(t)))try{var r=v.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){k(t,!0)}return se(t,d,null,[e]).length>0},se.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),b(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var o=r.attrHandle[t.toLowerCase()],i=o&&N.call(r.attrHandle,t.toLowerCase())?o(e,t,!y):void 0;return void 0!==i?i:n.attributes||!y?e.getAttribute(t):(i=e.getAttributeNode(t))&&i.specified?i.value:null},se.escape=function(e){return(e+"").replace(re,oe)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,r=[],o=0,i=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(j),f){for(;t=e[i++];)t===e[i]&&(o=r.push(i));for(;o--;)e.splice(r[o],1)}return c=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=o(t);return n},(r=se.selectors={cacheLength:50,createPseudo:le,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=new RegExp("(^|"+H+")"+e+"("+H+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var o=se.attr(r,e);return null==o?"!="===t:!t||(o+="","="===t?o===n:"!="===t?o!==n:"^="===t?n&&0===o.indexOf(n):"*="===t?n&&o.indexOf(n)>-1:"$="===t?n&&o.slice(-n.length)===n:"~="===t?(" "+o.replace(U," ")+" ").indexOf(n)>-1:"|="===t&&(o===n||o.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,o){var i="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===o?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,y=i!==a?"nextSibling":"previousSibling",m=t.parentNode,g=s&&t.nodeName.toLowerCase(),v=!u&&!s,b=!1;if(m){if(i){for(;y;){for(p=t;p=p[y];)if(s?p.nodeName.toLowerCase()===g:1===p.nodeType)return!1;h=y="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){for(b=(d=(l=(c=(f=(p=m)[x]||(p[x]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&m.childNodes[d];p=++d&&p&&p[y]||(b=d=0)||h.pop();)if(1===p.nodeType&&++b&&p===t){c[e]=[T,d,b];break}}else if(v&&(b=d=(l=(c=(f=(p=t)[x]||(p[x]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===b)for(;(p=++d&&p&&p[y]||(b=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==g:1!==p.nodeType)||!++b||(v&&((c=(f=p[x]||(p[x]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,b]),p!==t)););return(b-=o)===r||b%r==0&&b/r>=0}}},PSEUDO:function(e,t){var n,o=r.pseudos[e]||r.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return o[x]?o(t):o.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,n){for(var r,i=o(e,t),a=i.length;a--;)e[r=P(e,i[a])]=!(n[r]=i[a])}):function(e){return o(e,0,n)}):o}},pseudos:{not:le(function(e){var t=[],n=[],r=s(e.replace(F,"$1"));return r[x]?le(function(e,t,n,o){for(var i,a=r(e,null,o,[]),s=e.length;s--;)(i=a[s])&&(e[s]=!(t[s]=i))}):function(e,o,i){return t[0]=e,r(t,null,i,n),t[0]=null,!n.pop()}}),has:le(function(e){return function(t){return se(e,t).length>0}}),contains:le(function(e){return e=e.replace(te,ne),function(t){return(t.textContent||o(t)).indexOf(e)>-1}}),lang:le(function(e){return G.test(e||"")||se.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=y?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ye(!1),disabled:ye(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:me(function(){return[0]}),last:me(function(e,t){return[t-1]}),eq:me(function(e,t,n){return[n<0?n+t:n]}),even:me(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:me(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:me(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:me(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=de(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=he(t);function ve(){}function be(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function xe(e,t,n){var r=t.dir,o=t.next,i=o||r,a=n&&"parentNode"===i,s=E++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||a)return e(t,n,o);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){for(;t=t[r];)if((1===t.nodeType||a)&&e(t,n,u))return!0}else for(;t=t[r];)if(1===t.nodeType||a)if(c=(f=t[x]||(t[x]={}))[t.uniqueID]||(f[t.uniqueID]={}),o&&o===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[i])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[i]=p,p[2]=e(t,n,u))return!0}return!1}}function we(e){return e.length>1?function(t,n,r){for(var o=e.length;o--;)if(!e[o](t,n,r))return!1;return!0}:e[0]}function Te(e,t,n,r,o){for(var i,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(i=e[s])&&(n&&!n(i,r,o)||(a.push(i),l&&t.push(s)));return a}function Ee(e,t,n,r,o,i){return r&&!r[x]&&(r=Ee(r)),o&&!o[x]&&(o=Ee(o,i)),le(function(i,a,s,u){var l,c,f,p=[],d=[],h=a.length,y=i||function(e,t,n){for(var r=0,o=t.length;r<o;r++)se(e,t[r],n);return n}(t||"*",s.nodeType?[s]:s,[]),m=!e||!i&&t?y:Te(y,p,e,s,u),g=n?o||(i?e:h||r)?[]:a:m;if(n&&n(m,g,s,u),r)for(l=Te(g,d),r(l,[],s,u),c=l.length;c--;)(f=l[c])&&(g[d[c]]=!(m[d[c]]=f));if(i){if(o||e){if(o){for(l=[],c=g.length;c--;)(f=g[c])&&l.push(m[c]=f);o(null,g=[],l,u)}for(c=g.length;c--;)(f=g[c])&&(l=o?P(i,f):p[c])>-1&&(i[l]=!(a[l]=f))}}else g=Te(g===a?g.splice(h,g.length):g),o?o(null,a,g,u):q.apply(a,g)})}function Ce(e){for(var t,n,o,i=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=xe(function(e){return e===t},s,!0),f=xe(function(e){return P(t,e)>-1},s,!0),p=[function(e,n,r){var o=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,o}];u<i;u++)if(n=r.relative[e[u].type])p=[xe(we(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[x]){for(o=++u;o<i&&!r.relative[e[o].type];o++);return Ee(u>1&&we(p),u>1&&be(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(F,"$1"),n,u<o&&Ce(e.slice(u,o)),o<i&&Ce(e=e.slice(o)),o<i&&be(e))}p.push(n)}return we(p)}return ve.prototype=r.filters=r.pseudos,r.setFilters=new ve,a=se.tokenize=function(e,t){var n,o,i,a,s,u,l,c=A[e+" "];if(c)return t?0:c.slice(0);for(s=e,u=[],l=r.preFilter;s;){for(a in n&&!(o=$.exec(s))||(o&&(s=s.slice(o[0].length)||s),u.push(i=[])),n=!1,(o=W.exec(s))&&(n=o.shift(),i.push({value:n,type:o[0].replace(F," ")}),s=s.slice(n.length)),r.filter)!(o=V[a].exec(s))||l[a]&&!(o=l[a](o))||(n=o.shift(),i.push({value:n,type:a,matches:o}),s=s.slice(n.length));if(!n)break}return t?s.length:s?se.error(e):A(e,u).slice(0)},s=se.compile=function(e,t){var n,o=[],i=[],s=S[e+" "];if(!s){for(t||(t=a(e)),n=t.length;n--;)(s=Ce(t[n]))[x]?o.push(s):i.push(s);(s=S(e,function(e,t){var n=t.length>0,o=e.length>0,i=function(i,a,s,u,c){var f,h,m,g=0,v="0",b=i&&[],x=[],w=l,E=i||o&&r.find.TAG("*",c),C=T+=null==w?1:Math.random()||.1,A=E.length;for(c&&(l=a===d||a||c);v!==A&&null!=(f=E[v]);v++){if(o&&f){for(h=0,a||f.ownerDocument===d||(p(f),s=!y);m=e[h++];)if(m(f,a||d,s)){u.push(f);break}c&&(T=C)}n&&((f=!m&&f)&&g--,i&&b.push(f))}if(g+=v,n&&v!==g){for(h=0;m=t[h++];)m(b,x,a,s);if(i){if(g>0)for(;v--;)b[v]||x[v]||(x[v]=L.call(u));x=Te(x)}q.apply(u,x),c&&!i&&x.length>0&&g+t.length>1&&se.uniqueSort(u)}return c&&(T=C,l=w),b};return n?le(i):i}(i,o))).selector=e}return s},u=se.select=function(e,t,n,o){var i,u,l,c,f,p="function"==typeof e&&e,d=!o&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&y&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(te,ne),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}for(i=V.needsContext.test(e)?0:u.length;i--&&(l=u[i],!r.relative[c=l.type]);)if((f=r.find[c])&&(o=f(l.matches[0].replace(te,ne),ee.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(i,1),!(e=o.length&&be(u)))return q.apply(n,o),n;break}}return(p||s(e,d))(o,t,!y,n,!t||ee.test(e)&&ge(t.parentNode)||t),n},n.sortStable=x.split("").sort(j).join("")===x,n.detectDuplicates=!!f,p(),n.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(n);E.find=S,E.expr=S.selectors,E.expr[":"]=E.expr.pseudos,E.uniqueSort=E.unique=S.uniqueSort,E.text=S.getText,E.isXMLDoc=S.isXML,E.contains=S.contains,E.escapeSelector=S.escape;var k=function(e,t,n){for(var r=[],o=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(o&&E(e).is(n))break;r.push(e)}return r},j=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},N=E.expr.match.needsContext;function D(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var L=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function O(e,t,n){return v(t)?E.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?E.grep(e,function(e){return e===t!==n}):"string"!=typeof t?E.grep(e,function(e){return f.call(t,e)>-1!==n}):E.filter(t,e,n)}E.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?E.find.matchesSelector(r,e)?[r]:[]:E.find.matches(e,E.grep(t,function(e){return 1===e.nodeType}))},E.fn.extend({find:function(e){var t,n,r=this.length,o=this;if("string"!=typeof e)return this.pushStack(E(e).filter(function(){for(t=0;t<r;t++)if(E.contains(o[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)E.find(e,o[t],n);return r>1?E.uniqueSort(n):n},filter:function(e){return this.pushStack(O(this,e||[],!1))},not:function(e){return this.pushStack(O(this,e||[],!0))},is:function(e){return!!O(this,"string"==typeof e&&N.test(e)?E(e):e||[],!1).length}});var q,_=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(E.fn.init=function(e,t,n){var r,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:_.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof E?t[0]:t,E.merge(this,E.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:a,!0)),L.test(r[1])&&E.isPlainObject(t))for(r in t)v(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(o=a.getElementById(r[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):v(e)?void 0!==n.ready?n.ready(e):e(E):E.makeArray(e,this)}).prototype=E.fn,q=E(a);var P=/^(?:parents|prev(?:Until|All))/,R={children:!0,contents:!0,next:!0,prev:!0};function H(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}E.fn.extend({has:function(e){var t=E(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(E.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,o=this.length,i=[],a="string"!=typeof e&&E(e);if(!N.test(e))for(;r<o;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&E.find.matchesSelector(n,e))){i.push(n);break}return this.pushStack(i.length>1?E.uniqueSort(i):i)},index:function(e){return e?"string"==typeof e?f.call(E(e),this[0]):f.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(E.uniqueSort(E.merge(this.get(),E(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),E.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return H(e,"nextSibling")},prev:function(e){return H(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return j((e.parentNode||{}).firstChild,e)},children:function(e){return j(e.firstChild)},contents:function(e){return void 0!==e.contentDocument?e.contentDocument:(D(e,"template")&&(e=e.content||e),E.merge([],e.childNodes))}},function(e,t){E.fn[e]=function(n,r){var o=E.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(o=E.filter(r,o)),this.length>1&&(R[e]||E.uniqueSort(o),P.test(e)&&o.reverse()),this.pushStack(o)}});var B=/[^\x20\t\r\n\f]+/g;function I(e){return e}function M(e){throw e}function U(e,t,n,r){var o;try{e&&v(o=e.promise)?o.call(e).done(t).fail(n):e&&v(o=e.then)?o.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}E.Callbacks=function(e){e="string"==typeof e?function(e){var t={};return E.each(e.match(B)||[],function(e,n){t[n]=!0}),t}(e):E.extend({},e);var t,n,r,o,i=[],a=[],s=-1,u=function(){for(o=o||e.once,r=t=!0;a.length;s=-1)for(n=a.shift();++s<i.length;)!1===i[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=i.length,n=!1);e.memory||(n=!1),t=!1,o&&(i=n?[]:"")},l={add:function(){return i&&(n&&!t&&(s=i.length-1,a.push(n)),function t(n){E.each(n,function(n,r){v(r)?e.unique&&l.has(r)||i.push(r):r&&r.length&&"string"!==T(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return E.each(arguments,function(e,t){for(var n;(n=E.inArray(t,i,n))>-1;)i.splice(n,1),n<=s&&s--}),this},has:function(e){return e?E.inArray(e,i)>-1:i.length>0},empty:function(){return i&&(i=[]),this},disable:function(){return o=a=[],i=n="",this},disabled:function(){return!i},lock:function(){return o=a=[],n||t||(i=n=""),this},locked:function(){return!!o},fireWith:function(e,n){return o||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l},E.extend({Deferred:function(e){var t=[["notify","progress",E.Callbacks("memory"),E.Callbacks("memory"),2],["resolve","done",E.Callbacks("once memory"),E.Callbacks("once memory"),0,"resolved"],["reject","fail",E.Callbacks("once memory"),E.Callbacks("once memory"),1,"rejected"]],r="pending",o={state:function(){return r},always:function(){return i.done(arguments).fail(arguments),this},catch:function(e){return o.then(null,e)},pipe:function(){var e=arguments;return E.Deferred(function(n){E.each(t,function(t,r){var o=v(e[r[4]])&&e[r[4]];i[r[1]](function(){var e=o&&o.apply(this,arguments);e&&v(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[r[0]+"With"](this,o?[e]:arguments)})}),e=null}).promise()},then:function(e,r,o){var i=0;function a(e,t,r,o){return function(){var s=this,u=arguments,l=function(){var n,l;if(!(e<i)){if((n=r.apply(s,u))===t.promise())throw new TypeError("Thenable self-resolution");l=n&&("object"==typeof n||"function"==typeof n)&&n.then,v(l)?o?l.call(n,a(i,t,I,o),a(i,t,M,o)):(i++,l.call(n,a(i,t,I,o),a(i,t,M,o),a(i,t,I,t.notifyWith))):(r!==I&&(s=void 0,u=[n]),(o||t.resolveWith)(s,u))}},c=o?l:function(){try{l()}catch(n){E.Deferred.exceptionHook&&E.Deferred.exceptionHook(n,c.stackTrace),e+1>=i&&(r!==M&&(s=void 0,u=[n]),t.rejectWith(s,u))}};e?c():(E.Deferred.getStackHook&&(c.stackTrace=E.Deferred.getStackHook()),n.setTimeout(c))}}return E.Deferred(function(n){t[0][3].add(a(0,n,v(o)?o:I,n.notifyWith)),t[1][3].add(a(0,n,v(e)?e:I)),t[2][3].add(a(0,n,v(r)?r:M))}).promise()},promise:function(e){return null!=e?E.extend(e,o):o}},i={};return E.each(t,function(e,n){var a=n[2],s=n[5];o[n[1]]=a.add,s&&a.add(function(){r=s},t[3-e][2].disable,t[3-e][3].disable,t[0][2].lock,t[0][3].lock),a.add(n[3].fire),i[n[0]]=function(){return i[n[0]+"With"](this===i?void 0:this,arguments),this},i[n[0]+"With"]=a.fireWith}),o.promise(i),e&&e.call(i,i),i},when:function(e){var t=arguments.length,n=t,r=Array(n),o=u.call(arguments),i=E.Deferred(),a=function(e){return function(n){r[e]=this,o[e]=arguments.length>1?u.call(arguments):n,--t||i.resolveWith(r,o)}};if(t<=1&&(U(e,i.done(a(n)).resolve,i.reject,!t),"pending"===i.state()||v(o[n]&&o[n].then)))return i.then();for(;n--;)U(o[n],a(n),i.reject);return i.promise()}});var F=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;E.Deferred.exceptionHook=function(e,t){n.console&&n.console.warn&&e&&F.test(e.name)&&n.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},E.readyException=function(e){n.setTimeout(function(){throw e})};var $=E.Deferred();function W(){a.removeEventListener("DOMContentLoaded",W),n.removeEventListener("load",W),E.ready()}E.fn.ready=function(e){return $.then(e).catch(function(e){E.readyException(e)}),this},E.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--E.readyWait:E.isReady)||(E.isReady=!0,!0!==e&&--E.readyWait>0||$.resolveWith(a,[E]))}}),E.ready.then=$.then,"complete"===a.readyState||"loading"!==a.readyState&&!a.documentElement.doScroll?n.setTimeout(E.ready):(a.addEventListener("DOMContentLoaded",W),n.addEventListener("load",W));var z=function(e,t,n,r,o,i,a){var s=0,u=e.length,l=null==n;if("object"===T(n))for(s in o=!0,n)z(e,t,s,n[s],!0,i,a);else if(void 0!==r&&(o=!0,v(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(E(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return o?e:l?t.call(e):u?t(e[0],n):i},X=/^-ms-/,G=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function J(e){return e.replace(X,"ms-").replace(G,V)}var Q=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Y(){this.expando=E.expando+Y.uid++}Y.uid=1,Y.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Q(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,o=this.cache(e);if("string"==typeof t)o[J(t)]=n;else for(r in t)o[J(r)]=t[r];return o},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][J(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(J):(t=J(t))in r?[t]:t.match(B)||[]).length;for(;n--;)delete r[t[n]]}(void 0===t||E.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!E.isEmptyObject(t)}};var K=new Y,Z=new Y,ee=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,te=/[A-Z]/g;function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(te,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=function(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:ee.test(e)?JSON.parse(e):e)}(n)}catch(e){}Z.set(e,t,n)}else n=void 0;return n}E.extend({hasData:function(e){return Z.hasData(e)||K.hasData(e)},data:function(e,t,n){return Z.access(e,t,n)},removeData:function(e,t){Z.remove(e,t)},_data:function(e,t,n){return K.access(e,t,n)},_removeData:function(e,t){K.remove(e,t)}}),E.fn.extend({data:function(e,t){var n,r,o,i=this[0],a=i&&i.attributes;if(void 0===e){if(this.length&&(o=Z.get(i),1===i.nodeType&&!K.get(i,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=J(r.slice(5)),ne(i,r,o[r]));K.set(i,"hasDataAttrs",!0)}return o}return"object"==typeof e?this.each(function(){Z.set(this,e)}):z(this,function(t){var n;if(i&&void 0===t)return void 0!==(n=Z.get(i,e))?n:void 0!==(n=ne(i,e))?n:void 0;this.each(function(){Z.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){Z.remove(this,e)})}}),E.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=K.get(e,t),n&&(!r||Array.isArray(n)?r=K.access(e,t,E.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=E.queue(e,t),r=n.length,o=n.shift(),i=E._queueHooks(e,t);"inprogress"===o&&(o=n.shift(),r--),o&&("fx"===t&&n.unshift("inprogress"),delete i.stop,o.call(e,function(){E.dequeue(e,t)},i)),!r&&i&&i.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return K.get(e,n)||K.access(e,n,{empty:E.Callbacks("once memory").add(function(){K.remove(e,[t+"queue",n])})})}}),E.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?E.queue(this[0],e):void 0===t?this:this.each(function(){var n=E.queue(this,e,t);E._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&E.dequeue(this,e)})},dequeue:function(e){return this.each(function(){E.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,o=E.Deferred(),i=this,a=this.length,s=function(){--r||o.resolveWith(i,[i])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(n=K.get(i[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),o.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,oe=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),ie=["Top","Right","Bottom","Left"],ae=a.documentElement,se=function(e){return E.contains(e.ownerDocument,e)},ue={composed:!0};ae.getRootNode&&(se=function(e){return E.contains(e.ownerDocument,e)||e.getRootNode(ue)===e.ownerDocument});var le=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&se(e)&&"none"===E.css(e,"display")},ce=function(e,t,n,r){var o,i,a={};for(i in t)a[i]=e.style[i],e.style[i]=t[i];for(i in o=n.apply(e,r||[]),t)e.style[i]=a[i];return o};function fe(e,t,n,r){var o,i,a=20,s=r?function(){return r.cur()}:function(){return E.css(e,t,"")},u=s(),l=n&&n[3]||(E.cssNumber[t]?"":"px"),c=e.nodeType&&(E.cssNumber[t]||"px"!==l&&+u)&&oe.exec(E.css(e,t));if(c&&c[3]!==l){for(u/=2,l=l||c[3],c=+u||1;a--;)E.style(e,t,c+l),(1-i)*(1-(i=s()/u||.5))<=0&&(a=0),c/=i;c*=2,E.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,o=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=o)),o}var pe={};function de(e){var t,n=e.ownerDocument,r=e.nodeName,o=pe[r];return o||(t=n.body.appendChild(n.createElement(r)),o=E.css(t,"display"),t.parentNode.removeChild(t),"none"===o&&(o="block"),pe[r]=o,o)}function he(e,t){for(var n,r,o=[],i=0,a=e.length;i<a;i++)(r=e[i]).style&&(n=r.style.display,t?("none"===n&&(o[i]=K.get(r,"display")||null,o[i]||(r.style.display="")),""===r.style.display&&le(r)&&(o[i]=de(r))):"none"!==n&&(o[i]="none",K.set(r,"display",n)));for(i=0;i<a;i++)null!=o[i]&&(e[i].style.display=o[i]);return e}E.fn.extend({show:function(){return he(this,!0)},hide:function(){return he(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){le(this)?E(this).show():E(this).hide()})}});var ye=/^(?:checkbox|radio)$/i,me=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,ge=/^$|^module$|\/(?:java|ecma)script/i,ve={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function be(e,t){var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&D(e,t)?E.merge([e],n):n}function xe(e,t){for(var n=0,r=e.length;n<r;n++)K.set(e[n],"globalEval",!t||K.get(t[n],"globalEval"))}ve.optgroup=ve.option,ve.tbody=ve.tfoot=ve.colgroup=ve.caption=ve.thead,ve.th=ve.td;var we,Te,Ee=/<|&#?\w+;/;function Ce(e,t,n,r,o){for(var i,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((i=e[d])||0===i)if("object"===T(i))E.merge(p,i.nodeType?[i]:i);else if(Ee.test(i)){for(a=a||f.appendChild(t.createElement("div")),s=(me.exec(i)||["",""])[1].toLowerCase(),u=ve[s]||ve._default,a.innerHTML=u[1]+E.htmlPrefilter(i)+u[2],c=u[0];c--;)a=a.lastChild;E.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(i));for(f.textContent="",d=0;i=p[d++];)if(r&&E.inArray(i,r)>-1)o&&o.push(i);else if(l=se(i),a=be(f.appendChild(i),"script"),l&&xe(a),n)for(c=0;i=a[c++];)ge.test(i.type||"")&&n.push(i);return f}we=a.createDocumentFragment().appendChild(a.createElement("div")),(Te=a.createElement("input")).setAttribute("type","radio"),Te.setAttribute("checked","checked"),Te.setAttribute("name","t"),we.appendChild(Te),g.checkClone=we.cloneNode(!0).cloneNode(!0).lastChild.checked,we.innerHTML="<textarea>x</textarea>",g.noCloneChecked=!!we.cloneNode(!0).lastChild.defaultValue;var Ae=/^key/,Se=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ke=/^([^.]*)(?:\.(.+)|)/;function je(){return!0}function Ne(){return!1}function De(e,t){return e===function(){try{return a.activeElement}catch(e){}}()==("focus"===t)}function Le(e,t,n,r,o,i){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Le(e,s,n,r,t[s],i);return e}if(null==r&&null==o?(o=n,r=n=void 0):null==o&&("string"==typeof n?(o=r,r=void 0):(o=r,r=n,n=void 0)),!1===o)o=Ne;else if(!o)return e;return 1===i&&(a=o,(o=function(e){return E().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=E.guid++)),e.each(function(){E.event.add(this,t,o,r,n)})}function Oe(e,t,n){n?(K.set(e,t,!1),E.event.add(e,t,{namespace:!1,handler:function(e){var r,o,i=K.get(this,t);if(1&e.isTrigger&&this[t]){if(i.length)(E.event.special[t]||{}).delegateType&&e.stopPropagation();else if(i=u.call(arguments),K.set(this,t,i),r=n(this,t),this[t](),i!==(o=K.get(this,t))||r?K.set(this,t,!1):o={},i!==o)return e.stopImmediatePropagation(),e.preventDefault(),o.value}else i.length&&(K.set(this,t,{value:E.event.trigger(E.extend(i[0],E.Event.prototype),i.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===K.get(e,t)&&E.event.add(e,t,je)}E.event={global:{},add:function(e,t,n,r,o){var i,a,s,u,l,c,f,p,d,h,y,m=K.get(e);if(m)for(n.handler&&(n=(i=n).handler,o=i.selector),o&&E.find.matchesSelector(ae,o),n.guid||(n.guid=E.guid++),(u=m.events)||(u=m.events={}),(a=m.handle)||(a=m.handle=function(t){return void 0!==E&&E.event.triggered!==t.type?E.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(B)||[""]).length;l--;)d=y=(s=ke.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=E.event.special[d]||{},d=(o?f.delegateType:f.bindType)||d,f=E.event.special[d]||{},c=E.extend({type:d,origType:y,data:r,handler:n,guid:n.guid,selector:o,needsContext:o&&E.expr.match.needsContext.test(o),namespace:h.join(".")},i),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),o?p.splice(p.delegateCount++,0,c):p.push(c),E.event.global[d]=!0)},remove:function(e,t,n,r,o){var i,a,s,u,l,c,f,p,d,h,y,m=K.hasData(e)&&K.get(e);if(m&&(u=m.events)){for(l=(t=(t||"").match(B)||[""]).length;l--;)if(d=y=(s=ke.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){for(f=E.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=i=p.length;i--;)c=p[i],!o&&y!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(i,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,m.handle)||E.removeEvent(e,d,m.handle),delete u[d])}else for(d in u)E.event.remove(e,d+t[l],n,r,!0);E.isEmptyObject(u)&&K.remove(e,"handle events")}},dispatch:function(e){var t,n,r,o,i,a,s=E.event.fix(e),u=new Array(arguments.length),l=(K.get(this,"events")||{})[s.type]||[],c=E.event.special[s.type]||{};for(u[0]=s,t=1;t<arguments.length;t++)u[t]=arguments[t];if(s.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,s)){for(a=E.event.handlers.call(this,s,l),t=0;(o=a[t++])&&!s.isPropagationStopped();)for(s.currentTarget=o.elem,n=0;(i=o.handlers[n++])&&!s.isImmediatePropagationStopped();)s.rnamespace&&!1!==i.namespace&&!s.rnamespace.test(i.namespace)||(s.handleObj=i,s.data=i.data,void 0!==(r=((E.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,u))&&!1===(s.result=r)&&(s.preventDefault(),s.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,s),s.result}},handlers:function(e,t){var n,r,o,i,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(i=[],a={},n=0;n<u;n++)void 0===a[o=(r=t[n]).selector+" "]&&(a[o]=r.needsContext?E(o,this).index(l)>-1:E.find(o,this,null,[l]).length),a[o]&&i.push(r);i.length&&s.push({elem:l,handlers:i})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(E.Event.prototype,e,{enumerable:!0,configurable:!0,get:v(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[E.expando]?e:new E.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return ye.test(t.type)&&t.click&&D(t,"input")&&Oe(t,"click",je),!1},trigger:function(e){var t=this||e;return ye.test(t.type)&&t.click&&D(t,"input")&&Oe(t,"click"),!0},_default:function(e){var t=e.target;return ye.test(t.type)&&t.click&&D(t,"input")&&K.get(t,"click")||D(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},E.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},E.Event=function(e,t){if(!(this instanceof E.Event))return new E.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?je:Ne,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&E.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[E.expando]=!0},E.Event.prototype={constructor:E.Event,isDefaultPrevented:Ne,isPropagationStopped:Ne,isImmediatePropagationStopped:Ne,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=je,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=je,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=je,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},E.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&Ae.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Se.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},E.event.addProp),E.each({focus:"focusin",blur:"focusout"},function(e,t){E.event.special[e]={setup:function(){return Oe(this,e,De),!1},trigger:function(){return Oe(this,e),!0},delegateType:t}}),E.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){E.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=e.relatedTarget,o=e.handleObj;return r&&(r===this||E.contains(this,r))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),E.fn.extend({on:function(e,t,n,r){return Le(this,e,t,n,r)},one:function(e,t,n,r){return Le(this,e,t,n,r,1)},off:function(e,t,n){var r,o;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,E(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(o in e)this.off(o,t,e[o]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ne),this.each(function(){E.event.remove(this,e,n,t)})}});var qe=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,_e=/<script|<style|<link/i,Pe=/checked\s*(?:[^=]|=\s*.checked.)/i,Re=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function He(e,t){return D(e,"table")&&D(11!==t.nodeType?t:t.firstChild,"tr")&&E(e).children("tbody")[0]||e}function Be(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Ie(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Me(e,t){var n,r,o,i,a,s,u,l;if(1===t.nodeType){if(K.hasData(e)&&(i=K.access(e),a=K.set(t,i),l=i.events))for(o in delete a.handle,a.events={},l)for(n=0,r=l[o].length;n<r;n++)E.event.add(t,o,l[o][n]);Z.hasData(e)&&(s=Z.access(e),u=E.extend({},s),Z.set(t,u))}}function Ue(e,t){var n=t.nodeName.toLowerCase();"input"===n&&ye.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Fe(e,t,n,r){t=l.apply([],t);var o,i,a,s,u,c,f=0,p=e.length,d=p-1,h=t[0],y=v(h);if(y||p>1&&"string"==typeof h&&!g.checkClone&&Pe.test(h))return e.each(function(o){var i=e.eq(o);y&&(t[0]=h.call(this,o,i.html())),Fe(i,t,n,r)});if(p&&(i=(o=Ce(t,e[0].ownerDocument,!1,e,r)).firstChild,1===o.childNodes.length&&(o=i),i||r)){for(s=(a=E.map(be(o,"script"),Be)).length;f<p;f++)u=o,f!==d&&(u=E.clone(u,!0,!0),s&&E.merge(a,be(u,"script"))),n.call(e[f],u,f);if(s)for(c=a[a.length-1].ownerDocument,E.map(a,Ie),f=0;f<s;f++)u=a[f],ge.test(u.type||"")&&!K.access(u,"globalEval")&&E.contains(c,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?E._evalUrl&&!u.noModule&&E._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")}):w(u.textContent.replace(Re,""),u,c))}return e}function $e(e,t,n){for(var r,o=t?E.filter(t,e):e,i=0;null!=(r=o[i]);i++)n||1!==r.nodeType||E.cleanData(be(r)),r.parentNode&&(n&&se(r)&&xe(be(r,"script")),r.parentNode.removeChild(r));return e}E.extend({htmlPrefilter:function(e){return e.replace(qe,"<$1></$2>")},clone:function(e,t,n){var r,o,i,a,s=e.cloneNode(!0),u=se(e);if(!(g.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||E.isXMLDoc(e)))for(a=be(s),r=0,o=(i=be(e)).length;r<o;r++)Ue(i[r],a[r]);if(t)if(n)for(i=i||be(e),a=a||be(s),r=0,o=i.length;r<o;r++)Me(i[r],a[r]);else Me(e,s);return(a=be(s,"script")).length>0&&xe(a,!u&&be(e,"script")),s},cleanData:function(e){for(var t,n,r,o=E.event.special,i=0;void 0!==(n=e[i]);i++)if(Q(n)){if(t=n[K.expando]){if(t.events)for(r in t.events)o[r]?E.event.remove(n,r):E.removeEvent(n,r,t.handle);n[K.expando]=void 0}n[Z.expando]&&(n[Z.expando]=void 0)}}}),E.fn.extend({detach:function(e){return $e(this,e,!0)},remove:function(e){return $e(this,e)},text:function(e){return z(this,function(e){return void 0===e?E.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Fe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||He(this,e).appendChild(e)})},prepend:function(){return Fe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=He(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Fe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Fe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(E.cleanData(be(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return E.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!_e.test(e)&&!ve[(me.exec(e)||["",""])[1].toLowerCase()]){e=E.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(E.cleanData(be(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Fe(this,arguments,function(t){var n=this.parentNode;E.inArray(this,e)<0&&(E.cleanData(be(this)),n&&n.replaceChild(t,this))},e)}}),E.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){E.fn[e]=function(e){for(var n,r=[],o=E(e),i=o.length-1,a=0;a<=i;a++)n=a===i?this:this.clone(!0),E(o[a])[t](n),c.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),ze=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=n),t.getComputedStyle(e)},Xe=new RegExp(ie.join("|"),"i");function Ge(e,t,n){var r,o,i,a,s=e.style;return(n=n||ze(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||se(e)||(a=E.style(e,t)),!g.pixelBoxStyles()&&We.test(a)&&Xe.test(t)&&(r=s.width,o=s.minWidth,i=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=o,s.maxWidth=i)),void 0!==a?a+"":a}function Ve(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",ae.appendChild(l).appendChild(c);var e=n.getComputedStyle(c);r="1%"!==e.top,u=12===t(e.marginLeft),c.style.right="60%",s=36===t(e.right),o=36===t(e.width),c.style.position="absolute",i=12===t(c.offsetWidth/3),ae.removeChild(l),c=null}}function t(e){return Math.round(parseFloat(e))}var r,o,i,s,u,l=a.createElement("div"),c=a.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",g.clearCloneStyle="content-box"===c.style.backgroundClip,E.extend(g,{boxSizingReliable:function(){return e(),o},pixelBoxStyles:function(){return e(),s},pixelPosition:function(){return e(),r},reliableMarginLeft:function(){return e(),u},scrollboxSize:function(){return e(),i}}))}();var Je=["Webkit","Moz","ms"],Qe=a.createElement("div").style,Ye={};function Ke(e){var t=E.cssProps[e]||Ye[e];return t||(e in Qe?e:Ye[e]=function(e){for(var t=e[0].toUpperCase()+e.slice(1),n=Je.length;n--;)if((e=Je[n]+t)in Qe)return e}(e)||e)}var Ze=/^(none|table(?!-c[ea]).+)/,et=/^--/,tt={position:"absolute",visibility:"hidden",display:"block"},nt={letterSpacing:"0",fontWeight:"400"};function rt(e,t,n){var r=oe.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function ot(e,t,n,r,o,i){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=E.css(e,n+ie[a],!0,o)),r?("content"===n&&(u-=E.css(e,"padding"+ie[a],!0,o)),"margin"!==n&&(u-=E.css(e,"border"+ie[a]+"Width",!0,o))):(u+=E.css(e,"padding"+ie[a],!0,o),"padding"!==n?u+=E.css(e,"border"+ie[a]+"Width",!0,o):s+=E.css(e,"border"+ie[a]+"Width",!0,o));return!r&&i>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-i-u-s-.5))||0),u}function it(e,t,n){var r=ze(e),o=(!g.boxSizingReliable()||n)&&"border-box"===E.css(e,"boxSizing",!1,r),i=o,a=Ge(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(We.test(a)){if(!n)return a;a="auto"}return(!g.boxSizingReliable()&&o||"auto"===a||!parseFloat(a)&&"inline"===E.css(e,"display",!1,r))&&e.getClientRects().length&&(o="border-box"===E.css(e,"boxSizing",!1,r),(i=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+ot(e,t,n||(o?"border":"content"),i,r,a)+"px"}function at(e,t,n,r,o){return new at.prototype.init(e,t,n,r,o)}E.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Ge(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,i,a,s=J(t),u=et.test(t),l=e.style;if(u||(t=Ke(s)),a=E.cssHooks[t]||E.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(o=a.get(e,!1,r))?o:l[t];"string"===(i=typeof n)&&(o=oe.exec(n))&&o[1]&&(n=fe(e,t,o),i="number"),null!=n&&n==n&&("number"!==i||u||(n+=o&&o[3]||(E.cssNumber[s]?"":"px")),g.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var o,i,a,s=J(t);return et.test(t)||(t=Ke(s)),(a=E.cssHooks[t]||E.cssHooks[s])&&"get"in a&&(o=a.get(e,!0,n)),void 0===o&&(o=Ge(e,t,r)),"normal"===o&&t in nt&&(o=nt[t]),""===n||n?(i=parseFloat(o),!0===n||isFinite(i)?i||0:o):o}}),E.each(["height","width"],function(e,t){E.cssHooks[t]={get:function(e,n,r){if(n)return!Ze.test(E.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?it(e,t,r):ce(e,tt,function(){return it(e,t,r)})},set:function(e,n,r){var o,i=ze(e),a=!g.scrollboxSize()&&"absolute"===i.position,s=(a||r)&&"border-box"===E.css(e,"boxSizing",!1,i),u=r?ot(e,t,r,s,i):0;return s&&a&&(u-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(i[t])-ot(e,t,"border",!1,i)-.5)),u&&(o=oe.exec(n))&&"px"!==(o[3]||"px")&&(e.style[t]=n,n=E.css(e,t)),rt(0,n,u)}}}),E.cssHooks.marginLeft=Ve(g.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Ge(e,"marginLeft"))||e.getBoundingClientRect().left-ce(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),E.each({margin:"",padding:"",border:"Width"},function(e,t){E.cssHooks[e+t]={expand:function(n){for(var r=0,o={},i="string"==typeof n?n.split(" "):[n];r<4;r++)o[e+ie[r]+t]=i[r]||i[r-2]||i[0];return o}},"margin"!==e&&(E.cssHooks[e+t].set=rt)}),E.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,o,i={},a=0;if(Array.isArray(t)){for(r=ze(e),o=t.length;a<o;a++)i[t[a]]=E.css(e,t[a],!1,r);return i}return void 0!==n?E.style(e,t,n):E.css(e,t)},e,t,arguments.length>1)}}),E.Tween=at,at.prototype={constructor:at,init:function(e,t,n,r,o,i){this.elem=e,this.prop=n,this.easing=o||E.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=i||(E.cssNumber[n]?"":"px")},cur:function(){var e=at.propHooks[this.prop];return e&&e.get?e.get(this):at.propHooks._default.get(this)},run:function(e){var t,n=at.propHooks[this.prop];return this.options.duration?this.pos=t=E.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):at.propHooks._default.set(this),this}},at.prototype.init.prototype=at.prototype,at.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=E.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){E.fx.step[e.prop]?E.fx.step[e.prop](e):1!==e.elem.nodeType||!E.cssHooks[e.prop]&&null==e.elem.style[Ke(e.prop)]?e.elem[e.prop]=e.now:E.style(e.elem,e.prop,e.now+e.unit)}}},at.propHooks.scrollTop=at.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},E.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},E.fx=at.prototype.init,E.fx.step={};var st,ut,lt=/^(?:toggle|show|hide)$/,ct=/queueHooks$/;function ft(){ut&&(!1===a.hidden&&n.requestAnimationFrame?n.requestAnimationFrame(ft):n.setTimeout(ft,E.fx.interval),E.fx.tick())}function pt(){return n.setTimeout(function(){st=void 0}),st=Date.now()}function dt(e,t){var n,r=0,o={height:e};for(t=t?1:0;r<4;r+=2-t)o["margin"+(n=ie[r])]=o["padding"+n]=e;return t&&(o.opacity=o.width=e),o}function ht(e,t,n){for(var r,o=(yt.tweeners[t]||[]).concat(yt.tweeners["*"]),i=0,a=o.length;i<a;i++)if(r=o[i].call(n,t,e))return r}function yt(e,t,n){var r,o,i=0,a=yt.prefilters.length,s=E.Deferred().always(function(){delete u.elem}),u=function(){if(o)return!1;for(var t=st||pt(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),i=0,a=l.tweens.length;i<a;i++)l.tweens[i].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:E.extend({},t),opts:E.extend(!0,{specialEasing:{},easing:E.easing._default},n),originalProperties:t,originalOptions:n,startTime:st||pt(),duration:n.duration,tweens:[],createTween:function(t,n){var r=E.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(o)return this;for(o=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(!function(e,t){var n,r,o,i,a;for(n in e)if(o=t[r=J(n)],i=e[n],Array.isArray(i)&&(o=i[1],i=e[n]=i[0]),n!==r&&(e[r]=i,delete e[n]),(a=E.cssHooks[r])&&"expand"in a)for(n in i=a.expand(i),delete e[r],i)n in e||(e[n]=i[n],t[n]=o);else t[r]=o}(c,l.opts.specialEasing);i<a;i++)if(r=yt.prefilters[i].call(l,e,c,l.opts))return v(r.stop)&&(E._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return E.map(c,ht,l),v(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),E.fx.timer(E.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}E.Animation=E.extend(yt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return fe(n.elem,e,oe.exec(t),n),n}]},tweener:function(e,t){v(e)?(t=e,e=["*"]):e=e.match(B);for(var n,r=0,o=e.length;r<o;r++)n=e[r],yt.tweeners[n]=yt.tweeners[n]||[],yt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,o,i,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,y=e.nodeType&&le(e),m=K.get(e,"fxshow");for(r in n.queue||(null==(a=E._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,E.queue(e,"fx").length||a.empty.fire()})})),t)if(o=t[r],lt.test(o)){if(delete t[r],i=i||"toggle"===o,o===(y?"hide":"show")){if("show"!==o||!m||void 0===m[r])continue;y=!0}d[r]=m&&m[r]||E.style(e,r)}if((u=!E.isEmptyObject(t))||!E.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=m&&m.display)&&(l=K.get(e,"display")),"none"===(c=E.css(e,"display"))&&(l?c=l:(he([e],!0),l=e.style.display||l,c=E.css(e,"display"),he([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===E.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(m?"hidden"in m&&(y=m.hidden):m=K.access(e,"fxshow",{display:l}),i&&(m.hidden=!y),y&&he([e],!0),p.done(function(){for(r in y||he([e]),K.remove(e,"fxshow"),d)E.style(e,r,d[r])})),u=ht(y?m[r]:0,r,p),r in m||(m[r]=u.start,y&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?yt.prefilters.unshift(e):yt.prefilters.push(e)}}),E.speed=function(e,t,n){var r=e&&"object"==typeof e?E.extend({},e):{complete:n||!n&&t||v(e)&&e,duration:e,easing:n&&t||t&&!v(t)&&t};return E.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in E.fx.speeds?r.duration=E.fx.speeds[r.duration]:r.duration=E.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){v(r.old)&&r.old.call(this),r.queue&&E.dequeue(this,r.queue)},r},E.fn.extend({fadeTo:function(e,t,n,r){return this.filter(le).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var o=E.isEmptyObject(e),i=E.speed(t,n,r),a=function(){var t=yt(this,E.extend({},e),i);(o||K.get(this,"finish"))&&t.stop(!0)};return a.finish=a,o||!1===i.queue?this.each(a):this.queue(i.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,o=null!=e&&e+"queueHooks",i=E.timers,a=K.get(this);if(o)a[o]&&a[o].stop&&r(a[o]);else for(o in a)a[o]&&a[o].stop&&ct.test(o)&&r(a[o]);for(o=i.length;o--;)i[o].elem!==this||null!=e&&i[o].queue!==e||(i[o].anim.stop(n),t=!1,i.splice(o,1));!t&&n||E.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=K.get(this),r=n[e+"queue"],o=n[e+"queueHooks"],i=E.timers,a=r?r.length:0;for(n.finish=!0,E.queue(this,e,[]),o&&o.stop&&o.stop.call(this,!0),t=i.length;t--;)i[t].elem===this&&i[t].queue===e&&(i[t].anim.stop(!0),i.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),E.each(["toggle","show","hide"],function(e,t){var n=E.fn[t];E.fn[t]=function(e,r,o){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(dt(t,!0),e,r,o)}}),E.each({slideDown:dt("show"),slideUp:dt("hide"),slideToggle:dt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){E.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),E.timers=[],E.fx.tick=function(){var e,t=0,n=E.timers;for(st=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||E.fx.stop(),st=void 0},E.fx.timer=function(e){E.timers.push(e),E.fx.start()},E.fx.interval=13,E.fx.start=function(){ut||(ut=!0,ft())},E.fx.stop=function(){ut=null},E.fx.speeds={slow:600,fast:200,_default:400},E.fn.delay=function(e,t){return e=E.fx&&E.fx.speeds[e]||e,t=t||"fx",this.queue(t,function(t,r){var o=n.setTimeout(t,e);r.stop=function(){n.clearTimeout(o)}})},function(){var e=a.createElement("input"),t=a.createElement("select").appendChild(a.createElement("option"));e.type="checkbox",g.checkOn=""!==e.value,g.optSelected=t.selected,(e=a.createElement("input")).value="t",e.type="radio",g.radioValue="t"===e.value}();var mt,gt=E.expr.attrHandle;E.fn.extend({attr:function(e,t){return z(this,E.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){E.removeAttr(this,e)})}}),E.extend({attr:function(e,t,n){var r,o,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return void 0===e.getAttribute?E.prop(e,t,n):(1===i&&E.isXMLDoc(e)||(o=E.attrHooks[t.toLowerCase()]||(E.expr.match.bool.test(t)?mt:void 0)),void 0!==n?null===n?void E.removeAttr(e,t):o&&"set"in o&&void 0!==(r=o.set(e,n,t))?r:(e.setAttribute(t,n+""),n):o&&"get"in o&&null!==(r=o.get(e,t))?r:null==(r=E.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!g.radioValue&&"radio"===t&&D(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,o=t&&t.match(B);if(o&&1===e.nodeType)for(;n=o[r++];)e.removeAttribute(n)}}),mt={set:function(e,t,n){return!1===t?E.removeAttr(e,n):e.setAttribute(n,n),n}},E.each(E.expr.match.bool.source.match(/\w+/g),function(e,t){var n=gt[t]||E.find.attr;gt[t]=function(e,t,r){var o,i,a=t.toLowerCase();return r||(i=gt[a],gt[a]=o,o=null!=n(e,t,r)?a:null,gt[a]=i),o}});var vt=/^(?:input|select|textarea|button)$/i,bt=/^(?:a|area)$/i;function xt(e){return(e.match(B)||[]).join(" ")}function wt(e){return e.getAttribute&&e.getAttribute("class")||""}function Tt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(B)||[]}E.fn.extend({prop:function(e,t){return z(this,E.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[E.propFix[e]||e]})}}),E.extend({prop:function(e,t,n){var r,o,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return 1===i&&E.isXMLDoc(e)||(t=E.propFix[t]||t,o=E.propHooks[t]),void 0!==n?o&&"set"in o&&void 0!==(r=o.set(e,n,t))?r:e[t]=n:o&&"get"in o&&null!==(r=o.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=E.find.attr(e,"tabindex");return t?parseInt(t,10):vt.test(e.nodeName)||bt.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),g.optSelected||(E.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),E.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){E.propFix[this.toLowerCase()]=this}),E.fn.extend({addClass:function(e){var t,n,r,o,i,a,s,u=0;if(v(e))return this.each(function(t){E(this).addClass(e.call(this,t,wt(this)))});if((t=Tt(e)).length)for(;n=this[u++];)if(o=wt(n),r=1===n.nodeType&&" "+xt(o)+" "){for(a=0;i=t[a++];)r.indexOf(" "+i+" ")<0&&(r+=i+" ");o!==(s=xt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,o,i,a,s,u=0;if(v(e))return this.each(function(t){E(this).removeClass(e.call(this,t,wt(this)))});if(!arguments.length)return this.attr("class","");if((t=Tt(e)).length)for(;n=this[u++];)if(o=wt(n),r=1===n.nodeType&&" "+xt(o)+" "){for(a=0;i=t[a++];)for(;r.indexOf(" "+i+" ")>-1;)r=r.replace(" "+i+" "," ");o!==(s=xt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):v(e)?this.each(function(n){E(this).toggleClass(e.call(this,n,wt(this),t),t)}):this.each(function(){var t,o,i,a;if(r)for(o=0,i=E(this),a=Tt(e);t=a[o++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else void 0!==e&&"boolean"!==n||((t=wt(this))&&K.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":K.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+xt(wt(n))+" ").indexOf(t)>-1)return!0;return!1}});var Et=/\r/g;E.fn.extend({val:function(e){var t,n,r,o=this[0];return arguments.length?(r=v(e),this.each(function(n){var o;1===this.nodeType&&(null==(o=r?e.call(this,n,E(this).val()):e)?o="":"number"==typeof o?o+="":Array.isArray(o)&&(o=E.map(o,function(e){return null==e?"":e+""})),(t=E.valHooks[this.type]||E.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,o,"value")||(this.value=o))})):o?(t=E.valHooks[o.type]||E.valHooks[o.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(o,"value"))?n:"string"==typeof(n=o.value)?n.replace(Et,""):null==n?"":n:void 0}}),E.extend({valHooks:{option:{get:function(e){var t=E.find.attr(e,"value");return null!=t?t:xt(E.text(e))}},select:{get:function(e){var t,n,r,o=e.options,i=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?i+1:o.length;for(r=i<0?u:a?i:0;r<u;r++)if(((n=o[r]).selected||r===i)&&!n.disabled&&(!n.parentNode.disabled||!D(n.parentNode,"optgroup"))){if(t=E(n).val(),a)return t;s.push(t)}return s},set:function(e,t){for(var n,r,o=e.options,i=E.makeArray(t),a=o.length;a--;)((r=o[a]).selected=E.inArray(E.valHooks.option.get(r),i)>-1)&&(n=!0);return n||(e.selectedIndex=-1),i}}}}),E.each(["radio","checkbox"],function(){E.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=E.inArray(E(e).val(),t)>-1}},g.checkOn||(E.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),g.focusin="onfocusin"in n;var Ct=/^(?:focusinfocus|focusoutblur)$/,At=function(e){e.stopPropagation()};E.extend(E.event,{trigger:function(e,t,r,o){var i,s,u,l,c,f,p,d,y=[r||a],m=h.call(e,"type")?e.type:e,g=h.call(e,"namespace")?e.namespace.split("."):[];if(s=d=u=r=r||a,3!==r.nodeType&&8!==r.nodeType&&!Ct.test(m+E.event.triggered)&&(m.indexOf(".")>-1&&(g=m.split("."),m=g.shift(),g.sort()),c=m.indexOf(":")<0&&"on"+m,(e=e[E.expando]?e:new E.Event(m,"object"==typeof e&&e)).isTrigger=o?2:3,e.namespace=g.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=r),t=null==t?[e]:E.makeArray(t,[e]),p=E.event.special[m]||{},o||!p.trigger||!1!==p.trigger.apply(r,t))){if(!o&&!p.noBubble&&!b(r)){for(l=p.delegateType||m,Ct.test(l+m)||(s=s.parentNode);s;s=s.parentNode)y.push(s),u=s;u===(r.ownerDocument||a)&&y.push(u.defaultView||u.parentWindow||n)}for(i=0;(s=y[i++])&&!e.isPropagationStopped();)d=s,e.type=i>1?l:p.bindType||m,(f=(K.get(s,"events")||{})[e.type]&&K.get(s,"handle"))&&f.apply(s,t),(f=c&&s[c])&&f.apply&&Q(s)&&(e.result=f.apply(s,t),!1===e.result&&e.preventDefault());return e.type=m,o||e.isDefaultPrevented()||p._default&&!1!==p._default.apply(y.pop(),t)||!Q(r)||c&&v(r[m])&&!b(r)&&((u=r[c])&&(r[c]=null),E.event.triggered=m,e.isPropagationStopped()&&d.addEventListener(m,At),r[m](),e.isPropagationStopped()&&d.removeEventListener(m,At),E.event.triggered=void 0,u&&(r[c]=u)),e.result}},simulate:function(e,t,n){var r=E.extend(new E.Event,n,{type:e,isSimulated:!0});E.event.trigger(r,null,t)}}),E.fn.extend({trigger:function(e,t){return this.each(function(){E.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return E.event.trigger(e,t,n,!0)}}),g.focusin||E.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){E.event.simulate(t,e.target,E.event.fix(e))};E.event.special[t]={setup:function(){var r=this.ownerDocument||this,o=K.access(r,t);o||r.addEventListener(e,n,!0),K.access(r,t,(o||0)+1)},teardown:function(){var r=this.ownerDocument||this,o=K.access(r,t)-1;o?K.access(r,t,o):(r.removeEventListener(e,n,!0),K.remove(r,t))}}});var St=n.location,kt=Date.now(),jt=/\?/;E.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new n.DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return t&&!t.getElementsByTagName("parsererror").length||E.error("Invalid XML: "+e),t};var Nt=/\[\]$/,Dt=/\r?\n/g,Lt=/^(?:submit|button|image|reset|file)$/i,Ot=/^(?:input|select|textarea|keygen)/i;function qt(e,t,n,r){var o;if(Array.isArray(t))E.each(t,function(t,o){n||Nt.test(e)?r(e,o):qt(e+"["+("object"==typeof o&&null!=o?t:"")+"]",o,n,r)});else if(n||"object"!==T(t))r(e,t);else for(o in t)qt(e+"["+o+"]",t[o],n,r)}E.param=function(e,t){var n,r=[],o=function(e,t){var n=v(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!E.isPlainObject(e))E.each(e,function(){o(this.name,this.value)});else for(n in e)qt(n,e[n],t,o);return r.join("&")},E.fn.extend({serialize:function(){return E.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=E.prop(this,"elements");return e?E.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!E(this).is(":disabled")&&Ot.test(this.nodeName)&&!Lt.test(e)&&(this.checked||!ye.test(e))}).map(function(e,t){var n=E(this).val();return null==n?null:Array.isArray(n)?E.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var _t=/%20/g,Pt=/#.*$/,Rt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)$/gm,Bt=/^(?:GET|HEAD)$/,It=/^\/\//,Mt={},Ut={},Ft="*/".concat("*"),$t=a.createElement("a");function Wt(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,o=0,i=t.toLowerCase().match(B)||[];if(v(n))for(;r=i[o++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function zt(e,t,n,r){var o={},i=e===Ut;function a(s){var u;return o[s]=!0,E.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||i||o[l]?i?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!o["*"]&&a("*")}function Xt(e,t){var n,r,o=E.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((o[n]?e:r||(r={}))[n]=t[n]);return r&&E.extend(!0,e,r),e}$t.href=St.href,E.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:St.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(St.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Ft,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":E.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Xt(Xt(e,E.ajaxSettings),t):Xt(E.ajaxSettings,e)},ajaxPrefilter:Wt(Mt),ajaxTransport:Wt(Ut),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var r,o,i,s,u,l,c,f,p,d,h=E.ajaxSetup({},t),y=h.context||h,m=h.context&&(y.nodeType||y.jquery)?E(y):E.event,g=E.Deferred(),v=E.Callbacks("once memory"),b=h.statusCode||{},x={},w={},T="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s)for(s={};t=Ht.exec(i);)s[t[1].toLowerCase()+" "]=(s[t[1].toLowerCase()+" "]||[]).concat(t[2]);t=s[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return c?i:null},setRequestHeader:function(e,t){return null==c&&(e=w[e.toLowerCase()]=w[e.toLowerCase()]||e,x[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)C.always(e[C.status]);else for(t in e)b[t]=[b[t],e[t]];return this},abort:function(e){var t=e||T;return r&&r.abort(t),A(0,t),this}};if(g.promise(C),h.url=((e||h.url||St.href)+"").replace(It,St.protocol+"//"),h.type=t.method||t.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(B)||[""],null==h.crossDomain){l=a.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=$t.protocol+"//"+$t.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=E.param(h.data,h.traditional)),zt(Mt,h,t,C),c)return C;for(p in(f=E.event&&h.global)&&0==E.active++&&E.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Bt.test(h.type),o=h.url.replace(Pt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(_t,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(jt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Rt,"$1"),d=(jt.test(o)?"&":"?")+"_="+kt+++d),h.url=o+d),h.ifModified&&(E.lastModified[o]&&C.setRequestHeader("If-Modified-Since",E.lastModified[o]),E.etag[o]&&C.setRequestHeader("If-None-Match",E.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||t.contentType)&&C.setRequestHeader("Content-Type",h.contentType),C.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+Ft+"; q=0.01":""):h.accepts["*"]),h.headers)C.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(y,C,h)||c))return C.abort();if(T="abort",v.add(h.complete),C.done(h.success),C.fail(h.error),r=zt(Ut,h,t,C)){if(C.readyState=1,f&&m.trigger("ajaxSend",[C,h]),c)return C;h.async&&h.timeout>0&&(u=n.setTimeout(function(){C.abort("timeout")},h.timeout));try{c=!1,r.send(x,A)}catch(e){if(c)throw e;A(-1,e)}}else A(-1,"No Transport");function A(e,t,a,s){var l,p,d,x,w,T=t;c||(c=!0,u&&n.clearTimeout(u),r=void 0,i=s||"",C.readyState=e>0?4:0,l=e>=200&&e<300||304===e,a&&(x=function(e,t,n){for(var r,o,i,a,s=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(o in s)if(s[o]&&s[o].test(r)){u.unshift(o);break}if(u[0]in n)i=u[0];else{for(o in n){if(!u[0]||e.converters[o+" "+u[0]]){i=o;break}a||(a=o)}i=i||a}if(i)return i!==u[0]&&u.unshift(i),n[i]}(h,C,a)),x=function(e,t,n,r){var o,i,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];for(i=c.shift();i;)if(e.responseFields[i]&&(n[e.responseFields[i]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=i,i=c.shift())if("*"===i)i=u;else if("*"!==u&&u!==i){if(!(a=l[u+" "+i]||l["* "+i]))for(o in l)if((s=o.split(" "))[1]===i&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[o]:!0!==l[o]&&(i=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e.throws)t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+i}}}return{state:"success",data:t}}(h,x,C,l),l?(h.ifModified&&((w=C.getResponseHeader("Last-Modified"))&&(E.lastModified[o]=w),(w=C.getResponseHeader("etag"))&&(E.etag[o]=w)),204===e||"HEAD"===h.type?T="nocontent":304===e?T="notmodified":(T=x.state,p=x.data,l=!(d=x.error))):(d=T,!e&&T||(T="error",e<0&&(e=0))),C.status=e,C.statusText=(t||T)+"",l?g.resolveWith(y,[p,T,C]):g.rejectWith(y,[C,T,d]),C.statusCode(b),b=void 0,f&&m.trigger(l?"ajaxSuccess":"ajaxError",[C,h,l?p:d]),v.fireWith(y,[C,T]),f&&(m.trigger("ajaxComplete",[C,h]),--E.active||E.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return E.get(e,t,n,"json")},getScript:function(e,t){return E.get(e,void 0,t,"script")}}),E.each(["get","post"],function(e,t){E[t]=function(e,n,r,o){return v(n)&&(o=o||r,r=n,n=void 0),E.ajax(E.extend({url:e,type:t,dataType:o,data:n,success:r},E.isPlainObject(e)&&e))}}),E._evalUrl=function(e,t){return E.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){E.globalEval(e,t)}})},E.fn.extend({wrapAll:function(e){var t;return this[0]&&(v(e)&&(e=e.call(this[0])),t=E(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return v(e)?this.each(function(t){E(this).wrapInner(e.call(this,t))}):this.each(function(){var t=E(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v(e);return this.each(function(n){E(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){E(this).replaceWith(this.childNodes)}),this}}),E.expr.pseudos.hidden=function(e){return!E.expr.pseudos.visible(e)},E.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},E.ajaxSettings.xhr=function(){try{return new n.XMLHttpRequest}catch(e){}};var Gt={0:200,1223:204},Vt=E.ajaxSettings.xhr();g.cors=!!Vt&&"withCredentials"in Vt,g.ajax=Vt=!!Vt,E.ajaxTransport(function(e){var t,r;if(g.cors||Vt&&!e.crossDomain)return{send:function(o,i){var a,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(a in e.xhrFields)s[a]=e.xhrFields[a];for(a in e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||o["X-Requested-With"]||(o["X-Requested-With"]="XMLHttpRequest"),o)s.setRequestHeader(a,o[a]);t=function(e){return function(){t&&(t=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?i(0,"error"):i(s.status,s.statusText):i(Gt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=t(),r=s.onerror=s.ontimeout=t("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&n.setTimeout(function(){t&&r()})},t=t("abort");try{s.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}}),E.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),E.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return E.globalEval(e),e}}}),E.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),E.ajaxTransport("script",function(e){var t,n;if(e.crossDomain||e.scriptAttrs)return{send:function(r,o){t=E("<script>").attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),a.head.appendChild(t[0])},abort:function(){n&&n()}}});var Jt,Qt=[],Yt=/(=)\?(?=&|$)|\?\?/;E.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Qt.pop()||E.expando+"_"+kt++;return this[e]=!0,e}}),E.ajaxPrefilter("json jsonp",function(e,t,r){var o,i,a,s=!1!==e.jsonp&&(Yt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Yt.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return o=e.jsonpCallback=v(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(Yt,"$1"+o):!1!==e.jsonp&&(e.url+=(jt.test(e.url)?"&":"?")+e.jsonp+"="+o),e.converters["script json"]=function(){return a||E.error(o+" was not called"),a[0]},e.dataTypes[0]="json",i=n[o],n[o]=function(){a=arguments},r.always(function(){void 0===i?E(n).removeProp(o):n[o]=i,e[o]&&(e.jsonpCallback=t.jsonpCallback,Qt.push(o)),a&&v(i)&&i(a[0]),a=i=void 0}),"script"}),g.createHTMLDocument=((Jt=a.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Jt.childNodes.length),E.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(g.createHTMLDocument?((r=(t=a.implementation.createHTMLDocument("")).createElement("base")).href=a.location.href,t.head.appendChild(r)):t=a),i=!n&&[],(o=L.exec(e))?[t.createElement(o[1])]:(o=Ce([e],t,i),i&&i.length&&E(i).remove(),E.merge([],o.childNodes)));var r,o,i},E.fn.load=function(e,t,n){var r,o,i,a=this,s=e.indexOf(" ");return s>-1&&(r=xt(e.slice(s)),e=e.slice(0,s)),v(t)?(n=t,t=void 0):t&&"object"==typeof t&&(o="POST"),a.length>0&&E.ajax({url:e,type:o||"GET",dataType:"html",data:t}).done(function(e){i=arguments,a.html(r?E("<div>").append(E.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,i||[e.responseText,t,e])})}),this},E.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){E.fn[t]=function(e){return this.on(t,e)}}),E.expr.pseudos.animated=function(e){return E.grep(E.timers,function(t){return e===t.elem}).length},E.offset={setOffset:function(e,t,n){var r,o,i,a,s,u,l=E.css(e,"position"),c=E(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),i=E.css(e,"top"),u=E.css(e,"left"),("absolute"===l||"fixed"===l)&&(i+u).indexOf("auto")>-1?(a=(r=c.position()).top,o=r.left):(a=parseFloat(i)||0,o=parseFloat(u)||0),v(t)&&(t=t.call(e,n,E.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+o),"using"in t?t.using.call(e,f):c.css(f)}},E.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){E.offset.setOffset(this,e,t)});var t,n,r=this[0];return r?r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],o={top:0,left:0};if("fixed"===E.css(r,"position"))t=r.getBoundingClientRect();else{for(t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&"static"===E.css(e,"position");)e=e.parentNode;e&&e!==r&&1===e.nodeType&&((o=E(e).offset()).top+=E.css(e,"borderTopWidth",!0),o.left+=E.css(e,"borderLeftWidth",!0))}return{top:t.top-o.top-E.css(r,"marginTop",!0),left:t.left-o.left-E.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===E.css(e,"position");)e=e.offsetParent;return e||ae})}}),E.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;E.fn[e]=function(r){return z(this,function(e,r,o){var i;if(b(e)?i=e:9===e.nodeType&&(i=e.defaultView),void 0===o)return i?i[t]:e[r];i?i.scrollTo(n?i.pageXOffset:o,n?o:i.pageYOffset):e[r]=o},e,r,arguments.length)}}),E.each(["top","left"],function(e,t){E.cssHooks[t]=Ve(g.pixelPosition,function(e,n){if(n)return n=Ge(e,t),We.test(n)?E(e).position()[t]+"px":n})}),E.each({Height:"height",Width:"width"},function(e,t){E.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){E.fn[r]=function(o,i){var a=arguments.length&&(n||"boolean"!=typeof o),s=n||(!0===o||!0===i?"margin":"border");return z(this,function(t,n,o){var i;return b(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===o?E.css(t,n,s):E.style(t,n,o,s)},t,a?o:void 0,a)}})}),E.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){E.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),E.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),E.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),E.proxy=function(e,t){var n,r,o;if("string"==typeof t&&(n=e[t],t=e,e=n),v(e))return r=u.call(arguments,2),(o=function(){return e.apply(t||this,r.concat(u.call(arguments)))}).guid=e.guid=e.guid||E.guid++,o},E.holdReady=function(e){e?E.readyWait++:E.ready(!0)},E.isArray=Array.isArray,E.parseJSON=JSON.parse,E.nodeName=D,E.isFunction=v,E.isWindow=b,E.camelCase=J,E.type=T,E.now=Date.now,E.isNumeric=function(e){var t=E.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},void 0===(r=function(){return E}.apply(t,[]))||(e.exports=r);var Kt=n.jQuery,Zt=n.$;return E.noConflict=function(e){return n.$===E&&(n.$=Zt),e&&n.jQuery===E&&(n.jQuery=Kt),E},o||(n.jQuery=n.$=E),E})},function(e,t,n){var r,o,i;i=function(){return function(){return function(e){var t=[];if(e[0].match(/^[^\/:]+:\/*$/)&&e.length>1){var n=e.shift();e[0]=n+e[0]}e[0].match(/^file:\/\/\//)?e[0]=e[0].replace(/^([^\/:]+):\/*/,"$1:///"):e[0]=e[0].replace(/^([^\/:]+):\/*/,"$1://");for(var r=0;r<e.length;r++){var o=e[r];if("string"!=typeof o)throw new TypeError("Url must be a string. Received "+o);""!==o&&(r>0&&(o=o.replace(/^[\/]+/,"")),o=r<e.length-1?o.replace(/[\/]+$/,""):o.replace(/[\/]+$/,"/"),t.push(o))}var i=t.join("/"),a=(i=i.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return i=a.shift()+(a.length>0?"?":"")+a.join("&")}("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}},e.exports?e.exports=i():void 0===(o="function"==typeof(r=i)?r.call(t,n,t,e):r)||(e.exports=o)},function(e,t,n){var r=n(3);"string"==typeof r&&(r=[[e.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};n(5)(r,o);r.locals&&(e.exports=r.locals)},function(e,t,n){(e.exports=n(4)(!1)).push([e.i,".oeb-table-scroll {\n  position: relative;\n  width:100%;\n  z-index: 1;\n  margin: auto;\n  overflow: scroll;\n  max-height: 500px;\n}\n.oeb-table-scroll table {\n  width: 100%;\n  min-width: 600px;\n  margin: auto;\n  border-collapse: separate;\n  border-spacing: 0;\n}\n\n.oeb-table-scroll th,\n.oeb-table-scroll td {\n  padding: 5px 10px;\n  border: 1px solid black;  \n  vertical-align: top;\n  text-align: center;\n}\n.oeb-table-scroll thead th {\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n}\n\n.oeb-table-scroll th {\n  position: -webkit-sticky;\n  position: sticky;\n  background: #fff;  \n  /* overflow: hidden; */\n  z-index:3;\n}\n/* .oeb-table-scroll th a{\n \n}*/\n.oeb-table-scroll th:first-child {\n  position: -webkit-sticky;\n  position: sticky;\n  left: 0;\n  z-index: 2;\n}\n.oeb-table-scroll thead th:first-child{\n  z-index: 4;\n  \n}\n\n\n.no_benchmark_data {\n  text-align: center;\n  border: none !important;\n}\n\n.classificators_list {\n  background-color: #0A58A2;\n\n  border-radius: 8px;\n  color: #fff;\n  font-size: 1vw;\n  padding-left: 25px;\n  padding-right: 25px;\n  text-align: center;\n  width: 20vw;\n\n}\n\n.classificators_list:hover {\n  background-color: #b3cde0;\n\n} \n",""])},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(a=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),i=r.sources.map(function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"});return[n].concat(i).concat([o]).join("\n")}var a;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<e.length;o++){var a=e[o];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},function(e,t,n){var r,o,i={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),s=function(e){var t={};return function(e){if("function"==typeof e)return e();if(void 0===t[e]){var n=function(e){return document.querySelector(e)}.call(this,e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}}(),u=null,l=0,c=[],f=n(6);function p(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=i[r.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](r.parts[a]);for(;a<r.parts.length;a++)o.parts.push(v(r.parts[a],t))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(v(r.parts[a],t));i[r.id]={id:r.id,refs:1,parts:s}}}}function d(e,t){for(var n=[],r={},o=0;o<e.length;o++){var i=e[o],a=t.base?i[0]+t.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function h(e,t){var n=s(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=s(e.insertInto+" "+e.insertAt.before);n.insertBefore(t,o)}}function y(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function m(e){var t=document.createElement("style");return void 0===e.attrs.type&&(e.attrs.type="text/css"),g(t,e.attrs),h(e,t),t}function g(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function v(e,t){var n,r,o,i;if(t.transform&&e.css){if(!(i=t.transform(e.css)))return function(){};e.css=i}if(t.singleton){var a=l++;n=u||(u=m(t)),r=w.bind(null,n,a,!1),o=w.bind(null,n,a,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",g(t,e.attrs),h(e,t),t}(t),r=function(e,t,n){var r=n.css,o=n.sourceMap,i=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||i)&&(r=f(r));o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}.bind(null,n,t),o=function(){y(n),n.href&&URL.revokeObjectURL(n.href)}):(n=m(t),r=function(e,t){var n=t.css,r=t.media;r&&e.setAttribute("media",r);if(e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}.bind(null,n),o=function(){y(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=a()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=d(e,t);return p(n,t),function(e){for(var r=[],o=0;o<n.length;o++){var a=n[o];(s=i[a.id]).refs--,r.push(s)}e&&p(d(e,t),t);for(o=0;o<r.length;o++){var s;if(0===(s=r[o]).refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete i[s.id]}}}};var b,x=(b=[],function(e,t){return b[e]=t,b.filter(Boolean).join("\n")});function w(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var o,i=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?e:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")})}},function(e,t){!function(e){"use strict";if(!e.fetch){var t={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(t.arrayBuffer)var n=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(e){return e&&DataView.prototype.isPrototypeOf(e)},o=ArrayBuffer.isView||function(e){return e&&n.indexOf(Object.prototype.toString.call(e))>-1};c.prototype.append=function(e,t){e=s(e),t=u(t);var n=this.map[e];this.map[e]=n?n+","+t:t},c.prototype.delete=function(e){delete this.map[s(e)]},c.prototype.get=function(e){return e=s(e),this.has(e)?this.map[e]:null},c.prototype.has=function(e){return this.map.hasOwnProperty(s(e))},c.prototype.set=function(e,t){this.map[s(e)]=u(t)},c.prototype.forEach=function(e,t){for(var n in this.map)this.map.hasOwnProperty(n)&&e.call(t,this.map[n],n,this)},c.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),l(e)},c.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),l(e)},c.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),l(e)},t.iterable&&(c.prototype[Symbol.iterator]=c.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];m.prototype.clone=function(){return new m(this,{body:this._bodyInit})},y.call(m.prototype),y.call(v.prototype),v.prototype.clone=function(){return new v(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new c(this.headers),url:this.url})},v.error=function(){var e=new v(null,{status:0,statusText:""});return e.type="error",e};var a=[301,302,303,307,308];v.redirect=function(e,t){if(-1===a.indexOf(t))throw new RangeError("Invalid status code");return new v(null,{status:t,headers:{location:e}})},e.Headers=c,e.Request=m,e.Response=v,e.fetch=function(e,n){return new Promise(function(r,o){var i=new m(e,n),a=new XMLHttpRequest;a.onload=function(){var e,t,n={status:a.status,statusText:a.statusText,headers:(e=a.getAllResponseHeaders()||"",t=new c,e.split(/\r?\n/).forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t)};n.url="responseURL"in a?a.responseURL:n.headers.get("X-Request-URL");var o="response"in a?a.response:a.responseText;r(new v(o,n))},a.onerror=function(){o(new TypeError("Network request failed"))},a.ontimeout=function(){o(new TypeError("Network request failed"))},a.open(i.method,i.url,!0),"include"===i.credentials&&(a.withCredentials=!0),"responseType"in a&&t.blob&&(a.responseType="blob"),i.headers.forEach(function(e,t){a.setRequestHeader(t,e)}),a.send(void 0===i._bodyInit?null:i._bodyInit)})},e.fetch.polyfill=!0}function s(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function u(e){return"string"!=typeof e&&(e=String(e)),e}function l(e){var n={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return t.iterable&&(n[Symbol.iterator]=function(){return n}),n}function c(e){this.map={},e instanceof c?e.forEach(function(e,t){this.append(t,e)},this):Array.isArray(e)?e.forEach(function(e){this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function f(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function p(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function d(e){var t=new FileReader,n=p(t);return t.readAsArrayBuffer(e),n}function h(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(t.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(t.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(t.arrayBuffer&&t.blob&&r(e))this._bodyArrayBuffer=h(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!t.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!o(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=h(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var e=f(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?f(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(d)}),this.text=function(){var e,t,n,r=f(this);if(r)return r;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,n=p(t),t.readAsText(e),n;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(g)}),this.json=function(){return this.text().then(JSON.parse)},this}function m(e,t){var n,r,o=(t=t||{}).body;if(e instanceof m){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new c(e.headers)),this.method=e.method,this.mode=e.mode,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new c(t.headers)),this.method=(n=t.method||this.method||"GET",r=n.toUpperCase(),i.indexOf(r)>-1?r:n),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function g(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function v(e,t){t||(t={}),this.type="default",this.status="status"in t?t.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new c(t.headers),this.url=t.url||"",this._initBody(e)}}("undefined"!=typeof self?self:this)},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),i=(n(2),n(1)),a=n.n(i),s=(n(7),Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e});function u(e,t,n){var r=this,o=function(){if(e.length>0){var i=e.shift();i&&i.apply(r,[t,o])}else n(t)};o()}function l(e,t){var n;try{n=JSON.stringify(e)}catch(e){throw new Error("Network request failed. Payload is not serializable: "+e.message)}return s({body:n,method:"POST"},t,{headers:s({Accept:"*/*","Content-Type":"application/json"},t.headers||[])})}function c(e){void 0===e&&(e={});var t=e.constructOptions,n=e.customFetch,r=e.uri||"/graphql",o=[],i=[],a=[],c=[],f=function(e){var f,p={},d=Array.isArray(e);return function(e,t){return new Promise(function(n,r){u(t?i.slice():o.slice(),e,n)})}(d?{requests:e,options:p}:{request:e,options:p},d).then(function(e){return(t||l)(e.request||e.requests,e.options)}).then(function(e){return p=s({},e),(n||fetch)(r,p)}).then(function(e){return e.text().then(function(t){try{var n=JSON.parse(t);return e.raw=t,e.parsed=n,e}catch(n){return f=n,e.raw=t,e}})}).then(function(e){return function(e,t){return new Promise(function(n,r){u(t?c.slice():a.slice(),e,n)})}({response:e,options:p},d)}).then(function(e){var t=e.response;if(t.parsed){if(!d)return s({},t.parsed);if(Array.isArray(t.parsed))return t.parsed;!function(e){var t=new Error("A batched Operation of responses for ");throw t.response=e,t}(t)}else!function(e,t){var n;throw(n=e&&e.status>=300?new Error("Network request failed with status "+e.status+' - "'+e.statusText+'"'):new Error("Network request failed to return valid JSON")).response=e,n.parseError=t,n}(t,f)})};return f.use=function(e){if("function"!=typeof e)throw new Error("Middleware must be a function");return o.push(e),f},f.useAfter=function(e){if("function"!=typeof e)throw new Error("Afterware must be a function");return a.push(e),f},f.batchUse=function(e){if("function"!=typeof e)throw new Error("Middleware must be a function");return i.push(e),f},f.batchUseAfter=function(e){if("function"!=typeof e)throw new Error("Afterware must be a function");return c.push(e),f},f}function f(e,t,n){var r=o()("#"+e).data("mode")?"dev-openebench":"openebench",i=o()("#"+e).data("benchmarkingevent")+"/"+t;let s;(async function(e,t,n){try{return"GET"==t?await fetch(e):await fetch(e,{method:"POST",body:JSON.stringify(n)})}catch(t){console.log(`Invalid Url Error: ${t.stack} `,e)}})(i=a()("https://dev-openebench.bsc.es/bench_event/api/",i),s=void 0===n.length||0==n.length?"GET":"POST",n).then(e=>{if(!e.ok)throw e;return e.json()}).then(t=>{if(void 0!==t.data&&null==t.data){document.getElementById(e+"_bench_dropdown_list").remove();var n=document.createElement("td");n.className="no_benchmark_data";var i=document.createTextNode("No data available for the benchmarking event: '"+o()("#"+e).data("benchmarkingevent")+"'");n.appendChild(i),document.getElementById(e).appendChild(n)}else{var s="OEBC"+o()("#"+e).data("benchmarkingevent").substring(4,7);const n=c({uri:a()("https://"+r+".bsc.es/","sciapi/graphql")});(()=>n({query:"query getTools($community_id: String!){\n                            getTools(toolFilters:{community_id: $community_id}) {\n                                registry_tool_id\n                                name\n                            }\n                        }",variables:{community_id:s}}))().then(n=>{let i=n.data.getTools,u={};i.forEach(function(e){null!=e.registry_tool_id?u[e.name]=e.registry_tool_id.split(":")[1].toLowerCase():u[e.name]=null}),function(e,t,n,r,o){null!=document.getElementById(e+"-oeb-main-table")&&(document.getElementById(e+"-oeb-main-table").remove(),document.getElementById(e+"oeb-table-scroll").remove());var i=document.createElement("div");i.id=e+"oeb-table-scroll",i.className="oeb-table-scroll";var s=document.createElement("table");s.id=e+"-oeb-main-table",s.className="oeb-main-table";var u=document.getElementById(e);i.appendChild(s),u.appendChild(i);var l=document.createElement("thead"),c=document.createElement("tbody");s.appendChild(l),s.appendChild(c);var f=l.insertRow(-1);(y=document.createElement("th")).innerHTML="<b>CHALLENGE &#8594  <br> TOOL &#8595</b>",f.appendChild(y),Object.keys(t[0].participants).forEach(function(e,t){var o=c.insertRow(-1),i=document.createElement("th");if(null!=r[e]){var s=a()("https://"+n+".bsc.es/html/tool/",r[e]);i.innerHTML="<a href='"+s+"'>"+e+"</a>"}else i.innerHTML="<a>"+e+"</a>";o.appendChild(i)});for(var p=0;p<t.length;p++){var d=[t[p].acronym];Object.keys(t[p].participants).forEach(function(e,n){d.push(t[p].participants[e])});for(var h=0;h<s.rows.length;h++)if(0==h){var y,m=a()("https://"+n+".bsc.es/html/scientific/",o,t[p]._id);(y=document.createElement("th")).innerHTML="<a href='"+m+"'>"+d[h]+"</a>",y.id=d[h],l.rows[h].appendChild(y)}else c.rows[h-1].insertCell(s.rows[h].cells.length).innerHTML=d[h]}}(e,t,r,u,s),o()("td").each(function(){"1"==o()(this).html()?o()(this).css({background:"#238b45",color:"#ffffff"}):o()(this).css({background:"#ffffff"})})})}}).catch(e=>console.log(e))}function p(e,t=[],n="diagonal"){if(null==document.getElementById(e+"_bench_dropdown_list")){(l=document.createElement("select")).id=e+"_bench_dropdown_list",l.className="classificators_list";var r=document.getElementById(e),i=document.createElement("OptGroup");i.label="Select a classification method:",l.add(i);var a=document.createElement("option");a.class="selection_option",a.id=e+"_classificator__squares",a.title="Apply square quartiles classification method (based on the 0.5 quartile of the X and Y metrics)",a.data="list_tooltip",a.data="#tooltip_container",a.value="squares",a.innerHTML="SQUARE QUARTILES";var s=document.createElement("option");s.class="selection_option",s.id=e+"_classificator__diagonals",s.title="Apply diagonal quartiles classifcation method (based on the assignment of a score to each participant proceeding from its distance to the 'optimal performance' corner)",s.data="list_tooltip",s.data="#tooltip_container",s.value="diagonals",s.innerHTML="DIAGONAL QUARTILES";var u=document.createElement("option");u.class="selection_option",u.id=e+"classificator__clusters",u.title="Apply k-means clustering algorithm to group the participants",u.data="list_tooltip",u.data="#tooltip_container",u.value="clusters",u.innerHTML="K-MEANS CLUSTERING",i.appendChild(a),i.appendChild(s),i.appendChild(u);if(n)switch(n){case"squares":a.selected="disabled";break;case"diagonals":s.selected="disabled";break;case"clusters":u.selected="disabled";break;default:s.selected="disabled"}r.appendChild(l)}var l=document.getElementById(e+"_bench_dropdown_list");o()("#"+e+"_bench_dropdown_list").off(),o()(l).on("change",function(){f(e,this.options[this.selectedIndex].id.split("__")[1],t)}),f(e,l.options[l.selectedIndex].id.split("__")[1],t)}function d(e=[],t=null){if(0==e.length&&null==t){let t,r,o=document.getElementsByClassName("oeb-table"),i=0;for(r of(i=0,o)){var n=((t=r.getAttribute("data-benchmarkingevent"))+i).replace(":","_");r.id=n,p(n,e),i++}}else p(t,e)}n.d(t,"run_summary_table",function(){return d})}]));


/***/ }),

/***/ "./src/app/scientific/shared/scientific.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/scientific/shared/scientific.service.ts ***!
  \*********************************************************/
/*! exports provided: ScientificService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScientificService", function() { return ScientificService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");





/**
 * scinetific service
 */
let ScientificService = class ScientificService {
    /**
     * constructor
     */
    constructor(http) {
        this.http = http;
        /**
         * production
         */
        this.production = 'openebench';
        /**
         * development
         */
        this.dev = 'dev-openebench';
        /**
         * community url
        */
        this.url = 'https://' + this.production + '.bsc.es/api/scientific';
    }
    /**
     * gets the communities
     */
    getCommunities() {
        this.communities = this.http.get(this.url + '/Community.json');
        return this.communities
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(this.handleError('getCommunities', [])));
    }
    /**
     * gets datasets
     */
    getDatasets() {
        this.datasets = this.http.get(this.url + '/Dataset.json');
        return this.datasets
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(this.handleError('getDatasets', [])));
    }
    /**
     * gets benchmakring events
     */
    getBenchmarkingEvents(id) {
        this.communities = this.http.get(this.url + '/BenchmarkingEvent?query=' + id + '&fmt=json');
        return this.communities
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(this.handleError('getBenchmarkingEvents', [])));
    }
    /**
     * gets challenges
     */
    getChallenge(id) {
        this.communities = this.http.get(this.url + '/Challenge?query=' + id + '&fmt=json');
        return this.communities
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(this.handleError('getChallenge', [])));
    }
    /**
     * error handleing
     */
    handleError(operation = 'operation', result) {
        return (error) => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(result);
        };
    }
};
ScientificService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"] }
];
ScientificService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]])
], ScientificService);



/***/ })

}]);
//# sourceMappingURL=scientific-scientific-module-es2015.js.map