import chai from 'chai';
import Rx from 'rx';

import Dispatcher from '../dist/Dispatcher';

chai.should();

let dispatcher;

describe('Dispatcher function', () => {
  it('should be a function', () => {
    Dispatcher.should.be.a.function;
  });
});

describe('Dispatcher object', () => {
  before(() => {
    dispatcher = Dispatcher();
  });

  it('should be an object', () => {
    dispatcher.should.be.an.object;
  });

  it('should have a `dispatch` method', () => {
    dispatcher.should.have.property('dispatch');
    dispatcher.dispatch.should.be.a.function;
  });

  it('should have a `stream` property', () => {
    dispatcher.should.have.property('stream');
  })
});

describe('dispatcher.dispatch(payload)', () => {
  beforeEach(() => {
    dispatcher = Dispatcher();
  });

  it('should be called', () => {
    let dispatch = dispatcher.dispatch();
  });
});
