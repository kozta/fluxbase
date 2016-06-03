import chai from 'chai';
import { Store } from './index';

chai.should();

describe('Create store', () => {
    var store;
    
    it('should create an uninitialized store object', () => {
        store = new Store();
        
        store.should.not.have.property('database');
        store.should.not.have.property('ref');
        store.initialized.should.be.flase;
        store.handlers.should.be.an('array').that.is.empty;
    });
});

describe('Action handlers', () => {
    var store;
    var handler = action => null;
    
    beforeEach(() => {
        store = new Store();
    });
    
    it('should register an action handler', () => {
        store.register(handler);
        store.handlers.should.be.an('array').that.has.lengthOf(1);
        store.handlers.should.include(handler);
    });
    
    it('should unregister an action handler', () => {
        store.register(handler);
        store.unregister(handler);
        store.handlers.should.be.an('array').that.is.empty;
        store.handlers.should.not.not.include(handler);
    });
});

describe('Event dispatch', () => {
    it('should throw an error on uninitialized store', () => {
        var store = new Store();
        
        (() => {
            store.dispatch(null);
        }).should.throw(Error);
    });
    
    it('should call all registered handlers', () => {
        var store = new Store();
        store.initialized = true;
        
        var ids = [1, 2, 3, 4, 5];
        
        function handlerFactory(id) {
            return action => {ids = ids.filter(elem => elem !== id)};
        }
        
        ids.forEach(id => {
            store.register(handlerFactory(id));
        });
        
        store.dispatch(null);
        
        ids.should.be.empty;
    });
});