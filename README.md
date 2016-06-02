# Fluxbase

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

For full reference for the methods of the `Store` please refer the 
[Google Firebase Web API](https://firebase.google.com/docs/reference/js/firebase.database.Reference).

## Installation

You can simply install the module from the **npm** repository with the following command:

    npm install fluxbase