# Fluxbase [![Build Status](https://travis-ci.org/vimtaai/fluxbase.svg?branch=master)](https://travis-ci.org/vimtaai/fluxbase) ![NPM Version](https://img.shields.io/badge/npm-v0.0.3-blue.svg)

A minimal implementation of a Flux-like architecture using the new Google Firebase as the store.

Fluxbase uses the [Google Firebase](https://firebase.google.com) database backend as the store for
a [flux-like architecture](https://facebook.github.io/flux/docs/overview.html) with a unidirectional
flow.

You can listen to certain references of the database using the Firebase events (`value`, 
`child_added`, `child_changed`, `child_removed`, `child_moved`) and handle actions with custom
action handler functions that are registered in the store. These handlers can modify the database.

## Usage

Here is a minimal usage example.

```js
// Import fluxbase
import { Store } from 'fluxbase';

// Create the store with your Google Firebase API key and database URL
// You can find these on the Firebase Console
var store = new Store({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>",
});

// Registering action handler
store.register(action => {
    switch (action.type) {
        // In case of an `NEXT` event read `number` from the
        // database and multiply it by 2
        case 'NEXT':
            store.ref('number').once('value', snapshot => {
                console.log('NEXT action: ', snapshot.val());
                store.ref('number').set(snapshot.val() * 2);
            });
            break;
        default: 
            return;
    }
});

// Log current value
store.ref('number').on('value', snapshot => {
   console.log('value event: ', snapshot.val());
});

// Send `NEXT` action
store.dispatch({
  type: 'NEXT' 
});
```

The API key and the database URL can be found in the 
[Firebase Console](https://console.firebase.google.com/) under
**Overview > Add Firebase to your web app**.

Alternatively you can set up the store with a [`Firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App)
created by the [`Firebase.app.initializeApp()`](https://firebase.google.com/docs/reference/js/firebase#.initializeApp) method.

```js
import Firebase from 'firebase';
import { Store } from 'fluxbase';

var app = Firebase.initializeApp({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>",
}, 'appname');

var store = new Store(app);
```

With this method you still have access to the original `Firebase.app.App` object. This can be useful 
if you want to use other features of Firebase like [Auth](https://firebase.google.com/docs/auth/web/manage-users) 
or [Storage](https://firebase.google.com/docs/storage/web/start).

If you create a new store without passing any parameters you get an uninitialized store. You can't 
dispatch actions to uninitialized stores but you can register handler functions. You can initialize
such stores with the `Store.initialize()` function which takes the same parameters as the constructor.

For full reference for the methods of the `Store` please refer the 
[Google Firebase Web API](https://firebase.google.com/docs/reference/js/firebase.database.Reference).

## Installation

You can simply install the module from the **npm** repository with the following command:

    npm install fluxbase