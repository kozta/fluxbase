import Firebase from 'firebase';

export class Store {
    constructor(initializer) {
        this.initialize(initializer);
        this.handlers = [];
    }
    
    initialize(initializer) {
        if (initializer !== undefined) { 
            if (initializer instanceof Firebase.app) {
                this.app = initializer;
            } else if (typeof initializer === 'object') {
                this.app = Firebase.initializeApp(initializer, 'store' + (new Date()).getTime());
            }
            this.database = this.app.database();
            this.ref = this.database.ref.bind(this.database);
            this.initialized = true;
        } else {
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