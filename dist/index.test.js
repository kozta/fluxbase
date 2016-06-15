'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.should();

// Stub Firebase class
_sinon2.default.stub(_firebase2.default, 'app', function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'database',
        value: function database() {
            return {
                ref: function ref(path) {
                    return {
                        on: function on() {
                            return undefined;
                        }
                    };
                }
            };
        }
    }]);

    return _class;
}());
_sinon2.default.stub(_firebase2.default, 'initializeApp', function () {
    return new _firebase2.default.app();
});
// END Stub

describe('Fluxbase', function () {
    it('should not have any stores registered', function () {
        _index2.default._stores.should.be.empty;
    });
});

describe('Create store', function () {
    var store;

    it('should create an uninitialized store object', function () {
        store = _index2.default.createStore();

        store.should.not.have.property('_database');
        store.should.not.have.property('ref').that.is.a.function;;
        store._isInit.should.be.false;
    });

    it('should create a store using an object literal', function () {
        store = _index2.default.createStore({});

        store.should.have.property('_database');
        store.should.have.property('ref').that.is.a.function;
        store._isInit.should.be.true;
    });

    it('should create a store using an existing Firebase object', function () {
        var app = _firebase2.default.initializeApp({});
        store = _index2.default.createStore(app);

        store.should.have.property('_database');
        store.should.have.property('ref');
        store._isInit.should.be.true;
    });
});

describe('Action dispatch', function () {
    it('should throw an error on action without type', function () {
        (function () {
            _index2.default.dispatch({});
        }).should.throw(Error);
    });

    it('all Stores should emit dispatched event', function () {
        var spy1 = _sinon2.default.spy();
        var spy2 = _sinon2.default.spy();

        var store1 = _index2.default.createStore();
        var store2 = _index2.default.createStore();

        store1.on('test', spy1);
        store2.on('test', spy2);

        _index2.default.dispatch({
            type: 'test'
        });

        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});