# Fluxbase [![Build Status](https://travis-ci.org/vimtaai/fluxbase.svg?branch=master)](https://travis-ci.org/vimtaai/fluxbase) ![NPM Version](https://img.shields.io/badge/npm-v1.0.1-blue.svg)

An implementation of the Flux architecture using [Rx Observables](http://reactivex.io/) and the 
new Google Firebase as the store.

Fluxbase uses the [Google Firebase](https://firebase.google.com) database backend and the memory as 
the store for the [Flux architecture](https://facebook.github.io/flux/docs/overview.html) with a 
unidirectional flow implemented with [Rx Observables](http://reactivex.io/).

You can fetch data and listen to changes of the database using the Firebase events and handle 
actions with Rx Observers that are observing the main data stream for actions. You can filter the
action stream to filter which events you want to target with your observers.
For more details on Rx Observables and Observers visit the [ReactiveX homepage](http://reactivex.io/).
Observer callbacks can modify the database. Google's Realtime Database feature always keeps 
your data in-sync with the database contents.

You also have a local storage available in the memory with the same methods as the remote connection.
Object properties can be bound to database endpoints (both local and remote) to keep your variables
in sync with the store. You can think of the local store as an application level state.

## Usage

Here is a minimal usage example.

```js
// Import Fluxbase classes
import { Dispatcher, Store } from 'fluxbase';

// Create the dispatcher
var dispatcher = new Dispatcher(); 

// Create the store with your Google Firebase API key and database URL
// You can find these on the Firebase Console
var store = new Store({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>"
});

var data = {
    remote: {},
    local: {},
};

// Filter the action stream and create an Observer to handle events
dispatcher.stream
    .filter(action => action.type == 'next')
    .subscribe(store.createObserver(action => {
        // Get the current value from the remote database
        store.remote.get('/number', value => {
            // Update the database with a modified value
            store.remote.set('/number', (value | 0) + 1);
            console.log('remote', data.remote);
        });
        // Get the current value from the local store
        store.local.get('number', value => {
            // Update the local store with a modified value
            store.local.set('/number', (value | 0) + 1); 
            console.log('local', data.local);
        });
    }));

// Bind database endpoint to variable property
store.remote.connect('/number', data.remote, 'number');
store.local.connect('/number', data.local, 'number');

// Dispatch actions to the stream
dispatcher.dispatch({ type: 'next' }); // Will run the main callback
dispatcher.dispatch({ type: 'something' }); // Will be filtered out
```

The API key and the database URL can be found in the 
[Firebase Console](https://console.firebase.google.com/) under
**Overview > Add Firebase to your web app**.

Alternatively you can set up the store with a [`Firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App)
object created by the [`Firebase.app.initializeApp()`](https://firebase.google.com/docs/reference/js/firebase#.initializeApp) method.

```js
import Firebase from 'firebase';
import { Store } from 'fluxbase';

var app = Firebase.initializeApp({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>",
}, 'appname');

var store = new Store(app);
```

This way you still have access to the original `Firebase.app.App` object. This can be useful 
if you want to use other features of Firebase like [Auth](https://firebase.google.com/docs/auth/web/manage-users) 
or [Storage](https://firebase.google.com/docs/storage/web/start).

If you create a new store without passing any parameters you get an uninitialized store. 
Uninitialized stores can't access any database. You can initialize such stores with the 
`Store.init()` method which takes the same parameters as the `Store` constructor.

You can also handle database availability by registering callbacks for three events the `Store`
can emit. These event are the following:

* `connect`: triggers when the connection to the database was first established
* `disconnect`: triggers when the connection to the database was lost
* `reconncet`: triggers when the connection to the database was reestablished after a disconnection

For registering event handlers you can use the `.on()` method of the store:

```js
store.on('disconnect', () => {
   alert('Oh, snap! We lost connection to the server!'); 
});
```

For full reference for the methods of the `Store` please refer the 
[Google Firebase Web API](https://firebase.google.com/docs/reference/js/firebase.database.Reference).

You can bind Firebase endpoints to certain variable properties or to callbacks. With this one way
binding you can easily keep your data up-to-date. It also works well with [React](https://facebook.github.io/react/)
using the `setState` method.

```js
class MyComponent extends React.Component {
    constructor() {
        this.state = {
            data: "Loading..."
        };
        store.remote.connect('/path/to/endpoint', this.setState.bind(this));
    }
    
    render() {
        return <div>{ this.state.data }</div>;
    }
}
```

## Installation

You can simply install the module from the **npm** repository with the following command:

    npm install fluxbase