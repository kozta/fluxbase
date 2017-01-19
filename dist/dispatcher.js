'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDispatcher = createDispatcher;

var _rx = require('rx');

function createDispatcher() {
  return {
    stream: new _rx.Subject(),

    dispatch: function dispatch(payload) {
      this.stream.onNext(payload);
    }
  };
};

exports.default = createDispatcher;