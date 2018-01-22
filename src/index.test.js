import chai from 'chai';
import Rx from 'rx';

import { Store } from './index';

chai.should();

describe('Store', () => {
    let store;

    beforeEach(() => {
        store = new Store;
    });

    it('should have all required methods and properties', () => {
        store.should.have.property('stream').that.is.instanceof(Rx.Observable);
        store.should.have.property('link').that.is.an('undefined');
        store.should.have.property('type').that.is.an('undefined');
    });

    it('should have `get`, `set` and `sync` methods', () => {
        store.should.have.property('get').that.is.a('function');
        store.should.have.property('set').that.is.a('function');
        store.should.have.property('sync').that.is.a('function');
    });
});