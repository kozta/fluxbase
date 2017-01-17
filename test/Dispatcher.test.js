import chai from 'chai';
import sinon from 'sinon';
import Rx from 'rx';
import {EventEmitter} from 'events';

import Dispatcher from '../dist/Dispatcher';

chai.should();

let dispatcher;

describe('Dispatcher class', () => {
  it('should be a class', () => {
    Dispatcher.should.be.a.class;
  });
});

describe('Dispatcher object', () => {
  before(() => {
    dispatcher = new Dispatcher();
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
    dispatcher.stream.should.be.an.instanceof(Rx.Subject);
  })
});

describe('dispatcher.dispatch(payload)', () => {
  beforeEach(() => {
    dispatcher = new Dispatcher();
  });

  it('should be called', () => {
    let dispatch = dispatcher.dispatch();
  });
});

describe('dispatcher.stream', () => {
  beforeEach(() => {
    dispatcher = new Dispatcher();
  });
});
