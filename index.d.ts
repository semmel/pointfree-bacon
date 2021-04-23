import {EventStream, Observable, Property} from 'baconjs';
import {StateF} from "baconjs/types/withstatemachine";

export function chain<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function chain<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function concat<A, B>(ma: Observable<A>, mb: Observable<B>): Observable<A|B>;
export function concat<A, B>(ma: Observable<A>): (mb: Observable<B>) => Observable<A|B>;

export function combine<A, B, C>(f: (a: A, b: B) => C, ma: Observable<A>, mb: Observable<B>): Observable<C>;
export function combine<A, B, C>(f: (a: A, b: B) => C): (ma: Observable<A>, mb: Observable<B>) => Observable<C>;
export function combine<A, B, C>(f: (a: A, b: B) => C): (ma: Observable<A>) => (mb: Observable<B>) => Observable<C>;

export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D, ma: Observable<A>, mb: Observable<B>, mc: Observable<C>): Observable<D>;
export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D): (ma: Observable<A>, mb: Observable<B>, mc: Observable<C>) => Observable<D>;
export function combineWith<A, B, C, D>(f: (a: A, b: B, c: C) => D): (ma: Observable<A>) => (mb: Observable<B>) => (mc: Observable<C>) => Observable<D>;

export function debounceAll<A>(delay: number, ma: Observable<A>): Observable<A>;
export function debounceAll<A>(delay: number): (ma: Observable<A>) => Observable<A>;

export function delay<A>(dt: number, ma: Observable<A>): Observable<A>;
export function delay<A>(dt: number): (ma: Observable<A>) => Observable<A>;

export function error(e: any): Observable<any>;

export function filter<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function filter<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function filter<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function filter<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function first<A>(ma: Observable<A>): Observable<A>;

export function flatMap<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMap<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function fromEvent(name: string, target: any): EventStream<Event>;
export function fromEvent(name: string): (target: any) => EventStream<Event>;

export function fromPromise<A>(p: Promise<A>): EventStream<A>;

// :: Observable Boolean -> Observable a -> Observable a
export function holdWhen<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function holdWhen<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function isSubsequentPrecededBy<A, B>(subsequent: Observable<A>, preceding: Observable<B>): Property<boolean>;
export function isSubsequentPrecededBy<A, B>(subsequent: Observable<A>): (preceding: Observable<B>) => Property<boolean>;

export function last<A>(ma: Observable<A>): Observable<A>;

export function makeProperty<A>(ma: EventStream<A>): Property<A>;

export function map<A, B>(fn: (x: A) => B, ma: Observable<A>): Observable<B>;
export function map<A, B>(fn: (x: A) => B): (ma: Observable<A>) => Observable<B>;

export function merge<A>(ma1: Observable<A>, ma2: Observable<A>): Observable<A>;
export function merge<A>(ma1: Observable<A>):  (ma2: Observable<A>) => Observable<A>;

export function now<A>(x: A): EventStream<A>;

export  function of<A>(x: A): EventStream<A>;

export function reject<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function reject<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function reject<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function reject<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

// samples :: Observable a -> EventStream b -> EventStream a
export function samples<A, B>(samplee: Observable<B>, sampler: Observable<A>): Observable<B>;
export function samples<A, B>(samplee: Observable<B>): (sampler: Observable<A>) => Observable<B>;

export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B, ma: Observable<A>): Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B): (ma: Observable<A>) => Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B): (seed: B) => (ma: Observable<A>) => Observable<B>;

export function skip<A>(count: number, ma: Observable<A>): Observable<A>;
export function skip<A>(count: number): (ma: Observable<A>) => Observable<A>;

export function skipIdentical<A>(ma: Observable<A>): Observable<A>;
export function skipRamdaLikeEquals<A>(ma: Observable<A>): Observable<A>;

export function take<A>(count: number, ma: Observable<A>): Observable<A>;
export function take<A>(count: number): (ma: Observable<A>) => Observable<A>;

export function takeWhile<A>(f: (Property<boolean>|((a: A) => boolean)), ma: Observable<A>): Observable<A>;
export function takeWhile<A>(f: (Property<boolean>|((a: A) => boolean))): (ma: Observable<A>) => Observable<A>;

export function tap<A>(fn: (x: A) => void, ma: Observable<A>): Observable<A>;
export function tap<A>(fn: (x: A) => void): (ma: Observable<A>) => Observable<A>;

export function toProperty<A>(x: A, ma: EventStream<A>): Property<A>;
export function toProperty<A>(x: A): (ma: EventStream<A>) => Property<A>;

export function withLatestAsPair<A, B>(samplee: Observable<A>, sampler: Observable<B>): Observable<[A, B]>;
export function withLatestAsPair<A, B>(samplee: Observable<A>): (sampler: Observable<B>) => Observable<[A, B]>;

export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>, seed: S, ma: Observable<A>): Observable<B>;
export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>): (seed: S, ma: Observable<A>) => Observable<B>;
export function withStateMachine<A, S, B>(reducer: StateF<A, S, B>): (seed: S) => (ma: Observable<A>) => Observable<B>;
