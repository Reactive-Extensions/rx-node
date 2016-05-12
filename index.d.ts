declare module "rx-node" {
    import * as Rx from 'rx';
    import * as stream from "stream";

    function toEventEmitter<T>(observable: Rx.Observable<T>, eventName: string): NodeJS.EventEmitter
    function fromStream<T>(stream: stream.Stream, finishEventName?: string, dataEventName?: string): Rx.Observable<T>
    function fromReadableStream<T>(stream: stream.Readable, dataEventName?: string): Rx.Observable<T>
    function fromReadLineStream<T>(stream: stream.Readable): Rx.Observable<T>
    function fromWritableStream<T>(stream: stream.Writable): Rx.Observable<T>
    function fromTransformStream<T>(stream: stream.Transform): Rx.Observable<T>
    function writeToStream<T>(observable: Rx.Observable<T>, stream: stream.Writable, encoding?: string): Rx.IDisposable
}