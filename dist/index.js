'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.createDispatcher = undefined;

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createDispatcher = _dispatcher2.default;
exports.createStore = _store2.default;
exports.default = { createDispatcher: _dispatcher2.default, createStore: _store2.default };