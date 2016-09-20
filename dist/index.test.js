'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _index = require('./index');

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

describe('Store', function () {
    var store;

    it('should create an uninitialized store object', function () {
        store = new _index.Store();

        store.should.not.have.property('_database');
        store.should.not.have.property('remote');
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.false;
    });

    it('should create a store using an object literal', function () {
        store = new _index.Store({
            apiKey: '',
            databaseURL: ''
        });

        store.should.have.property('_database');
        store.should.have.property('remote');
        store.remote.should.have.property('ref').that.is.a.function;
        store.remote.should.have.property('get').that.is.a.function;
        store.remote.should.have.property('set').that.is.a.function;
        store.remote.should.have.property('connect').that.is.a.function;
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.true;
    });

    it('should create a store using an existing Firebase object', function () {
        var app = _firebase2.default.initializeApp({});
        store = new _index.Store(app);

        store.should.have.property('_database');
        store.should.have.property('remote');
        store.remote.should.have.property('ref').that.is.a.function;
        store.remote.should.have.property('get').that.is.a.function;
        store.remote.should.have.property('set').that.is.a.function;
        store.remote.should.have.property('connect').that.is.a.function;
        store.should.have.property('local');
        store.local.should.have.property('get').that.is.a.function;
        store.local.should.have.property('set').that.is.a.function;
        store.local.should.have.property('connect').that.is.a.function;
        store._isInit.should.be.true;
    });
});

describe('Dispatcher', function () {
    var dispatcher;

    beforeEach(function () {
        dispatcher = new _index.Dispatcher();
    });

    it('should have an action stream', function () {
        dispatcher.should.have.property('stream');
    });

    it('should filter out actions without `type` property', function () {
        var spy = _sinon2.default.spy();
        var observer = _rx2.default.Observer.create(function () {
            spy();
        }, function () {
            spy();
        }, function () {
            spy();
        });

        dispatcher.stream.subscribe(observer);

        dispatcher.dispatch({});

        spy.called.should.be.false;
    });

    it('should send dispatched actions to all Store Observers', function () {
        var spy1 = _sinon2.default.spy();
        var spy2 = _sinon2.default.spy();

        var store1 = new _index.Store();
        var store2 = new _index.Store();

        dispatcher.stream.subscribe(store1.createObserver(function () {
            spy1();
        }, function () {
            spy1();
        }, function () {
            spy1();
        }));
        dispatcher.stream.subscribe(store2.createObserver(function () {
            spy2();
        }, function () {
            spy2();
        }, function () {
            spy2();
        }));

        dispatcher.dispatch({
            type: 'test'
        });

        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});

describe('Local storage', function () {
    var store;

    beforeEach(function () {
        store = new _index.Store();
    });

    it('should update the store on a first level property', function () {
        store.local.set('/name', 'value');
        store.local._data.name.should.equal('value');
        store.local.get('/name', function (value) {
            value.should.equal('value');
        });
    });

    it('should update the store on a deep property', function () {
        store.local.set('/path/to/name', 'value');
        store.local._data.path.to.name.should.equal('value');
        store.local.get('/path/to/name', function (value) {
            value.should.equal('value');
        });
    });

    it('should update connected properties', function () {
        var data = {};
        store.local.connect('/name', data, 'name1');
        store.local.connect('/name', data, 'name2');
        store.local.set('/name', 'value');
        data.name1.should.equal('value');
        data.name2.should.equal('value');
    });

    it('should call connected handlers', function () {
        var spy1 = _sinon2.default.spy();
        var spy2 = _sinon2.default.spy();
        store.local.connect('/name', spy1);
        store.local.connect('/name', spy2);
        store.local.set('/name', 'value');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });

    it('should handle all connected handlers and properties', function () {
        var data = {};
        var spy1 = _sinon2.default.spy();
        var spy2 = _sinon2.default.spy();
        store.local.connect('/name', spy1);
        store.local.connect('/name', spy2);
        store.local.connect('/name', data, 'name1');
        store.local.connect('/name', data, 'name2');
        store.local.set('/name', 'value');
        data.name1.should.equal('value');
        data.name2.should.equal('value');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
    });
});