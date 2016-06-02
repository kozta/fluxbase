import Firebase from 'firebase';

export class Store {
    constructor(config) {
        this.app = Firebase.initializeApp(config, 'store' + (new Date()).getTime());
        this.database = this.app.database();
        this.ref = this.database.ref.bind(this.database);
        
        this.handlers = [];
    }
    
    register(callback) {
        this.handlers.push(callback);
    }
    
    unregister(callback) {
        this.handlers = this.handlers.filter(handler => (handler !== callback));
    }
    
    dispatch(action) {
        this.handlers.forEach(handler => handler(action));
    }
}