# Fluxbase

A minimal implementation of the Flux architecture using the new Google Firebase as the store.

Fluxbase uses the [Google Firebase](https://firebase.google.com) database backend as the store for
a [flux architecture](https://facebook.github.io/flux/docs/overview.html).

Currenty you can listen to certain references of the database using the Firebase events (`value`, 
`child_added`, `child_changed`, `child_removed`, `child_moved`) and handle action with custom
action handler functions that are registered in the store.

As for now only one store is supported that is equivalent of one connection to a Firebase database.

## Usage

Below is a minimal usage example with [React](https://facebook.github.io/react/).

```js
// Import React
var React = require('react');
var ReactDOM = require('react-dom');
// Import fluxbase
var fluxbase = require('fluxbase');

// Create the store with your Google Firebase database URL
// You can find this URL on the Firebase Console
var store = new fluxbase({
    apiKey: "<your-api-key>",
    databaseURL: "<your-database-url>",
});

// Registering action handler
store.register(function (action) {
    // Switching by action type
    switch (action.type) {
        // In case of an `UPDATE` event update the database with the given value
        case 'UPDATE':
            this.ref().set({
                name: action.value
            });
            break;
        
        default:
            console.error('UNSUPPORTED ACTION TYPE');
    }
});

// Component to display the `name` from the database
var DisplayComponent = React.createClass({
    getInitialState: function () {
        // Listening for the changes of value of `name`
        store.listen('name', 'value', (snapshot) => {
            // Updating the component state on value change
            this.setState({
                name: snapshot.val()
            });
        });
        // Setting default value that is displayed until the database connection is made
        return {
            name: 'I don\'t know yet.'
        }
    },
    
    render: function () {
        // Displaying the state
        return <h1>Hello, {this.state.name}</h1>;
    }
});

// Input component for updating the database
var InputComponent = React.createClass({
    update: function (event) {
        store.dispatch({
            type: 'UPDATE',
            value: event.target.value
        });
    },
    
    render: function () {
        return <input onChange={this.update} />;
    }
});

ReactDOM.render(
    <div>
        <DisplayComponent />
        <InputComponent />
    </div>,
    document.getElementById('container')
);

```

The API key and the database URL can be found in the 
[Firebase Console](https://console.firebase.google.com/) under
**Overview > Add Firebase to your web app**.

## Installation

You can simply install the module from the **npm** repository with the following command:

    npm install fluxbase