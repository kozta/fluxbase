import chai from 'chai';
import sinon from 'sinon';
import { Observable } from 'rxjs';

import { Store } from './index';

chai.should();

describe('Store', () => {
    let store;

    beforeEach(() => {
        store = new Store;
    });

    it('should have all required properties', () => {
        store.should.have.property('link').that.is.an('undefined');
        store.should.have.property('type').that.is.an('undefined');
    });

    it('should have `get`, `set` and `sync` methods', () => {
        store.should.have.property('get').that.is.a('function');
        store.should.have.property('set').that.is.a('function');
        store.should.have.property('sync').that.is.a('function');
    });

    it('should have dispatcher methods and properties `stream`, `dispatch`', () => {
        store.should.have.property('stream').that.is.instanceof(Observable);
        store.should.have.property('dispatch').that.is.a('function');
    });

    it('should call all Observers', () => {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        
        store.stream.subscribe(() => { spy1(); });
        store.stream.subscribe(() => { spy2(); });
        
        store.dispatch();
        
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });

    it('should send the `action` and `store` object to the observer', () => {
        const action = {};
        store.stream.subscribe(({store: s, action: a}) => {
            s.should.equal(store);
            a.should.equal(action);
        });
        
        store.dispatch(action);
    });
});