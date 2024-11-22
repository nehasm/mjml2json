"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = mjml2json;
var _lodash = _interopRequireDefault(require("lodash"));
var htmlparser = _interopRequireWildcard(require("htmlparser2"));
var _mjmlCore = require("mjml-core");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*import './register-mjml'*/

var CDATASections = [];
var MJElements = [];
_lodash["default"].forEach(_objectSpread({}, _mjmlCore.globalComponents), function (element, name) {
  var tagName = element.tagName || name;
  if (element.endingTag) {
    CDATASections.push(tagName);
  }
  MJElements.push(tagName);
});
function cleanNode(node) {
  delete node.parent;

  // delete children if needed
  if (node.children.length) {
    node.children.forEach(cleanNode);
  } else {
    delete node.children;
  }

  // delete attributes if needed
  if (Object.keys(node.attributes).length === 0) {
    delete node.attributes;
  }
}

/**
 * Avoid htmlparser to parse ending tags
 */
function addCDATASection(content) {
  var regexTag = function regexTag(tag) {
    return new RegExp("<".concat(tag, "([^>/]*)>([^]*?)</").concat(tag, ">"), 'gmi');
  };
  var replaceTag = function replaceTag(tag) {
    return "<".concat(tag, "$1><![CDATA[$2]]></").concat(tag, ">");
  };
  _lodash["default"].forEach(CDATASections, function (tag) {
    content = content.replace(regexTag(tag), replaceTag(tag));
  });
  return content;
}
function parseAttributes(content) {
  var regexTag = function regexTag(tag) {
    return new RegExp("<".concat(tag, "(\\s(\"[^\"]*\"|'[^']*'|[^'\">])*)?>"), 'gmi');
  };
  var regexAttributes = /(\S+)\s*?=\s*(['"])(.*?|)\2/gim;
  _lodash["default"].forEach(MJElements, function (tag) {
    content = content.replace(regexTag(tag), function (contentTag) {
      return contentTag.replace(regexAttributes, function (match, attr, around, value) {
        return "".concat(attr, "=").concat(around).concat(encodeURIComponent(value)).concat(around);
      });
    });
  });
  return content;
}

/**
 * Convert "true" and "false" string attributes values
 * to corresponding Booleans
 */
function convertBooleansOnAttrs(attrs) {
  return _lodash["default"].mapValues(attrs, function (val) {
    if (val === 'true') {
      return true;
    }
    if (val === 'false') {
      return false;
    }
    return val;
  });
}
function setEmptyAttributes(node) {
  if (!node.attributes) {
    node.attributes = {};
  }
  if (node.children) {
    node.children.forEach(setEmptyAttributes);
  }
}
function parseMjml(xml) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$addEmptyAttribut = _ref.addEmptyAttributes,
    addEmptyAttributes = _ref$addEmptyAttribut === void 0 ? true : _ref$addEmptyAttribut,
    _ref$convertBooleans = _ref.convertBooleans,
    convertBooleans = _ref$convertBooleans === void 0 ? true : _ref$convertBooleans;
  if (!xml) {
    return null;
  }
  var safeXml = xml;
  safeXml = parseAttributes(safeXml);
  safeXml = addCDATASection(safeXml);
  var mjml = null;
  var cur = null;
  var parser = new htmlparser.Parser({
    onopentag: function onopentag(name, attrs) {
      attrs = _lodash["default"].mapValues(attrs, function (val) {
        return decodeURIComponent(val);
      });
      if (convertBooleans) {
        // "true" and "false" will be converted to bools
        attrs = convertBooleansOnAttrs(attrs);
      }
      var newNode = {
        parent: cur,
        tagName: name,
        attributes: attrs,
        children: []
      };
      if (cur) {
        cur.children.push(newNode);
      } else {
        mjml = newNode;
      }
      cur = newNode;
    },
    onclosetag: function onclosetag() {
      cur = cur && cur.parent || null;
    },
    ontext: function ontext(text) {
      if (!text) {
        return;
      }
      var val = "".concat(cur && cur.content || '').concat(text).trim();
      if (val) {
        cur.content = val.replace('$', '&#36;'); // prevent issue with $ sign in MJML
      }
    }
  }, {
    xmlMode: true
  });
  parser.write(safeXml);
  parser.end();
  if (!_lodash["default"].isObject(mjml)) {
    throw new Error('Parsing failed. Check your mjml.');
  }
  cleanNode(mjml);

  // assign "attributes" property if not set
  if (addEmptyAttributes) {
    setEmptyAttributes(mjml);
  }
  return mjml;
}
function mjml2json(input) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var json = parseMjml(input, opts);
  if (opts.stringify) {
    json = JSON.stringify(json);
  }
  return json;
}