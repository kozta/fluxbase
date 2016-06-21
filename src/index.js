import Firebase from 'firebase';
import { EventEmitter } from 'events';

/** 
 * Class representing the dispatcher in the Flux architecture
 * @extends {external:EventEmitter}
 */
class Fluxbase extends EventEmitter {
    /**
     * Create a Fluxbase object. (Should not be called. The module exports an instance.)
     * 
     * @constructor
     */
    constructor() {
        super();
        this._stores = [];
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
    dispatch(action) {
        if ('type' in (action || {})) {
            this._stores.forEach(store => { store.emit(action.type, action.data || null) });
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
    createStore(obj) {
        let store = new Store(obj);
        this._stores.push(store);
        return store;
    } // END createStore
}

/** 
 * Class representing the store in the Flux architecture 
 * @extends {external:EventEmitter}
 * @fires Store#connect
 * @fires Store#disconnect
 * @fires Store#reconnect
 */
class Store extends EventEmitter {
    /**
     * Create a Store object. (Should not be used. Use {@link Fluxbase#createStore} instead.)
     * 
     * @constructor
     * @param {(Object|Firebase.app.App)} obj - The initializer of the Store
     */
    constructor(obj) {
        super();
        this._isConnected = undefined;
        this.init(obj);
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
    init(obj) {
        this._isInit = false;
        
        if (obj !== undefined) { 
            // Setting up Firebase app
            if (obj instanceof Firebase.app.App) {
                this._app = obj;
            } else if (typeof obj === 'object') {
                this._app = Firebase.initializeApp(obj, 'store' + (new Date()).getTime());
            }
            
            this._database = this._app.database();
            this.ref = this._database.ref.bind(this._database);
            
            // Watching connection state
            this._connectionRef = this.ref(".info/connected");
            this._connectionRef.on("value", snap => {
              if (snap.val() === true) {
                this.emit(this._isConnected === undefined ? 'connect' : 'reconnect');
                this._isConnected = true;
              } else {
                this.emit('disconnect');
                this._isConnected = false;
              }
            });
            
            // Setting initialization status
            this._isInit = true;
        }
    } // END init
}

export default new Fluxbase();

/**
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */