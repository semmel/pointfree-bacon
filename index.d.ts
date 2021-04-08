import {EventStream, Observable, Property} from 'baconjs';

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

export function fromEvent(name: string, target: Element): EventStream<Event>;
export function fromEvent(name: string): (target: Element) => EventStream<Event>;

export function fromPromise<A>(p: Promise<A>): EventStream<A>;

export function last<A>(ma: Observable<A>): Observable<A>;

export function makeProperty<A>(ma: EventStream<A>): Property<A>;

export function map<A, B>(fn: (x: A) => B, ma: Observable<A>): Observable<B>;
export function map<A, B>(fn: (x: A) => B): (ma: Observable<A>) => Observable<B>;

export function merge<A>(ma1: Observable<A>, ma2: Observable<A>): Observable<A>;
export function merge<A>(ma1: Observable<A>):  (ma2: Observable<A>) => Observable<A>;

export  function of<A>(x: A): EventStream<A>;

export function reject<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function reject<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function reject<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function reject<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B, ma: Observable<A>): Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B, seed: B): (ma: Observable<A>) => Observable<B>;
export function scan<A, B>(reducer: (acc: B, val: A) => B): (seed: B) => (ma: Observable<A>) => Observable<B>;

export function skipRamdaLikeEquals<A>(ma: Observable<A>): Observable<A>;

export function takeWhile<A>(f: (Property<boolean>|((a: A) => boolean)), ma: Observable<A>): Observable<A>;
export function takeWhile<A>(f: (Property<boolean>|((a: A) => boolean))): (ma: Observable<A>) => Observable<A>;

export function tap<A>(fn: (x: A) => void, ma: Observable<A>): Observable<A>;
export function tap<A>(fn: (x: A) => void): (ma: Observable<A>) => Observable<A>;

export function toProperty<A>(x: A, ma: EventStream<A>): Property<A>;
export function toProperty<A>(x: A): (ma: EventStream<A>) => Property<A>;

export function withLatestAsPair<A, B>(ma: Observable<A>, mb: Observable<B>): Observable<[A, B]>;
export function withLatestAsPair<A, B>(ma: Observable<A>): (mb: Observable<B>) => Observable<[A, B]>;
