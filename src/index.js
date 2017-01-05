import Firebase from 'firebase';
import NeDB from 'nedb';
import Rx from 'rx';
import { EventEmitter } from 'events';

/**
 * Class representing the dispatcher in the Flux architecture
 * @property {external:Observable} stream The stream of actions emitted by the Dispatcher
 * @extends {external:EventEmitter}
 */
class Dispatcher extends EventEmitter {
    /**
     * Create a Dispatcher object
     *
     * @constructor
     */
    constructor() {
        super();
        this.stream = Rx.Observable.fromEvent(this, 'action')
            .filter(action => action !== null && typeof(action) === 'object')
            .filter(action => 'type' in action);
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
    dispatch(action) {
        this.emit('action', action);
    } // END dispatch
}

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
class Store extends EventEmitter {
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
     constructor(obj) {
        super();
        this._isConnected = undefined;
        this.init(obj);
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
    init(obj) {
        this._isInit = false;

        /**
         * Trim the starting `/` character from a string
         *
         * @private
         * @param {string} str The string to be trimmed
         */
        this._trim = str => (str[0] == '/') ? str.substr(1) : str;

        // Setting up remote storage option
        if (obj !== undefined) {
            // Setting up Firebase app
            if (['apiKey', 'databaseURL'].every(prop => prop in obj)) {
                this._app = Firebase.initializeApp(obj, 'store' + (new Date()).getTime());
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
            this.remote.get = (endpoint, callback) => {
                this.remote.ref(endpoint).once('value', snapshot => {
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
            this.remote.set = (endpoint, value) => {
                this.remote.ref(endpoint).set(value);
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
            this.remote.connect = (endpoint, handler, property = null) => {
                this.remote.ref(endpoint).on('value', snapshot => {
                    if (handler instanceof Function && handler !== null) {
                        handler(snapshot.val());
                    } else if (handler !== null && typeof(handler) === 'object' && property !== null) {
                        handler[property] = snapshot.val();
                    } else {
                        throw new Error('Invalid parameters passed for Store.remote.connect');
                    }
                });
            }; // END this.remote.connect

            // Watching connection state
            this._connectionRef = this.remote.ref(".info/connected");
            this._connectionRef.on("value", snap => {
              if (snap.val() === true) {
                this.emit(this._isConnected === undefined ? 'connect' : 'reconnect');
                this._isConnected = true;
              } else {
                this.emit('disconnect');
                this._isConnected = false;
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
            this.local._access = (object, path) => {
                let property = path.shift();
                if (path.length == 0) {
                    return {
                        object,
                        property
                    };
                } else {
                    if (!object.hasOwnProperty(property)) {
                        object[property] = {};
                    }
                    return this.local._access(object[property], path);
                }
            }; // END this.local._access

            /**
             * Convert a deep property path string into an Array of property names
             *
             * @private
             * @param {string} path Path to the deep property in `/path/to/property` format
             * @return {Array} Array of property names for the deep access
             */
            this.local._convertPath = path => (path instanceof Array) ? path : this._trim(path).split('/');

            /**
             * Resolve a handler with a given value
             *
             * @private
             * @param {(Array|function)} handler - The handler function or object - property pair
             * @param value                      - The value to use for resolving
             */
            this.local._handle = (handler, value) => {
                if (handler instanceof Function) {
                    // Run handler function
                    handler(value);
                } else if (handler instanceof Array) {
                    // Update object value
                    handler[0][handler[1]] = value;
                }
            }

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
            this.local.get = (endpoint, callback) => {
                let {object, property} = this.local._access(this.local._data,
                                                            this.local._convertPath(endpoint));
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
            this.local.set = (endpoint, value) => {
                endpoint = this._trim(endpoint);
                let {object, property} = this.local._access(this.local._data,
                                                            this.local._convertPath(endpoint));
                object[property] = value;

                let handlers = this.local._handlers[endpoint];
                if (handlers instanceof Set) {
                    handlers.forEach(handler => this.local._handle(handler, value));
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
            this.local.connect = (endpoint, handler, property = null) => {
                endpoint = this._trim(endpoint);
                if (this.local._handlers[endpoint] === undefined) {
                    this.local._handlers[endpoint] = new Set();
                }
                if (handler instanceof Function && handler !== null) {
                    this.local._handlers[endpoint].add(handler);
                } else if (handler !== null && typeof(handler) === 'object' && property !== null) {
                    this.local._handlers[endpoint].add([handler, property]);
                } else {
                    throw new Error('Invalid parameters passed for Store.local.connect');
                }
                this.local.get(endpoint, value => {
                    this.local._handlers[endpoint].forEach(handler => this.local._handle(handler, value));
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
    createObserver(onNext, onError = err => { throw new Error(err) }, onComplete = () => {}) {
        return Rx.Observer.create(onNext.bind(this), onError.bind(this), onComplete.bind(this));
    } // END createObserver
}

export { Dispatcher };
export { Store };

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
