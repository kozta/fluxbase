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

Fluxbase.prototype.dispatch = function (action) {
    this.handlers.forEach(function (handler) {
        handler(action);
    });
};

module.exports = Fluxbase;