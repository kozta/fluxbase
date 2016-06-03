'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Create store', function () {
    var store;

    it('should create an uninitialized store object', function () {
        store = new _index.Store();

        store.should.not.have.property('database');
        store.should.not.have.property('ref');
        store.initialized.should.be.flase;
        store.handlers.should.be.an('array').that.is.empty;
    });
});

describe('Action handlers', function () {
    var store;
    var handler = function handler(action) {
        return null;
    };

    beforeEach(function () {
        store = new _index.Store();
    });

    it('should register an action handler', function () {
        store.register(handler);
        store.handlers.should.be.an('array').that.has.lengthOf(1);
        store.handlers.should.include(handler);
    });

    it('should unregister an action handler', function () {
        store.register(handler);
        store.unregister(handler);
        store.handlers.should.be.an('array').that.is.empty;
        store.handlers.should.not.not.include(handler);
    });
});

describe('Event dispatch', function () {
    it('should throw an error on uninitialized store', function () {
        var store = new _index.Store();

        (function () {
            store.dispatch(null);
        }).should.throw(Error);
    });

    it('should call all registered handlers', function () {
        var store = new _index.Store();
        store.initialized = true;

        var ids = [1, 2, 3, 4, 5];

        function handlerFactory(id) {
            return function (action) {
                ids = ids.filter(function (elem) {
                    return elem !== id;
                });
            };
        }

        ids.forEach(function (id) {
            store.register(handlerFactory(id));
        });

        store.dispatch(null);

        ids.should.be.empty;
    });
});