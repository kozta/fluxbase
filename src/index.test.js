import chai from 'chai';
import sinon from 'sinon';
import Firebase from 'firebase';
import Fluxbase from './index';

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

describe('Fluxbase', () => {
   it('should not have any stores registered', () => {
       Fluxbase._stores.should.be.empty;
   }); 
});

describe('Create store', () => {
    var store;
    
    it('should create an uninitialized store object', () => {
        store = Fluxbase.createStore();
        
        store.should.not.have.property('_database');
        store.should.not.have.property('ref').that.is.a.function;;
        store._isInit.should.be.false;
    });
    
     it('should create a store using an object literal', () => {
        store = Fluxbase.createStore({});
        
        store.should.have.property('_database');
        store.should.have.property('ref').that.is.a.function;
        store._isInit.should.be.true;
    });
    
    it('should create a store using an existing Firebase object', () => {
        let app = Firebase.initializeApp({});
        store = Fluxbase.createStore(app);
        
        store.should.have.property('_database');
        store.should.have.property('ref');
        store._isInit.should.be.true;
    });
});

describe('Action dispatch', () => {
    it('should throw an error on action without type', () => {
        (() => {
            Fluxbase.dispatch({});
        }).should.throw(Error);
    });
    
    it('all Stores should emit dispatched event', () => {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        
        let store1 = Fluxbase.createStore();
        let store2 = Fluxbase.createStore();
        
        store1.on('test', spy1);
        store2.on('test', spy2);
        
        Fluxbase.dispatch({
            type: 'test'
        });
        
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});