'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = exports.Store = function () {
    function Store(config) {
        _classCallCheck(this, Store);

        this.app = _firebase2.default.initializeApp(config, 'store' + new Date().getTime());
        this.database = this.app.database();
        this.ref = this.database.ref.bind(this.database);

        this.handlers = [];
    }

    _createClass(Store, [{
        key: 'register',
        value: function register(callback) {
            this.handlers.push(callback);
        }
    }, {
        key: 'unregister',
        value: function unregister(callback) {
            this.handlers = this.handlers.filter(function (handler) {
                return handler !== callback;
            });
        }
    }, {
        key: 'dispatch',
        value: function dispatch(action) {
            this.handlers.forEach(function (handler) {
                return handler(action);
            });
        }
    }]);

    return Store;
}();