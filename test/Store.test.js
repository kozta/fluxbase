import chai from 'chai';

import Store from '../dist/Store';

chai.should();

describe('Store function', () => {
  it('should be a function', () => {
    Store.should.be.a.function;
  });
});

describe('Store object', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  it('should be an object', () => {
    store.should.be.an.object;
  });
});
