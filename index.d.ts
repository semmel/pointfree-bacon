import {EventStream, Observable, Property} from 'baconjs';

export function chain<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function chain<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function concat<A, B>(ma: Observable<A>, mb: Observable<B>): Observable<A|B>;
export function concat<A, B>(ma: Observable<A>): (mb: Observable<B>) => Observable<A|B>;

export function error(e: any): Observable<any>;

export function filter<A>(fn: (x: A) => boolean, ma: Observable<A>): Observable<A>;
export function filter<A>(fn: (x: A) => boolean): (ma: Observable<A>) => Observable<A>;
export function filter<A>(valve: Observable<boolean>, ma: Observable<A>): Observable<A>;
export function filter<A>(valve: Observable<boolean>): (ma: Observable<A>) => Observable<A>;

export function flatMap<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMap<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>, ma: Observable<A>): Observable<B>;
export function flatMapLatest<A, B>(fn: (x: A) => Observable<B>): (ma: Observable<A>) => Observable<B>;

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

export function skipRamdaLikeEquals<A>(ma: Observable<A>): Observable<A>;

export function tap<A>(fn: (x: A) => void, ma: Observable<A>): Observable<A>;
export function tap<A>(fn: (x: A) => void): (ma: Observable<A>) => Observable<A>;

export function toProperty<A>(x: A, ma: EventStream<A>): Property<A>;
export function toProperty<A>(x: A): (ma: EventStream<A>) => Property<A>;
