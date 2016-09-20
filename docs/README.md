## Classes

<dl>
<dt><a href="#Dispatcher">Dispatcher</a> ⇐ <code><a href="https://nodejs.org/api/events.html#events_class_eventemitter">EventEmitter</a></code></dt>
<dd><p>Class representing the dispatcher in the Flux architecture</p>
</dd>
<dt><a href="#Store">Store</a> ⇐ <code><a href="https://nodejs.org/api/events.html#events_class_eventemitter">EventEmitter</a></code></dt>
<dd><p>Class representing the store in the Flux architecture</p>
</dd>
</dl>

<a name="Dispatcher"></a>

## Dispatcher ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
Class representing the dispatcher in the Flux architecture

**Kind**: global class  
**Extends:** <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| stream | <code>[Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> | The stream of actions emitted by the Dispatcher |


* [Dispatcher](#Dispatcher) ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
    * [new Dispatcher()](#new_Dispatcher_new)
    * [.dispatch(action)](#Dispatcher+dispatch)

<a name="new_Dispatcher_new"></a>

### new Dispatcher()
Create a Dispatcher object

<a name="Dispatcher+dispatch"></a>

### dispatcher.dispatch(action)
Send an action to the action stream

**Kind**: instance method of <code>[Dispatcher](#Dispatcher)</code>  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>object</code> | The action object |
| action.type | <code>string</code> | The type of the action |
| [action.data] | <code>\*</code> | Additional data for the action |

**Example**  
```js
dispatcher.dispatch({
  type: 'next'
});
```
<a name="Store"></a>

## Store ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
Class representing the store in the Flux architecture

**Kind**: global class  
**Extends:** <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>  
**Emits**: <code>Store#event:connect</code>, <code>Store#event:disconnect</code>, <code>Store#event:reconnect</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| remote | <code>object</code> | Access to the remote database |
| local | <code>object</code> | Access to the local database |


* [Store](#Store) ⇐ <code>[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)</code>
    * [new Store(obj)](#new_Store_new)
    * [.remote](#Store+remote) : <code>object</code>
        * [.ref](#Store+remote.ref) : <code>[Reference](https://firebase.google.com/docs/reference/js/firebase.database.Reference)</code>
        * [.get(endpoint, callback)](#Store+remote.get)
        * [.set(endpoint, value)](#Store+remote.set)
        * [.connect(endpoint, handler, [property])](#Store+remote.connect)
    * [.local](#Store+local) : <code>object</code>
        * [.get(endpoint, callback)](#Store+local.get)
        * [.set(endpoint, value)](#Store+local.set)
        * [.connect(endpoint, handler, [property])](#Store+local.connect)
    * [.init([obj])](#Store+init)
    * [.createObserver(onNext, [onError], [onComplete])](#Store+createObserver) ⇒ <code>[Observer](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>

<a name="new_Store_new"></a>

### new Store(obj)
Create a Store object.


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> &#124; <code>[App](https://firebase.google.com/docs/reference/js/firebase.app.App)</code> | The initializer of the Store |

**Example**  
With an object literal:
```js
var store = new Store({
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

var store = new Store(app);
```
<a name="Store+remote"></a>

### store.remote : <code>object</code>
Access to the remote database

**Kind**: instance property of <code>[Store](#Store)</code>  

* [.remote](#Store+remote) : <code>object</code>
    * [.ref](#Store+remote.ref) : <code>[Reference](https://firebase.google.com/docs/reference/js/firebase.database.Reference)</code>
    * [.get(endpoint, callback)](#Store+remote.get)
    * [.set(endpoint, value)](#Store+remote.set)
    * [.connect(endpoint, handler, [property])](#Store+remote.connect)

<a name="Store+remote.ref"></a>

#### remote.ref : <code>[Reference](https://firebase.google.com/docs/reference/js/firebase.database.Reference)</code>
Make a reference to the remote database

**Kind**: static property of <code>[remote](#Store+remote)</code>  
<a name="Store+remote.get"></a>

#### remote.get(endpoint, callback)
Get a value from the remote database asyncronously and pass it to the provided
callback

**Kind**: static method of <code>[remote](#Store+remote)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| callback | <code>function</code> | Callback function to handle return value |

**Example**  
Get a single value and log it
```js
store.remote.get('/path/to/endpoint', function (value) {
  console.log(value); 
});
```
<a name="Store+remote.set"></a>

#### remote.set(endpoint, value)
Set a value in the remote database at a specific endpoint

**Kind**: static method of <code>[remote](#Store+remote)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| value |  | The new value for the endpoint |

**Example**  
Simple use
```js
store.remote.set('/path/to/endpoint', value);
```

Combined with connect
```js
var obj = {
  value: 1
};

store.remote.connect('/path/to/endpoint', obj, 'value');

store.remote.set('/path/to/endpoint', 2);
// obj.value will change to `2`
```
<a name="Store+remote.connect"></a>

#### remote.connect(endpoint, handler, [property])
Connect (bind) a remote database endpoint to an object property or a callback function

**Kind**: static method of <code>[remote](#Store+remote)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| handler | <code>object</code> &#124; <code>function</code> | Object the property of which to use / A single parameter                                      function to handle the value change |
| [property] | <code>string</code> | Name of the property of the local variable to use |

**Example**  
With an object property:
```js
var data = {}

store.remote.connect('/path/to/endpoint', data, 'property');
```

With a callback function:
```js
var obj = {
  data: {},
  set(value) {
    this.data = value;
  }
};

store.remote.connect('/path/to/endpoint', obj.set.bind(obj));
```
<a name="Store+local"></a>

### store.local : <code>object</code>
Access to the local database

**Kind**: instance property of <code>[Store](#Store)</code>  

* [.local](#Store+local) : <code>object</code>
    * [.get(endpoint, callback)](#Store+local.get)
    * [.set(endpoint, value)](#Store+local.set)
    * [.connect(endpoint, handler, [property])](#Store+local.connect)

<a name="Store+local.get"></a>

#### local.get(endpoint, callback)
Get a value from the local database and pass it to the provided callback

**Kind**: static method of <code>[local](#Store+local)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| callback | <code>function</code> | Callback function to handle return value |

**Example**  
Get a single value and log it
```js
store.local.get('/path/to/endpoint', function (value) {
  console.log(value); 
});
```
<a name="Store+local.set"></a>

#### local.set(endpoint, value)
Set a value in the local database at a specific endpoint

**Kind**: static method of <code>[local](#Store+local)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| value |  | The new value for the endpoint |

**Example**  
Simple use
```js
store.local.set('/path/to/endpoint', value);
```

Combined with connect
```js
var obj = {
  value: 1
};

store.local.connect('/path/to/endpoint', obj, 'value');

store.local.set('/path/to/endpoint', 2);
// obj.value will change to `2`
```
<a name="Store+local.connect"></a>

#### local.connect(endpoint, handler, [property])
Connect (bind) a local database endpoint to an object property or a callback function

**Kind**: static method of <code>[local](#Store+local)</code>  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Path to the database endpoint |
| handler | <code>object</code> &#124; <code>function</code> | Object the property of which to use / A single parameter                                      function to handle the value change |
| [property] | <code>string</code> | Name of the property of the local variable to use |

**Example**  
With an object property:
```js
var data = {}

store.local.connect('/path/to/endpoint', data, 'property');
```

With a callback function:
```js
var obj = {
  data: {},
  set(value) {
    this.data = value;
  }
};

store.local.connect('/path/to/endpoint', obj.set.bind(obj));
```
<a name="Store+init"></a>

### store.init([obj])
Initialize an uninitialized Store.
Should be called only on an uninitialized Store.

**Kind**: instance method of <code>[Store](#Store)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [obj] | <code>object</code> &#124; <code>[App](https://firebase.google.com/docs/reference/js/firebase.app.App)</code> | The initializer of the Store |

**Example**  
```js
var store = new Store(); // Uninitialized Store
store.init({
  apiKey: "<your-api-key>",
  databaseURL: "<your-database-url>",   
});
```
<a name="Store+createObserver"></a>

### store.createObserver(onNext, [onError], [onComplete]) ⇒ <code>[Observer](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code>
Create an Observer object to pass for the Observable.subscribe method

**Kind**: instance method of <code>[Store](#Store)</code>  
**Returns**: <code>[Observer](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)</code> - - The Observer object to handle incoming actions  

| Param | Type | Description |
| --- | --- | --- |
| onNext | <code>function</code> | A function to handle the incoming action on the stream |
| [onError] | <code>function</code> | A function to handle errors on the action stream |
| [onComplete] | <code>function</code> | A function to handle the completion of the stream |

**Example**  
```js
dispatcher.stream.subscribe(store.createObserver(action => {
  console.log('Action recieved');
}));
```
