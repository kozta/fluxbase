'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dispatcher = Dispatcher;

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Dispatcher() {
  var _this = this;

  this.stream = new _rx2.default.Subject();
  this.dispatch = function (payload) {
    _this.stream.onNext(payload);
  };
};

exports.default = Dispatcher;