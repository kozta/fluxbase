'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = exports.Dispatcher = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _nedb = require('nedb');

var _nedb2 = _interopRequireDefault(_nedb);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing the dispatcher in the Flux architecture
 * @property {external:Observable} stream The stream of actions emitted by the Dispatcher
 * @extends {external:EventEmitter}
 */
var Dispatcher = function (_EventEmitter) {
    _inherits(Dispatcher, _EventEmitter);

    /**
     * Create a Dispatcher object
     *
     * @constructor
     */
    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        var _this = _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).call(this));

        _this.stream = _rx2.default.Observable.fromEvent(_this, 'action').filter(function (action) {
            return action !== null && (typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object';
        }).filter(function (action) {
            return 'type' in action;
        });
        return _this;
    } // END constructor

    /**
     * Send an action to the action stream
     *
     * @param {object} action      - The action object
     * @param {string} action.type - The type of the action
     * @param {*=}     action.data - Additional data for the action
     * @example
     * ```js
     * dispatcher.dispatch({
     *   type: 'next'
     * });
     * ```
     */


    _createClass(Dispatcher, [{
        key: 'dispatch',
        value: function dispatch(action) {
            this.emit('action', action);
        } // END dispatch

    }]);

    return Dispatcher;
}(_events.EventEmitter);

/**
 * Class representing the store in the Flux architecture
 *
 * @property {object} remote - Access to the remote database
 * @property {object} local  - Access to the local database
 * @extends {external:EventEmitter}
 * @fires Store#connect
 * @fires Store#disconnect
 * @fires Store#reconnect
 */


var Store = function (_EventEmitter2) {
    _inherits(Store, _EventEmitter2);

    /**
     * Create a Store object.
     *
     * @constructor
     * @param {(object|external:App)} obj - The initializer of the Store
     * @example
     * With an object literal:
     * ```js
     * var store = new Store({
     *   apiKey: "<your-api-key>",
     *   databaseURL: "<your-database-url>"
     * });
     * ```
     *
     * With a Firebase.app object:
     * ```js
     * var app = Firebase.initializeApp({
     *   apiKey: "<your-api-key>",
     *   databaseURL: "<your-database-url>",
     *}, 'appname');
     *
     * var store = new Store(app);
     * ```
     */
    function Store(obj) {
        _classCallCheck(this, Store);

        var _this2 = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this));

        _this2._isConnected = undefined;
        _this2.init(obj);
        return _this2;
    } // END constructor

    /**
     * Initialize an uninitialized Store.
     * Should be called only on an uninitialized Store.
     *
     * @param {(object|external:App)=} obj - The initializer of the Store
     * @example
     * ```js
     * var store = new Store(); // Uninitialized Store
     * store.init({
     *   apiKey: "<your-api-key>",
     *   databaseURL: "<your-database-url>",
     * });
     * ```
     */


    _createClass(Store, [{
        key: 'init',
        value: function init(obj) {
            var _this3 = this;

            this._isInit = false;

            /**
             * Trim the starting `/` character from a string
             *
             * @private
             * @param {string} str The string to be trimmed
             */
            this._trim = function (str) {
                return str[0] == '/' ? str.substr(1) : str;
            };

            // Setting up remote storage option
            if (obj !== undefined) {
                // Setting up Firebase app
                if (['apiKey', 'databaseURL'].every(function (prop) {
                    return prop in obj;
                })) {
                    this._app = _firebase2.default.initializeApp(obj, 'store' + new Date().getTime());
                } else {
                    this._app = obj;
                }

                // Creating an alias for the database
                this._database = this._app.database();

                /**
                 * Access to the remote database
                 * @type {object}
                 */
                this.remote = {};

                /**
                 * Make a reference to the remote database
                 *
                 * @type {external:Reference}
                 */
                this.remote.ref = this._database.ref.bind(this._database);

                /**
                 * Get a value from the remote database asyncronously and pass it to the provided
                 * callback
                 *
                 * @param {string} endpoint   - Path to the database endpoint
                 * @param {function} callback - Callback function to handle return value
                 * @example
                 * Get a single value and log it
                 * ```js
                 * store.remote.get('/path/to/endpoint', function (value) {
                 *   console.log(value);
                 * });
                 * ```
                 */
                this.remote.get = function (endpoint, callback) {
                    _this3.remote.ref(endpoint).once('value', function (snapshot) {
                        callback(snapshot.val());
                    });
                }; // END this.remote.get

                /**
                 * Set a value in the remote database at a specific endpoint
                 *
                 * @param {string} endpoint - Path to the database endpoint
                 * @param value             - The new value for the endpoint
                 * @example
                 * Simple use
                 * ```js
                 * store.remote.set('/path/to/endpoint', value);
                 * ```
                 *
                 * Combined with connect
                 * ```js
                 * var obj = {
                 *   value: 1
                 * };
                 *
                 * store.remote.connect('/path/to/endpoint', obj, 'value');
                 *
                 * store.remote.set('/path/to/endpoint', 2);
                 * // obj.value will change to `2`
                 * ```
                 */
                this.remote.set = function (endpoint, value) {
                    _this3.remote.ref(endpoint).set(value);
                }; // END this.remote.set

                /**
                 * Connect (bind) a remote database endpoint to an object property or a callback function
                 *
                 * @param {string} endpoint           - Path to the database endpoint
                 * @param {(object|function)} handler - Object the property of which to use / A single parameter
                 *                                      function to handle the value change
                 * @param {string=} property          - Name of the property of the local variable to use
                 * @example
                 * With an object property:
                 * ```js
                 * var data = {}
                 *
                 * store.remote.connect('/path/to/endpoint', data, 'property');
                 * ```
                 *
                 * With a callback function:
                 * ```js
                 * var obj = {
                 *   data: {},
                 *   set(value) {
                 *     this.data = value;
                 *   }
                 * };
                 *
                 * store.remote.connect('/path/to/endpoint', obj.set.bind(obj));
                 * ```
                 */
                this.remote.connect = function (endpoint, handler) {
                    var property = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                    _this3.remote.ref(endpoint).on('value', function (snapshot) {
                        if (handler instanceof Function && handler !== null) {
                            handler(snapshot.val());
                        } else if (handler !== null && (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' && property !== null) {
                            handler[property] = snapshot.val();
                        } else {
                            throw new Error('Invalid parameters passed for Store.remote.connect');
                        }
                    });
                }; // END this.remote.connect

                // Watching connection state
                this._connectionRef = this.remote.ref(".info/connected");
                this._connectionRef.on("value", function (snap) {
                    if (snap.val() === true) {
                        _this3.emit(_this3._isConnected === undefined ? 'connect' : 'reconnect');
                        _this3._isConnected = true;
                    } else {
                        _this3.emit('disconnect');
                        _this3._isConnected = false;
                    }
                }); // END this._connectionRef.on

                // Setting initialization status
                this._isInit = true;
            } // END Remote storage setup

            // Setting up local storage option
            {
                /**
                 * Access to the local database
                 * @type {object}
                 */
                this.local = {
                    _data: {},
                    _handlers: {}
                }; // END this.local

                /**
                 * Access a deep property of an object
                 *
                 * @private
                 * @param {object} object The object to access the deep property of
                 * @param {Array} path Array of property names for the deep access
                 * @return {object} Object literal with the closesest object node and the last property name
                 */
                this.local._access = function (object, path) {
                    var property = path.shift();
                    if (path.length == 0) {
                        return {
                            object: object,
                            property: property
                        };
                    } else {
                        if (!object.hasOwnProperty(property)) {
                            object[property] = {};
                        }
                        return _this3.local._access(object[property], path);
                    }
                }; // END this.local._access

                /**
                 * Convert a deep property path string into an Array of property names
                 *
                 * @private
                 * @param {string} path Path to the deep property in `/path/to/property` format
                 * @return {Array} Array of property names for the deep access
                 */
                this.local._convertPath = function (path) {
                    return path instanceof Array ? path : _this3._trim(path).split('/');
                };

                /**
                 * Resolve a handler with a given value
                 *
                 * @private
                 * @param {(Array|function)} handler - The handler function or object - property pair
                 * @param value                      - The value to use for resolving
                 */
                this.local._handle = function (handler, value) {
                    if (handler instanceof Function) {
                        // Run handler function
                        handler(value);
                    } else if (handler instanceof Array) {
                        // Update object value
                        handler[0][handler[1]] = value;
                    }
                };

                /**
                 * Get a value from the local database and pass it to the provided callback
                 *
                 * @param {string} endpoint   - Path to the database endpoint
                 * @param {function} callback - Callback function to handle return value
                 * @example
                 * Get a single value and log it
                 * ```js
                 * store.local.get('/path/to/endpoint', function (value) {
                 *   console.log(value);
                 * });
                 * ```
                 */
                this.local.get = function (endpoint, callback) {
                    var _local$_access = _this3.local._access(_this3.local._data, _this3.local._convertPath(endpoint)),
                        object = _local$_access.object,
                        property = _local$_access.property;

                    callback(object[property]);
                }; // END this.local.get

                /**
                 * Set a value in the local database at a specific endpoint
                 *
                 * @param {string} endpoint - Path to the database endpoint
                 * @param value             - The new value for the endpoint
                 * @example
                 * Simple use
                 * ```js
                 * store.local.set('/path/to/endpoint', value);
                 * ```
                 *
                 * Combined with connect
                 * ```js
                 * var obj = {
                 *   value: 1
                 * };
                 *
                 * store.local.connect('/path/to/endpoint', obj, 'value');
                 *
                 * store.local.set('/path/to/endpoint', 2);
                 * // obj.value will change to `2`
                 * ```
                 */
                this.local.set = function (endpoint, value) {
                    endpoint = _this3._trim(endpoint);

                    var _local$_access2 = _this3.local._access(_this3.local._data, _this3.local._convertPath(endpoint)),
                        object = _local$_access2.object,
                        property = _local$_access2.property;

                    object[property] = value;

                    var handlers = _this3.local._handlers[endpoint];
                    if (handlers instanceof Set) {
                        handlers.forEach(function (handler) {
                            return _this3.local._handle(handler, value);
                        });
                    }
                }; // END this.local.set

                /**
                 * Connect (bind) a local database endpoint to an object property or a callback function
                 *
                 * @param {string} endpoint           - Path to the database endpoint
                 * @param {(object|function)} handler - Object the property of which to use / A single parameter
                 *                                      function to handle the value change
                 * @param {string=} property          - Name of the property of the local variable to use
                 * @example
                 * With an object property:
                 * ```js
                 * var data = {}
                 *
                 * store.local.connect('/path/to/endpoint', data, 'property');
                 * ```
                 *
                 * With a callback function:
                 * ```js
                 * var obj = {
                 *   data: {},
                 *   set(value) {
                 *     this.data = value;
                 *   }
                 * };
                 *
                 * store.local.connect('/path/to/endpoint', obj.set.bind(obj));
                 * ```
                 */
                this.local.connect = function (endpoint, handler) {
                    var property = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                    endpoint = _this3._trim(endpoint);
                    if (_this3.local._handlers[endpoint] === undefined) {
                        _this3.local._handlers[endpoint] = new Set();
                    }
                    if (handler instanceof Function && handler !== null) {
                        _this3.local._handlers[endpoint].add(handler);
                    } else if (handler !== null && (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' && property !== null) {
                        _this3.local._handlers[endpoint].add([handler, property]);
                    } else {
                        throw new Error('Invalid parameters passed for Store.local.connect');
                    }
                    _this3.local.get(endpoint, function (value) {
                        _this3.local._handlers[endpoint].forEach(function (handler) {
                            return _this3.local._handle(handler, value);
                        });
                    });
                }; // END this.local.connect
            } // END Local storage setup
        } // END init

        /**
         * Create an Observer object to pass for the Observable.subscribe method
         *
         * @param {function} onNext      - A function to handle the incoming action on the stream
         * @param {function=} onError    - A function to handle errors on the action stream
         * @param {function=} onComplete - A function to handle the completion of the stream
         * @return {external:Observer}   - The Observer object to handle incoming actions
         * @example
         * ```js
         * dispatcher.stream.subscribe(store.createObserver(action => {
         *   console.log('Action recieved');
         * }));
         * ```
         */

    }, {
        key: 'createObserver',
        value: function createObserver(onNext) {
            var onError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (err) {
                throw new Error(err);
            };
            var onComplete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

            return _rx2.default.Observer.create(onNext.bind(this), onError.bind(this), onComplete.bind(this));
        } // END createObserver

    }]);

    return Store;
}(_events.EventEmitter);

exports.Dispatcher = Dispatcher;
exports.Store = Store;

/**
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */

/**
 * @external Observable
 * @see https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md
 */

/**
 * @external Observer
 * @see https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md
 */

/**
 * @external App
 * @see https://firebase.google.com/docs/reference/js/firebase.app.App
 */

/**
 * @external Reference
 * @see https://firebase.google.com/docs/reference/js/firebase.database.Reference
 */