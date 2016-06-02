## 0.0.2

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

## 0.0.1

Initial release