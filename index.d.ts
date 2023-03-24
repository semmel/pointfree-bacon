import {EventStream, Observable, Property} from 'baconjs';
import {StateF} from "baconjs/types/withstatemachine";

export function and(ma: Observable<any>, mb: Observable<any>): Observable<boolean>;
export function and(ma: Observable<any>): (mb: Observable<any>) => Observable<boolean>;

export function bi_tap<T>(onFailure: (e: any) => void, onSuccess: (t?: T) => any, p: Observable<T>): Observable<T>;
export function bi_tap<T>(onFailure: (e: any) => void, onSuccess: (t?: T) => any): (p: Observable<T>) => Observable<T>;

export function bufferingThrottle<T>(minimumInterval: number, mt: Observable<T>): Observable<T>;
export function bufferingThrottle<T>(minimumInterval: number): (mt: Observable<T>) => Observable<T>;

export function chain<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function chain<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

// flatMapError :: (e -> Observable d b) -> Observable e a -> Observable d b
export function chainRej<A>(onError: (e: any) => Observable<A>, ma: Observable<A>) : Observable<A>;
export function chainRej<A>(onError: (e: any) => Observable<A>): (ma: Observable<A>) => Observable<A>;

export function coalesce<A, B>(onError: (e: any) => B, onValue: (a: A) => B, ma: Observable<A>): Observable<B>;
export function coalesce<A, B>(onError: (e: any) => B, onValue: (a: A) => B): (ma: Observable<A>) => Observable<B>;

export function concat<A, B>(ma: Observable<A>, mb: Observable<B>): Observable<A|B>;
export function concat<A, B>(ma: Observable<A>): (mb: Observable<B>) => Observable<A|B>;

export function combine<A, B, C>(f: (a: A, b: B) => C, ma: Observable<A>, mb: Observable<B>): Observable<C>;
export function combine<A, B, C>(f: (a: A, b: B) => C, ma: Observable<A>): (mb: Observable<B>) => Observable<C>;
export function combine<A, B, C>(f: (a: A, b: B) => C): (ma: Observable<A>, mb: Observable<B>) => Observable<C>;
export function combine<A, B, C>(f: (a: A, b: B) => C): (ma: Observable<A>) => (mb: Observable<B>) => Observable<C>;

export function combineConsecutive<A, B>(combiner:(a: A, b: A) => B, seed: A, ma: Observable<A>): Property<B>;
export function combineConsecutive<A, B>(combiner:(a: A, b: A) => B, seed: A): (ma: Observable<A>) => Property<B>;
export function combineConsecutive<A, B>(combiner:(a: A, b: A) => B): (seed: A) => (ma: Observable<A>) => Property<B>;
export function combineConsecutive<A, B>(combiner:(a: A) => (b: A) => B, seed: A, ma: Observable<A>): Property<B>;
export function combineConsecutive<A, B>(combiner:(a: A) => (b: A) => B, seed: A): (ma: Observable<A>) => Property<B>;
export function combineConsecutive<A, B>(combiner:(a: A) => (b: A) => B): (seed: A) => (ma: Observable<A>) => Property<B>;


export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D, ma: Observable<A>, mb: Observable<B>, mc: Observable<C>): Observable<D>;
export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D): (ma: Observable<A>, mb: Observable<B>, mc: Observable<C>) => Observable<D>;
export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D): (ma: Observable<A>, mb: Observable<B>) => (mc: Observable<C>) => Observable<D>;
export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D): (ma: Observable<A>) => (mb: Observable<B>) => (mc: Observable<C>) => Observable<D>;

export function combineWith<A>(f: (...a: any) => A, ms: Observable<any>[]): Observable<A>;
export function combineWith<A>(f: (...a: any) => A): (ms: Observable<any>[]) => Observable<A>;


export function debounceAll<A>(delay: number, ma: Observable<A>): Observable<A>;
export function debounceAll<A>(delay: number): (ma: Observable<A>) => Observable<A>;

export function debounceImmediate<A>(dt: number, ma: Observable<A>): Observable<A>;
export function debounceImmediate<A>(dt: number): (ma: Observable<A>) => Observable<A>;

export function delay<A>(dt: number, ma: Observable<A>): Observable<A>;
export function delay<A>(dt: number): (ma: Observable<A>) => Observable<A>;

export function doError<A>(log: (error: Error) => any): (ma: Observable<A>) => Observable<A>;

export function doLog<A>(label: string, ma: Observable<A>): Observable<A>;
export function doLog<A>(label: string): (ma: Observable<A>) => Observable<A>;

export function error(e: any): Observable<any>;
export function endOnError<A>(ma: Observable<A>): Observable<A>;

export function filter<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function filter<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function filter<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function filter<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function first<A>(ma: Observable<A>): Observable<A>;

export function firstToPromise<A>(ma: Observable<A>): Promise<A>;

export function flatMap<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMap<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function flatMapConcat<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMapConcat<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function flatMapError<A, E>(fn: (e: E) => Observable<A>, ma: Observable<A>): Observable<A>;
export function flatMapError<A, E>(fn: (e: E) => Observable<A>): (ma: Observable<A>) => Observable<A>;

export function flatMapFirst<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMapFirst<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

/** @deprecated */
export function flatMapLatestMaybe<A, B>(fn: (a: A) => Observable<B>, ma: Observable<A>): Observable<B>;

export function flatScan<A, B>(reducer: (b: B, a: A) => Observable<B>, init: B, ma: EventStream<A>): Property<B>;
export function flatScan<A, B>(reducer: (b: B, a: A) => Observable<B>, init: B): (ma: EventStream<A>) => Property<B>;
export function flatScan<A, B>(reducer: (b: B) => (a: A) => Observable<B>, init: B, ma: EventStream<A>): Property<B>;

export function flatScanLatest<A, B>(reducer: (b: B, a: A) => Observable<B>, init: B, ma: EventStream<A>): Property<B>;
export function flatScanLatest<A, B>(reducer: (b: B, a: A) => Observable<B>, init: B): (ma: EventStream<A>) => Property<B>;
export function flatScanLatest<A, B>(reducer: (b: B) => (a: A) => Observable<B>, init: B, ma: EventStream<A>): Property<B>;

export function fold<A, B>(reducer: (acc: B, val: A) => B, seed: B, ma: Observable<A>): Observable<B>;
export function fold<A, B>(reducer: (acc: B, val: A) => B, seed: B): (ma: Observable<A>) => Observable<B>;
export function fold<A, B>(reducer: (acc: B, val: A) => B): (seed: B) => (ma: Observable<A>) => Observable<B>;

export function fromEvent<A>(name: string, target: any): EventStream<A>;
export function fromEvent<A>(name: string): (target: any) => EventStream<A>;

export function fromInterval<A>(dt: number, a: A): EventStream<A>;
export function fromInterval<A>(dt: number): (a: A) => EventStream<A>;

export function fromPromise<A>(p: Promise<A>): EventStream<A>;

// :: Observable Boolean -> Observable a -> Observable a
export function holdWhen<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function holdWhen<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function isSubsequentPrecededBy<A, B>(subsequent: Observable<A>, preceding: Observable<B>): Property<boolean>;
export function isSubsequentPrecededBy<A, B>(subsequent: Observable<A>): (preceding: Observable<B>) => Property<boolean>;

export function join<A>(ma: Observable<Observable<A>>): Observable<A>;

export function last<A>(ma: Observable<A>): Observable<A>;

export function lastToPromise<A>(ma: Observable<A>): Promise<A>;

export function later<A>(dt: number, a: A): EventStream<A>;
export function later<A>(dt: number): (a: A) => EventStream<A>;

export function makeProperty<A>(ma: EventStream<A>): Property<A>;

export function map<A, B>(fn: (x: A) => B, ma: Observable<A>): Observable<B>;
export function map<A, B>(fn: (x: A) => B): (ma: Observable<A>) => Observable<B>;

export function mapEnd<A>(fn: () => A, ma: Observable<A>): Observable<A>;
export function mapEnd<A>(fn: () => A): (ma: Observable<A>) => Observable<A>;

export function merge<A>(ma1: Observable<A>, ma2: Observable<A>): Observable<A>;
export function merge<A>(ma1: Observable<A>):  (ma2: Observable<A>) => Observable<A>;

export function mergeAll<A>(mas: Observable<A>[]): Observable<A>;

export function never(): EventStream<any>;
export function not(ma: Observable<boolean>): Observable<boolean>;
export function now<A>(x: A): EventStream<A>;

export  function of<A>(x: A): EventStream<A>;

export function or(ma: Observable<any>, mb: Observable<any>): Observable<boolean>;
export function or(ma: Observable<any>): (mb: Observable<any>) => Observable<boolean>;

export function pluck<T>(propertyName: string, mKv: Observable<Record<string, T>>): Observable<T>;
export function pluck(propertyName: string): <T>(mKv: Observable<Record<string, T>>) => Observable<T>;
export function pluck<T>(index: number, mKv: Observable<[T]>): Observable<T>;
export function pluck(index: number): <T>(mKv: Observable<[T]>) => Observable<T>;

export function reduce<A, B>(reducer: (acc: B, val: A) => B, seed: B, ma: Observable<A>): Observable<B>;
export function reduce<A, B>(reducer: (acc: B, val: A) => B, seed: B): (ma: Observable<A>) => Observable<B>;
export function reduce<A, B>(reducer: (acc: B, val: A) => B): (seed: B) => (ma: Observable<A>) => Observable<B>;

export function reject<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function reject<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function reject<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function reject<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function runEffects<A>(ma: Observable<A>): () => void;

export function sampledBy<A, B>(sampler: Observable<A>, samplee: Observable<B>): Observable<B>;
export function sampledBy<A, B>(sampler: Observable<A>): (samplee: Observable<B>) => Observable<B>;

export function sampledWithBy<A, B, C>(combinator: (a: A, b: B) => C, sampler: Observable<A>, samplee: Observable<B>): Observable<C>;
export function sampledWithBy<A, B, C>(combinator: (a: A, b: B) => C): (sampler: Observable<A>, samplee: Observable<B>) => Observable<C>;
export function sampledWithBy<A, B, C>(combinator: (a: A, b: B) => C, sampler: Observable<A>): (samplee: Observable<B>)=> Observable<C>;

// samples :: Observable a -> EventStream b -> EventStream a
export function samples<A, B>(samplee: Observable<B>, sampler: Observable<A>): Observable<B>;
export function samples<A, B>(samplee: Observable<B>): (sampler: Observable<A>) => Observable<B>;

export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B, ma: Observable<A>): Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B): (ma: Observable<A>) => Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B): (seed: B) => (ma: Observable<A>) => Observable<B>;

export function skip<A>(count: number, ma: Observable<A>): Observable<A>;
export function skip<A>(count: number): (ma: Observable<A>) => Observable<A>;

export function slidingWindow<A>(maxCount: number, minCount: number, ma: Observable<A>): Property<A[]>;
export function slidingWindow<A>(maxCount: number, minCount: number): (ma: Observable<A>) => Property<A[]>;

/** @deprecated */
export function skipDuplicates<A>(ma: Observable<A>): Observable<A>;
export function skipIdentical<A>(ma: Observable<A>): Observable<A>;
export function skipRamdaLikeEquals<A>(ma: Observable<A>): Observable<A>;

export function switchLatest<A>(ma: Observable<Observable<A>>): Observable<A>;

export function skipSame<A>(cmp: (left: A, right: A) => boolean, ma: Observable<A>): Observable<A>;
export function skipSame<A>(cmp: (left: A, right: A) => boolean): (ma: Observable<A>) => Observable<A>;

export function swap<A, B>(error2Value: (e: any) => B, value2Error: (a: A) => any): (ma: Observable<A>) => Observable<B>;

export function take<A>(count: number, ma: Observable<A>): Observable<A>;
export function take<A>(count: number): (ma: Observable<A>) => Observable<A>;

export function takeUntil<A>(stopper: Observable<any>, ma: Observable<A>): Observable<A>;
export function takeUntil<A>(stopper: Observable<any>): (ma: Observable<A>) => Observable<A>;

export function takeWhile<A>(f: (Observable<boolean>|((a: A) => boolean)), ma: Observable<A>): Observable<A>;
export function takeWhile<A>(f: (Observable<boolean>|((a: A) => boolean))): (ma: Observable<A>) => Observable<A>;

export function tap<A>(fn: (x: A) => void, ma: Observable<A>): Observable<A>;
export function tap<A>(fn: (x: A) => void): (ma: Observable<A>) => Observable<A>;

export function toProperty<A>(x: A, ma: EventStream<A>): Property<A>;
export function toProperty<A>(x: A): (ma: EventStream<A>) => Property<A>;

export function withLatest<A, B, C>(combiner: (sampleeEvent: A, samplerEvent: B) => C, samplee: Observable<A>, sampler: Observable<B>): Observable<C>;
export function withLatest<A, B, C>(combiner: (sampleeEvent: A, samplerEvent: B) => C, samplee: Observable<A>): (sampler: Observable<B>) => Observable<C>;
export function withLatest<A, B, C>(combiner: (sampleeEvent: A, samplerEvent: B) => C): (samplee: Observable<A>) => (sampler: Observable<B>) => Observable<C>;

export function withLatestAsPair<A, B>(samplee: Observable<A>, sampler: Observable<B>): Observable<[A, B]>;
export function withLatestAsPair<A, B>(samplee: Observable<A>): (sampler: Observable<B>) => Observable<[A, B]>;

export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>, seed: S, ma: Observable<A>): Observable<B>;
export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>): (seed: S, ma: Observable<A>) => Observable<B>;
export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>, seed: S): (ma: Observable<A>) => Observable<B>;
export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>): (seed: S) => (ma: Observable<A>) => Observable<B>;
