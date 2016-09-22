## 1.0.1 (Sep 20, 2016)

### Added

- The `Store.remote.connect` method
- The `Store.remote.get` method
- The `Store.remote.set` method
- Support for local storage in memory (`Store.local`)
- The `Store.createObserver` method

### Modified

- The module now uses Rx Observables instead of events
- The `Fluxbase` class is now `Dispatcher`
- The `Store` is now exported and created via the `new` keyword
- Database references are now accessed via the `Store.remote.ref` method
- Updated documentation

### Removed

- The `createStore` method

## 0.0.7 (Jun 21, 2016)

### Bugfix

- `Fluxbase.createStore` is now properly working with `Firebase.app.App` objects

## 0.0.5 (Jun 15, 2016)

### Added

- The `Fluxbase` class
- Default export of a `Fluxbase` object

### Modified

- `Store` is now created with the `Fluxbase.createStore` method
- `Store` now emits events based on the action type
- Actions are now dispatched to the `Fluxbase` object

### Removed

- The `dispatch` method of the `Store`
- The `register` method of the `Store`
- The `unregister` method of the `Store`
- Export for `Store`

## 0.0.4 (Jun 07, 2016)

### Added

- Events for database connection state changes

## 0.0.3 (Jun 03, 2016)

### Added

- Multiple options for initialization
- Uninitialized stores
- Mocha tests

## 0.0.2 (Jun 03, 2016)

### Removed

- The `listen` method
- Context binding for action handlers

### Modified

- Fluxbase is now imported as a class (`import { Store } from 'firebase';`)
- The `Store` now uses only the [Google Firebase Reference API](https://firebase.google.com/docs/reference/js/firebase.database.Reference)
- The package is now written in ES6

### Added

- Support for multiple stores

## 0.0.1 (Jun 02, 2016)

Initial release