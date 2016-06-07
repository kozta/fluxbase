'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = exports.Store = function (_EventEmitter) {
    _inherits(Store, _EventEmitter);

    function Store(initializer) {
        _classCallCheck(this, Store);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this));

        _this.initialize(initializer);
        _this.isConnected = undefined;
        _this.handlers = [];
        return _this;
    }

    _createClass(Store, [{
        key: 'initialize',
        value: function initialize(initializer) {
            var _this2 = this;

            if (initializer !== undefined) {
                // Initializing Firebase.app.App
                if (initializer instanceof _firebase2.default.app) {
                    this.app = initializer;
                } else if ((typeof initializer === 'undefined' ? 'undefined' : _typeof(initializer)) === 'object') {
                    this.app = _firebase2.default.initializeApp(initializer, 'store' + new Date().getTime());
                }

                // Setting up database connection
                this.database = this.app.database();
                this.ref = this.database.ref.bind(this.database);

                // Watching connection state
                this.connectionRef = this.ref(".info/connected");
                this.connectionRef.on("value", function (snap) {
                    if (snap.val() === true) {
                        _this2.emit(_this2.isConnected === undefined ? 'connect' : 'reconnect');
                        _this2.isConnected = true;
                    } else {
                        _this2.emit('disconnect');
                        _this2.isConnected = false;
                    }
                });

                // Setting initialization
                this.initialized = true;
            } else {
                // Setting initialization
                this.initialized = false;
            }
        }
    }, {
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
            if (!this.initialized) {
                throw new Error('Dispatching action to uninitialized store');
            }
            this.handlers.forEach(function (handler) {
                return handler(action);
            });
        }
    }]);

    return Store;
}(_events2.default);