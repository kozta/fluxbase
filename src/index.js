import Firebase from 'firebase';
import { EventEmitter } from 'events';

/** Class representing the dispatcher in the Flux architecture */
class Fluxbase extends EventEmitter {
    /**
     * Create a Fluxbase object
     */
    constructor() {
        super();
        this._stores = [];
    } // END constructor
    
    /**
     * Broadcast an action to all Stores
     * @param {Object} action      - The action object
     * @param {string} action.type - The type of the action
     * @param {*=}     action.data - Additional data for the action
     */
    dispatch(action) {
        if ('type' in (action || {})) {
            this._stores.forEach(store => { store.emit(action.type, action.data || null) });
        } else {
            throw new Error('Dispatched actions must have the `type` property.');
        }
    } // END dispatch
    
    /**
     * Create a new Store and register it for broadcasts
     * @param {(Object|Firebase.app.App)} obj - The initializer of the Store
     */
    createStore(obj) {
        let store = new Store(obj);
        this._stores.push(store);
        return store;
    } // END createStore
}

/**  Class representing the store in the Flux architecture */
class Store extends EventEmitter {
    /**
     * Create a Store object
     * @param {(Object|Firebase.app.App)} obj - The initializer of the Store
     */
    constructor(obj) {
        super();
        this._isConnected = undefined;
        this.init(obj);
    } // END constructor
    
    // init :: object? -> void
    /**
     * Initialize the Store
     * Should be called only on an uninitialized Store
     * @param {(Object|Firebase.app.App)=} obj - The initializer of the Store
     */
    init(obj) {
        this._isInit = false;
        
        if (obj !== undefined) { 
            // Setting up Firebase app
            if (obj instanceof Firebase.app) {
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

// Module export: the Flux dispatcher
export default new Fluxbase();