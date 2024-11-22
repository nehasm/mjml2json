#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));
var _commander = _interopRequireDefault(require("commander"));
var _mjml2json = _interopRequireDefault(require("./mjml2json"));
var _package = require("../package.json");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
_commander["default"].version(_package.version).usage('[options] <input-file> <output-file>').option('-s, --stringify', 'Stringify output').parse(process.argv);
if (_commander["default"].args.length !== 2) {
  _commander["default"].outputHelp();
  process.exit(1);
}
var _program$args = _slicedToArray(_commander["default"].args, 2),
  inputFilename = _program$args[0],
  outputFilename = _program$args[1];
var input = _fs["default"].readFileSync(inputFilename, 'utf8');
var opts = {
  stringify: !!_commander["default"].stringify
};
var output = (0, _mjml2json["default"])(input, opts);
_fs["default"].writeFileSync(outputFilename, JSON.stringify(output));
var stringified = opts.stringify ? ' (stringified)' : '';
console.log("".concat(inputFilename, " was converted to JSON format in ").concat(outputFilename).concat(stringified)); // eslint-disable-line no-console