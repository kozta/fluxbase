import chai from 'chai';

import createStore from '../dist/store';

chai.should();

describe('createStore()', () => {
  it('should be a function', () => {
    createStore.should.be.a.function;
  });
});

describe('store object', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('should be an object', () => {
    store.should.be.an.object;
  });
});
