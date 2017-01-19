import chai from 'chai';
import sinon from 'sinon';
import {Subject} from 'rx';
import {EventEmitter} from 'events';

import createDispatcher from '../dist/dispatcher';

chai.should();

let dispatcher;

describe('createDispatcher()', () => {
  it('should be a function', () => {
    createDispatcher.should.be.a.function;
  });
});

describe('dispatcher object', () => {
  before(() => {
    dispatcher = createDispatcher();
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
    dispatcher.stream.should.be.an.instanceof(Subject);
  })
});

describe('dispatcher.dispatch(payload)', () => {
  beforeEach(() => {
    dispatcher = createDispatcher();
  });

  it('should be called', () => {
    let dispatch = dispatcher.dispatch();
  });
});

describe('dispatcher.stream', () => {
  beforeEach(() => {
    dispatcher = createDispatcher();
  });
});
