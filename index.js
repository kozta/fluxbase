var Firebase = require('firebase');

var Fluxbase = function (config) {
    Firebase.initializeApp(config);
    this.database = Firebase.database();
    this.ref = this.database.ref.bind(this.database);
    this.handlers = [];
};

Fluxbase.prototype.register = function (callback) {
    this.handlers.push(callback);
};

Fluxbase.prototype.unregister = function (callback) {
    this.handlers = this.handlers.filter(function (handler) {
        return handler !== callback;
    });
};

Fluxbase.prototype.dispatch = function (action) {
    this.handlers.forEach(function (handler) {
        handler(action);
    });
};

module.exports = Fluxbase;