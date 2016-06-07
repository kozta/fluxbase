import Firebase from 'firebase';
import EventEmitter from 'events';

export class Store extends EventEmitter {
    constructor(initializer) {
        super();
        this.initialize(initializer);
        this.isConnected = undefined;
        this.handlers = [];
    }
    
    initialize(initializer) {
        if (initializer !== undefined) { 
            // Initializing Firebase.app.App
            if (initializer instanceof Firebase.app) {
                this.app = initializer;
            } else if (typeof initializer === 'object') {
                this.app = Firebase.initializeApp(initializer, 'store' + (new Date()).getTime());
            }
            
            // Setting up database connection
            this.database = this.app.database();
            this.ref = this.database.ref.bind(this.database);
            
            // Watching connection state
            this.connectionRef = this.ref(".info/connected");
            this.connectionRef.on("value", snap => {
              if (snap.val() === true) {
                this.emit(this.isConnected === undefined ? 'connect' : 'reconnect');
                this.isConnected = true;
              } else {
                this.emit('disconnect');
                this.isConnected = false;
              }
            });
            
            
            // Setting initialization
            this.initialized = true;
        } else {
            // Setting initialization
            this.initialized = false;
        }
    }
    
    register(callback) {
        this.handlers.push(callback);
    }
    
    unregister(callback) {
        this.handlers = this.handlers.filter(handler => (handler !== callback));
    }
    
    dispatch(action) {
        if (!this.initialized) {
            throw new Error('Dispatching action to uninitialized store');
        }
        this.handlers.forEach(handler => handler(action));
    }
}