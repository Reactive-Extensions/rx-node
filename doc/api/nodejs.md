# Node.js Integration #

The Reactive Extensions for JavaScript provides integration points to the core Node.js libraries.

<!-- div -->

## `RxNode Methods`

### Event Handlers

- [`toEventEmitter`](#rxnodetoeventemitterobservable-eventname-handler)

### Stream Handlers

- [`fromStream`](#rxnodefromstreamstream-finisheventname)
- [`fromReadableStream`](#rxnodefromreadablestreamstream)
- [`fromWritableStream`](#rxnodefromwritablestreamstream)
- [`fromTransformStream`](#rxnodefromtransformstreamstream)
- [`writeToStream`](#rxnodewritetostreamobservable-stream-encoding)

## _RxNode Methods_ ##

### <a id="rxnodetoeventemitterobservable-eventname"></a>`RxNode.toEventEmitter(observable, eventName)`
<a href="#rxnodetoeventemitterobservable-eventname">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L60-L88 "View in source")

Converts the given observable sequence to an event emitter with the given event name.
The errors are handled on the 'error' event and completion on the 'end' event.

#### Arguments
1. `observable` *(Obsesrvable)*: The observable sequence to convert to an EventEmitter.
2. `eventName` *(String)*: The event name to subscribe.

#### Returns
*(EventEmitter)*: An EventEmitter which emits the given eventName for each onNext call in addition to 'error' and 'end' events.

#### Example
```js
var Rx = require('rx');
var RxNode = require('rx-node');

var source = Rx.Observable.return(42);

var emitter = RxNode.toEventEmitter(source, 'data');

emitter.on('data', function (data) {
    console.log('Data: ' + data);
});

emitter.on('end', function () {
    console.log('End');
});

// Ensure to call publish to fire events from the observable
emitter.publish();

// => Data: 42
// => End
```

### Location

- index.js

* * *

### Stream Handlers ###

### <a id="rxnodefromstreamstream-finisheventname"></a>`RxNode.fromStream(stream, finishEventName)`
<a href="#rxnodefromstreamstream-finisheventname">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L96-L124 "View in source")

Converts a flowing stream to an Observable sequence.

#### Arguments
1. `stream` *(Stream)*: A stream to convert to a observable sequence.
2. `[finishEventName]` *(String)*: Event that notifies about closed stream. ("end" by default)

#### Returns
*(Observable)*: An observable sequence which fires on each 'data' event as well as handling 'error' and finish events like `end` or `finish`.

#### Example
```js
var RxNode = require('rx-node');

var subscription = RxNode.fromStream(process.stdin, 'end')
    .subscribe(function (x) { console.log(x); });

// => r<Buffer 72>
// => x<Buffer 78>
```

### Location

- index.js

* * *

### <a id="rxnodefromreadablestreamstream"></a>`RxNode.fromReadableStream(stream)`
<a href="#rxnodefromreadablestreamstream">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L131-L133 "View in source")

Converts a flowing readable stream to an Observable sequence.

#### Arguments
1. `stream` *(Stream)*: A stream to convert to a observable sequence.

#### Returns
*(Observable)*: An observable sequence which fires on each 'data' event as well as handling 'error' and 'end' events.

#### Example
```js
var RxNode = require('rx-node');

var subscription = RxNode.fromReadableStream(process.stdin)
    .subscribe(function (x) { console.log(x); });

// => r<Buffer 72>
// => x<Buffer 78>
```

### Location

- index.js

* * *

### <a id="rxnodefromwritablestreamstream"></a>`RxNode.fromWritableStream(stream)`
<a href="#rxnodefromwritablestreamstream">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L140-L142 "View in source")

Converts a flowing writeable stream to an Observable sequence.

#### Arguments
1. `stream` *(Stream)*: A stream to convert to a observable sequence.

#### Returns
*(Observable)*: An observable sequence which fires on each 'data' event as well as handling 'error' and 'finish' events.

#### Example
```js
var RxNode = require('rx-node');

var subscription = RxNode.fromWritableStream(process.stdout)
    .subscribe(function (x) { console.log(x); });

// => r<Buffer 72>
// => x<Buffer 78>
```

### Location

- index.js

* * *

### <a id="rxnodefromtransformstreamstream"></a>`RxNode.fromTransformStream(stream)`
<a href="#rxnodefromtransformstreamstream">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L149-L151 "View in source")

Converts a flowing transform stream to an Observable sequence.

#### Arguments
1. `stream` *(Stream)*: A stream to convert to a observable sequence.

#### Returns
*(Observable)*: An observable sequence which fires on each 'data' event as well as handling 'error' and 'finish' events.

#### Example
```js
var RxNode = require('rx-node');

var subscription = RxNode.fromTransformStream(getTransformStreamSomehow());
```

### Location

- index.js

* * *

### <a id="rxnodewritetostreamobservable-stream-encoding"></a>`RxNode.writeToStream(observable, stream, [encoding])`
<a href="#rxnodewritetostreamobservable-stream-encoding">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/index.js#L160-L171 "View in source")

Writes an observable sequence to a stream.

#### Arguments
1. `observable` *(Observable)*: Observable sequence to write to a stream.
2. `stream` *(Stream)*: The stream to write to.
3. `[encoding]` *(String)*: The encoding of the item to write.

#### Returns
*(Disposable)*: The subscription handle.

#### Example
```js
var Rx = require('rx');
var RxNode = require('rx-node');

var source = Rx.Observable.range(0, 5);

var subscription = RxNode.writeToStream(source, process.stdout, 'utf8');

// => 01234
```

### Location

- index.js

* * *
