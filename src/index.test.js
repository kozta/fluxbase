import chai from 'chai';
import sinon from 'sinon';
import Firebase from 'firebase';
import Rx from 'rx';
import { Dispatcher, Store } from './index';

chai.should();

// Stub Firebase class
sinon.stub(Firebase, 'app', class {
    database() {
        return {
            ref: path => ({
                on: () => undefined
            })
        };
    }
});

sinon.stub(Firebase, 'initializeApp', () => {
   return new Firebase.app();
});
// END Stub

describe('Store', () => {
    var store;
    
    it('should create an uninitialized store object', () => {
        store = new Store();
        
        store.should.not.have.property('_database');
        store.should.not.have.property('remote');
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.false;
    });
    
     it('should create a store using an object literal', () => {
        store = new Store({
            apiKey: '',
            databaseURL: ''
        });
        
        store.should.have.property('_database');
        store.should.have.property('remote');
        store.remote.should.have.property('ref').that.is.a.function;
        store.remote.should.have.property('get').that.is.a.function;
        store.remote.should.have.property('set').that.is.a.function;
        store.remote.should.have.property('connect').that.is.a.function;
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.true;
    });
    
    it('should create a store using an existing Firebase object', () => {
        let app = Firebase.initializeApp({});
        store = new Store(app);
        
        store.should.have.property('_database');
        store.should.have.property('remote');
        store.remote.should.have.property('ref').that.is.a.function;
        store.remote.should.have.property('get').that.is.a.function;
        store.remote.should.have.property('set').that.is.a.function;
        store.remote.should.have.property('connect').that.is.a.function;
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.true;
    });
});

describe('Dispatcher', () => {
    var dispatcher;
    
    beforeEach(() => {
        dispatcher = new Dispatcher();
    });
    
    it('should have an action stream', () => {
        dispatcher.should.have.property('stream');
    });
    
    it('should filter out actions without `type` property', () => {
        let spy = sinon.spy();
        let observer = Rx.Observer.create(
            () => { spy(); },
            () => { spy(); },
            () => { spy(); }
        );
        
        dispatcher.stream.subscribe(observer);
        
        dispatcher.dispatch({});
        
        spy.called.should.be.false;
    });
    
    it('should send dispatched actions to all Store Observers', () => {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        
        let store1 = new Store();
        let store2 = new Store();
        
        dispatcher.stream.subscribe(store1.createObserver(
            () => { spy1(); },
            () => { spy1(); },
            () => { spy1(); }
        ));
        dispatcher.stream.subscribe(store2.createObserver(
            () => { spy2(); },
            () => { spy2(); },
            () => { spy2(); }
        ));
        
        dispatcher.dispatch({
            type: 'test'
        });
        
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});

describe('Local storage', () => {
    var store;
    
    beforeEach(() => {
        store = new Store();
    });
    
    it('should update the store on a first level property',  () => {
        store.local.set('/name', 'value');
        store.local._data.name.should.equal('value');
        store.local.get('/name', value => {
            value.should.equal('value');
        });
    });
    
    it('should update the store on a deep property', () => {
        store.local.set('/path/to/name', 'value');
        store.local._data.path.to.name.should.equal('value');
        store.local.get('/path/to/name', value => {
            value.should.equal('value');
        });
    });
    
    it('should update connected properties', () => {
        let data = {};
        store.local.connect('/name', data, 'name1');
        store.local.connect('/name', data, 'name2');
        store.local.set('/name', 'value');
        data.name1.should.equal('value');
        data.name2.should.equal('value');
    });
    
    it('should call connected handlers', () => {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        store.local.connect('/name', spy1);
        store.local.connect('/name', spy2);
        store.local.set('/name', 'value');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
    
    it('should handle all connected handlers and properties', () => {
        let data = {};
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        store.local.connect('/name', spy1);
        store.local.connect('/name', spy2);
        store.local.connect('/name', data, 'name1');
        store.local.connect('/name', data, 'name2');
        store.local.set('/name', 'value');
        data.name1.should.equal('value');
        data.name2.should.equal('value');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});