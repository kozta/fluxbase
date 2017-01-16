'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = exports.Dispatcher = undefined;

var _Dispatcher = require('./Dispatcher');

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Dispatcher = _Dispatcher2.default;
exports.Store = _Store2.default;
exports.default = { Dispatcher: _Dispatcher2.default, Store: _Store2.default };