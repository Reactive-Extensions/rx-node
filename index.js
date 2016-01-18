var Rx = require('rx');

// Add specific Node functions
var EventEmitter = require('events').EventEmitter, Observable = Rx.Observable;

module.exports = {

  /**
   * Converts the given observable sequence to an event emitter with the given event name.
   * The errors are handled on the 'error' event and completion on the 'end' event.
   * @param {Observable} observable The observable sequence to convert to an EventEmitter.
   * @param {String} eventName The event name to emit onNext calls.
   * @returns {EventEmitter} An EventEmitter which emits the given eventName for each onNext call in addition to 'error' and 'end' events.
   *   You must call publish in order to invoke the subscription on the Observable sequuence.
   */
  toEventEmitter: function (observable, eventName, selector) {
    var e = new EventEmitter();

    // Used to publish the events from the observable
    e.publish = function () {
      e.subscription = observable.subscribe(
        function (x) {
          var result = x;
          if (selector) {
            try {
              result = selector(x);
            } catch (e) {
              return e.emit('error', e);
            }
          }

          e.emit(eventName, result);
        },
        function (err) {
          e.emit('error', err);
        },
        function () {
          e.emit('end');
        });
    };

    return e;
  },

  /**
   * Converts a flowing stream to an Observable sequence.
   * @param {Stream} stream A stream to convert to a observable sequence.
   * @param {String} [finishEventName] Event that notifies about closed stream. ("end" by default)
   * @param {String} [dataEventName] Event that notifies about incoming data. ("data" by default)
   * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and finish events like `end` or `finish`.
   */
  fromStream: function (stream, finishEventName, dataEventName) {
    stream.pause();

    finishEventName || (finishEventName = 'end');
    dataEventName || (dataEventName = 'data');

    return Observable.create(function (observer) {
      function dataHandler (data) {
        observer.onNext(data);
      }

      function errorHandler (err) {
        observer.onError(err);
      }

      function endHandler () {
        observer.onCompleted();
      }

      stream.addListener(dataEventName, dataHandler);
      stream.addListener('error', errorHandler);
      stream.addListener(finishEventName, endHandler);

      stream.resume();

      return function () {
        stream.removeListener(dataEventName, dataHandler);
        stream.removeListener('error', errorHandler);
        stream.removeListener(finishEventName, endHandler);
      };
    }).publish().refCount();
  },

  /**
   * Converts a flowing readable stream to an Observable sequence.
   * @param {Stream} stream A stream to convert to a observable sequence.
   * @param {String} [dataEventName] Event that notifies about incoming data. ("data" by default)
   * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and 'end' events.
   */
  fromReadableStream: function (stream, dataEventName) {
    return this.fromStream(stream, 'end', dataEventName);
  },

  /**
   * Converts a flowing readline stream to an Observable sequence.
   * @param {Stream} stream A stream to convert to a observable sequence.
   * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and 'end' events.
   */
  fromReadLineStream: function (stream) {
    return this.fromStream(stream, 'close', 'line');
  },

  /**
   * Converts a flowing writeable stream to an Observable sequence.
   * @param {Stream} stream A stream to convert to a observable sequence.
   * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and 'finish' events.
   */
  fromWritableStream: function (stream) {
    return this.fromStream(stream, 'finish');
  },

  /**
   * Converts a flowing transform stream to an Observable sequence.
   * @param {Stream} stream A stream to convert to a observable sequence.
   * @param {String} [dataEventName] Event that notifies about incoming data. ("data" by default)
   * @returns {Observable} An observable sequence which fires on each 'data' event as well as handling 'error' and 'finish' events.
   */
  fromTransformStream: function (stream, dataEventName) {
    return this.fromStream(stream, 'finish', dataEventName);
  },

  /**
   * Writes an observable sequence to a stream
   * @param {Observable} observable Observable sequence to write to a stream.
   * @param {Stream} stream The stream to write to.
   * @param {String} [encoding] The encoding of the item to write.
   * @returns {Disposable} The subscription handle.
   */
  writeToStream: function (observable, stream, encoding) {
    var source = observable.pausableBuffered();

    function onDrain() {
      source.resume();
    }

    stream.addListener('drain', onDrain);

    var disposable = source.subscribe(
      function (x) {
        !stream.write(String(x), encoding) && source.pause();
      },
      function (err) {
        stream.emit('error', err);
      },
      function () {
        // Hack check because STDIO is not closable
        !stream._isStdio && stream.end();
        stream.removeListener('drain', onDrain);
      });

    source.resume();

    return disposable;
  }
};
