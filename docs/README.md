## Classes

<dl>
<dt><a href="#Fluxbase">Fluxbase</a> ⇐ <code><a href="https://nodejs.org/api/events.html#events_class_eventemitter">EventEmitter</a></code></dt>
<dd><p>Class representing the dispatcher in the Flux architecture</p>
</dd>
<dt><a href="#Store">Store</a> ⇐ <code><a href="https://nodejs.org/api/events.html#events_class_eventemitter">EventEmitter</a></code></dt>
<dd><p>Class representing the store in the Flux architecture</p>
</dd>
</dl>

<a name="Fluxbase"></a>

## Fluxbase ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
Class representing the dispatcher in the Flux architecture

**Kind**: global class  
**Extends:** <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>  

* [Fluxbase](#Fluxbase) ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
    * [new Fluxbase()](#new_Fluxbase_new)
    * [.dispatch(action)](#Fluxbase+dispatch)
    * [.createStore([obj])](#Fluxbase+createStore) ⇒ <code>[Store](#Store)</code>

<a name="new_Fluxbase_new"></a>

### new Fluxbase()
Create a Fluxbase object. (Should not be called. The module exports an instance.)

<a name="Fluxbase+dispatch"></a>

### fluxbase.dispatch(action)
Broadcast an action to all Stores.

**Kind**: instance method of <code>[Fluxbase](#Fluxbase)</code>  
**Throws**:

- <code>Error</code> Will throw an error if the action parameter has no `type` property


| Param | Type | Description |
| --- | --- | --- |
| action | <code>Object</code> | The action object |
| action.type | <code>string</code> | The type of the action |
| [action.data] | <code>\*</code> | Additional data for the action |

**Example**  
```js
Fluxbase.dispatch({
  type: 'next'
});
```
<a name="Fluxbase+createStore"></a>

### fluxbase.createStore([obj]) ⇒ <code>[Store](#Store)</code>
Create a new Store and register it for broadcasts.

**Kind**: instance method of <code>[Fluxbase](#Fluxbase)</code>  
**Returns**: <code>[Store](#Store)</code> - A new Store object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| [obj] | <code>Object</code> &#124; <code>Firebase.app</code> | The initializer of the Store |

**Example**  
With an object literal:
```js
var store = Fluxbase.createStore({
  apiKey: "<your-api-key>",
  databaseURL: "<your-database-url>"
});
```

With a Firebase.app object:
```js
var app = Firebase.initializeApp({
  apiKey: "<your-api-key>",
  databaseURL: "<your-database-url>",
}, 'appname');

var store = Fluxbase.createStore(app);
```
<a name="Store"></a>

## Store ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
Class representing the store in the Flux architecture

**Kind**: global class  
**Extends:** <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>  
**Emits**: <code>Store#event:connect</code>, <code>Store#event:disconnect</code>, <code>Store#event:reconnect</code>  

* [Store](#Store) ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
    * [new Store(obj)](#new_Store_new)
    * [.init([obj])](#Store+init)

<a name="new_Store_new"></a>

### new Store(obj)
Create a Store object. (Should not be used. Use [createStore](#Fluxbase+createStore) instead.)


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> &#124; <code>Firebase.app.App</code> | The initializer of the Store |

<a name="Store+init"></a>

### store.init([obj])
Initialize an uninitialized Store.
Should be called only on an uninitialized Store.

**Kind**: instance method of <code>[Store](#Store)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [obj] | <code>Object</code> &#124; <code>Firebase.app.App</code> | The initializer of the Store |

**Example**  
```js
var store = Fluxbase.createStore(); // Uninitialized Store
store.init({
  apiKey: "<your-api-key>",
  databaseURL: "<your-database-url>",   
});
```
