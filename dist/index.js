'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** 
 * Class representing the dispatcher in the Flux architecture
 * @extends {external:EventEmitter}
 */

var Fluxbase = function (_EventEmitter) {
    _inherits(Fluxbase, _EventEmitter);

    /**
     * Create a Fluxbase object. (Should not be called. The module exports an instance.)
     * 
     * @constructor
     */

    function Fluxbase() {
        _classCallCheck(this, Fluxbase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Fluxbase).call(this));

        _this._stores = [];
        return _this;
    } // END constructor

    /**
     * Broadcast an action to all Stores.
     * 
     * @param {Object} action      - The action object
     * @param {string} action.type - The type of the action
     * @param {*=}     action.data - Additional data for the action
     * @exception {Error} Will throw an error if the action parameter has no `type` property
     * @example
     * ```js
     * Fluxbase.dispatch({
     *   type: 'next'
     * });
     * ```
     */


    _createClass(Fluxbase, [{
        key: 'dispatch',
        value: function dispatch(action) {
            if ('type' in (action || {})) {
                this._stores.forEach(function (store) {
                    store.emit(action.type, action.data || null);
                });
            } else {
                throw new Error('Dispatched actions must have the `type` property.');
            }
        } // END dispatch

        /**
         * Create a new Store and register it for broadcasts.
         * 
         * @access public
         * @param {(Object|Firebase.app)=} obj - The initializer of the Store
         * @return {Store} A new Store object
         * @example
         * With an object literal:
         * ```js
         * var store = Fluxbase.createStore({
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
         * var store = Fluxbase.createStore(app);
         * ```
         */

    }, {
        key: 'createStore',
        value: function createStore(obj) {
            var store = new Store(obj);
            this._stores.push(store);
            return store;
        } // END createStore

    }]);

    return Fluxbase;
}(_events.EventEmitter);

/** 
 * Class representing the store in the Flux architecture 
 * @extends {external:EventEmitter}
 * @fires Store#connect
 * @fires Store#disconnect
 * @fires Store#reconnect
 */


var Store = function (_EventEmitter2) {
    _inherits(Store, _EventEmitter2);

    /**
     * Create a Store object. (Should not be used. Use {@link Fluxbase#createStore} instead.)
     * 
     * @constructor
     * @param {(Object|Firebase.app.App)} obj - The initializer of the Store
     */

    function Store(obj) {
        _classCallCheck(this, Store);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this));

        _this2._isConnected = undefined;
        _this2.init(obj);
        return _this2;
    } // END constructor

    /**
     * Initialize an uninitialized Store.
     * Should be called only on an uninitialized Store.
     * @param {(Object|Firebase.app.App)=} obj - The initializer of the Store
     * @example
     * ```js
     * var store = Fluxbase.createStore(); // Uninitialized Store
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

            if (obj !== undefined) {
                // Setting up Firebase app
                if (obj instanceof _firebase2.default.app.App) {
                    this._app = obj;
                } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
                    this._app = _firebase2.default.initializeApp(obj, 'store' + new Date().getTime());
                }

                this._database = this._app.database();
                this.ref = this._database.ref.bind(this._database);

                // Watching connection state
                this._connectionRef = this.ref(".info/connected");
                this._connectionRef.on("value", function (snap) {
                    if (snap.val() === true) {
                        _this3.emit(_this3._isConnected === undefined ? 'connect' : 'reconnect');
                        _this3._isConnected = true;
                    } else {
                        _this3.emit('disconnect');
                        _this3._isConnected = false;
                    }
                });

                // Setting initialization status
                this._isInit = true;
            }
        } // END init

    }]);

    return Store;
}(_events.EventEmitter);

exports.default = new Fluxbase();

/**
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */