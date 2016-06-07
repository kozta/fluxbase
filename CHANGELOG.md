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
- The `Store` now uses only the 
  [Google Firebase Reference API](https://firebase.google.com/docs/reference/js/firebase.database.Reference)
- The package is now written in ES6

### Added

- Support for multiple stores

## 0.0.1 (Jun 02, 2016)

Initial release