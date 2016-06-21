# Fluxbase [![Build Status](https://travis-ci.org/vimtaai/fluxbase.svg?branch=master)](https://travis-ci.org/vimtaai/fluxbase) ![NPM Version](https://img.shields.io/badge/npm-v0.0.7-blue.svg)

A minimal implementation of the Flux architecture using the new Google Firebase as the store.

Fluxbase uses the [Google Firebase](https://firebase.google.com) database backend as the store for
the [Flux architecture](https://facebook.github.io/flux/docs/overview.html) with a unidirectional
flow.

You can fetch data and listen to changes of the database using the Firebase events and handle 
actions with custom callback functions that are listening for action events of the store. 
With these callbacks you can modify the database. Google's Realtime Database feature always keeps 
your data in-sync with the database contents.

## Usage

Here is a minimal usage example.

```js
// Import fluxbase
import Fluxbase from 'fluxbase';

// Create the store with your Google Firebase API key and database URL
// You can find these on the Firebase Console
var store = Fluxbase.createStore({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>"
});

// Registering action handler
store.on('next', action => {
    store.ref('number').once('value', snapshot => {
        console.log('NEXT action: ', snapshot.val());
        store.ref('number').set(snapshot.val() * 2);
    });
});

// Log current value
store.ref('number').on('value', snapshot => {
   console.log('value event: ', snapshot.val());
});

// Send `NEXT` action
Fluxbase.dispatch({
  type: 'next'
});
```

The API key and the database URL can be found in the 
[Firebase Console](https://console.firebase.google.com/) under
**Overview > Add Firebase to your web app**.

Alternatively you can set up the store with a [`Firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App)
object created by the [`Firebase.app.initializeApp()`](https://firebase.google.com/docs/reference/js/firebase#.initializeApp) method.

```js
import Firebase from 'firebase';
import Fluxbase from 'fluxbase';

var app = Firebase.initializeApp({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>",
}, 'appname');

var store = Fluxbase.createStore(app);
```

This way you still have access to the original `Firebase.app.App` object. This can be useful 
if you want to use other features of Firebase like [Auth](https://firebase.google.com/docs/auth/web/manage-users) 
or [Storage](https://firebase.google.com/docs/storage/web/start).

If you create a new store without passing any parameters you get an uninitialized store. 
Uninitialized stores can't access any database. You can initialize such stores with the 
`Store.init()` method which takes the same parameters as the `Fluxbase.createStore` method.

You can also handle database availability by registering callbacks for three events the Fluxbase 
stores emit. These event are the following:

* `connect`: triggers when the connection to the database was first established
* `disconnect`: triggers when the connection to the database was lost
* `reconncet`: triggers when the connection to the database was reestablished after a disconnection

For registering event handlers you can use the `.on()` method of the store:

```js
store.on('disconnect', () => {
   alert('Oh, snap! We lost connection to the server!'); 
});
```
This also means that these three events are reserved for this specific feature thus you can't use
these for actions.

For full reference for the methods of the `Store` please refer the 
[Google Firebase Web API](https://firebase.google.com/docs/reference/js/firebase.database.Reference).

## Installation

You can simply install the module from the **npm** repository with the following command:

    npm install fluxbase