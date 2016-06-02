var Firebase = require('firebase');

var fluxbase = function (config) {
    Firebase.initializeApp(config);
    this.database = Firebase.database();
    this.handlers = [];
};

fluxbase.prototype.register = function (callback) {
    this.handlers.push(callback);
};

fluxbase.prototype.dispatch = function (action) {
    this.handlers.forEach(function (handler) {
        handler.bind(this.database)(action);
    }.bind(this));
};

fluxbase.prototype.listen = function (path, event, callback) {
    this.database.ref(path).on(event, callback);
}

module.exports = fluxbase;