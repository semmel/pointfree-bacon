/**
 * @file This is a rather dumb file consisting just of mechanical function conversions.
 * Created on 2019-07-12 for the WebRTCPeer project.
 * @copyright (c) 2019 exclusive for Visisoft OHG. All rights reserved.
 */

/**
 * @namespace PFB
 * @description reformulate Bacon observable methods as composable free curried functions
 */

/**
 * @name PFB#createError
 * @function
 * @param {*} error - error to be pipelined wrapped in a `Bacon.Error`
 * @return {Bacon.Error}
 */

/**
 * @name PFB#map
 * @template X, Y
 * @function
 * @param {function(X):Y} fn - mapping function `X -> Y`
 * @return {function(Bacon.EventStream<X>): Bacon.EventStream<Y>}
 */

/**
 * @name PFB#flatMap
 * @template X, Y
 * @function
 * @param {function(X): Bacon.EventStream<Y>} fn - mapping function `X -> Bacon.Observable<Y>`
 * @return {function(Bacon.EventStream<X>): Bacon.EventStream<Y>}
 */

/**
 * @name PFB#flatMapConcat
 * @template X, Y
 * @function
 * @param {function(X): Bacon.EventStream<Y>} fn - mapping function `X -> Bacon.Observable<Y>`
 * @return {function(Bacon.EventStream<X>): Bacon.EventStream<Y>}
 */

/**
 * @name PFB#flatMapP
 * @template X, Y
 * @function
 * @param {function(X): Promise<Y>} fn - mapping function `X -> Promise<Y>`
 * @return {function(Bacon.Observable<X>): Bacon.Observable<Y>}
 */

/**
 * @name PFB#doAction
 * @template T
 * @function
 * @param {function(T): *} sideEffectFn
 * @return {function(Bacon.EventStream<T>): Bacon.EventStream<T>}
 */

/**
 * @name PFB#doAnyway
 * @template T
 * @function
 * @param {function(T): *} sideEffectFn
 * @return {function(Bacon.EventStream<T>): Bacon.EventStream<T>}
 */

import { and as Rand, binary, construct, complement, compose, curry, curryN, equals, F, flip,
	identity, identical, o, or as Ror, pair, partialRight, pipe, T, tap as Rtap, tryCatch, unapply, unary
} from 'semmel-ramda';
import * as Bacon from 'baconjs';
import {chain as chain_mb, isJust, maybe, map as map_mb, nothing, of as of_mb} from '@visisoft/staticland/maybe';
import filter from './src/filter.js';
import reject from './src/reject.js';
import takeWhile from './src/takeWhile.js';

const
	// Creators //
	
	fromEvent = curry((eventName, eventEmitter) => Bacon.fromEvent(eventEmitter, eventName)),
	
	// fromInterval :: Number -> a -> Observable any a
	fromInterval = curry((interval, value) => Bacon.interval(interval, value)),
	
	// fromPromise :: Promise e a -> EventStream e a
	fromPromise = unary(Bacon.fromPromise),
	
	/**
	 * Is it like `now` from @most/core ?
	 * @template T
	 * @param {T} value
	 * @return {Bacon.EventStream<T>}
	 */
	// now :: a -> EventStream () a
	now = value => Bacon.once(value),
	// empty :: () -> EventStream () ()
	empty = () => Bacon.once(),
	// constant :: a -> Property any a
	constant = value => Bacon.constant(value),
	
	// error :: e -> EventStream e any
	error = e => Bacon.once(new Bacon.Error(e)),
	
	// :: number -> a -> EventStream a
	later = curry((delay, value) => Bacon.later(delay, value)),
	
	makeProperty = eventStream => eventStream.toProperty(),
	
	// Combinators //
	
	// :: Observable a -> Observable b -> Property Boolean
	isSubsequentPrecededBy = curry((subsequentEventStream, precedingEventStream) => precedingEventStream.awaiting(subsequentEventStream)),
	
	/* could be called "lift", could it not?  only if the combinator is curried??
	* It's not equivalent to the original Bacon.combineWith because THAT accepts a variadic Property arguments. */
	// combineWith :: ((a, b, ..., m) -> n) -> [Observable a, Observable b, ..., Observable m] -> Property n
	combineWith = curry((func, streams) => Bacon.combineWith(func, streams)),
	lift = func => curryN(func.length, unapply(combineWith(func))/*(...streams) => Bacon.combineWith(func, streams)*/),
	// combine :: (a -> b -> c) -> Observable a -> Observable b -> Property c
	combine = curry((combiner, left, right) => left.combine(right, combiner)),
	// :: ((a -> a) -> b) -> a -> Observable a -> Property b
	combineConsecutive = curry((combiner, seed, observable) =>
		observable.diff(seed, combiner)
	),
	// justLeftCombine :: (a -> b -> c) -> Observable b -> Observable Maybe a -> Property Maybe c
	justLeftCombine = curry((justCombiner, right, left) =>
		left.combine(right, (maybeLeft, rightValue) => map_mb(partialRight(justCombiner, [rightValue]), maybeLeft))
	),
	// justLeftCombineChainToMaybe :: (a -> b -> Maybe c) -> Observable b -> Observable Maybe a -> Property Maybe c
	justLeftCombineChainToMaybe = curry((justCombiner, right, left) =>
		left.combine(right, (maybeLeft, rightValue) => chain_mb(partialRight(justCombiner, [rightValue]), maybeLeft))
	),
	and = combine(Rand),
	// :: Observable a -> Observable b -> Property (a | b)
	or = combine(Ror),
	/**
	 * WARNING: this is Ramda-style concat, that should be concat(preceding, following)!
	 */
	// concat :: Observable b -> Observable a -> Observable (a|b)
	concat = curry((precedingObservable, nextObservable) => precedingObservable.concat(nextObservable)),
	/**
	 * Rather use flip(concat)
	 */
	// append :: Observable b -> Observable a -> Observable (a|b)
	append = curry((nextObservable, precedingObservable) => precedingObservable.concat(nextObservable)),
	
	// Buffering //
	
	// n = Integer
	// :: n -> Observable e a -> Observable e Array n a
	bufferWithCount = curry((count, observable) => observable.bufferWithCount(count)),
	
	changes = observable => observable.changes(),
	createError = construct(Bacon.Error),
	debounceImmediate = curry((delay, observable) => observable.debounceImmediate(delay)),
	delay = curry((delay, observable) => observable.delay(delay)),
	// :: (a -> *) -> Observable a -> Observable a
	doAction = curry((sideEffectFn, observable) => observable.doAction(sideEffectFn)),
	doError = curry((sideEffectFn, observable) => observable.doError(sideEffectFn)),
	doEnd = curry((sideEffectFn, observable) => observable.doEnd(sideEffectFn)),
	doLog = curry((description, observable) => observable.doLog(description)),
	/**
	 * @param {Bacon.Observable} observable
	 * @param {Bacon.Property} property
	 * @return {Bacon.Property}
	 */
	eagerUntil = curry(
		(observable, property) => {
			property
			.takeUntil(observable)
			.onValue(identity);
			
			return property;
		}),
	endOnError = observable => observable.endOnError(),
	first = observable => observable.first(),
	map_o = curry((fn, observable) => observable.map(fn)),
	// mapEnd :: (() -> a) -> Observable a -> Observable a
	mapEnd = curry((fn, observable) => observable.mapEnd(fn)),
	// mapError :: (e -> a) -> Observable e a -> Observable e a
	mapError = curry((fnOrVal, observable) => observable.mapError(fnOrVal)),
	// Essentially like flip(Promise.then)
	// coalesce :: (e -> b) -> (a -> b) -> Observable e a -> Observable e b
	coalesce = curry((onNextError, onNextValue, observable) =>
		observable.transform((baconEvent, sink) => {
			if (Bacon.hasValue(baconEvent)) {
				return sink(new Bacon.Next(onNextValue(baconEvent.value)));
			}
			else if (Bacon.isError(baconEvent)) {
				return sink(new Bacon.Next(onNextError(baconEvent.error)));
			}
			else {
				return sink(baconEvent);
			}
		})
	),
	// mergeAll :: Array Observable a -> Observable a
	mergeAll = observables => Bacon.mergeAll(observables),
	// note that as of Bacon 3.0.12 the instance method 'merge' is only defined for EventStream, as Bacon.mergeAll also works for Properties
	// merge :: Observable a -> Observable b -> Observable (a|b)
	merge = curry((takenInObservable, observable) => Bacon.mergeAll(observable, takenInObservable)),
	not = observable => observable.not(),
	// flatMap :: (a -> Observable b) -> Observable a -> Observable b
	flatMap = curry((fn, observable) => observable.flatMap(fn)),
	// filterJust :: Observable Maybe a -> Observable a
	filterJust = flatMap(maybe(Bacon.never, identity)),
	// flatMapError :: (e -> Observable d b) -> Observable e a -> Observable d b
	flatMapError = curry((fn, observable) => observable.flatMapError(fn)),
	// flatMapConcat :: (a -> Observable b) -> Observable a -> Observable b
	flatMapConcat = curry((fn, observable) => observable.flatMapConcat(fn)),
	flatMapFirst = curry((fn, observable) => observable.flatMapFirst(fn)),
	// :: (a -> Observable b) -> Observable a -> Observable b
	flatMapLatest = curry((fn, observable) => observable.flatMapLatest(fn)),
	/**
	 * @deprecated
	 * flatMapLatestMaybe(f, mma) = pipe(
	 *    () => mma,
	 *    map_o(map_mb(f)),
	 *    chain_o_latest(maybeOfBaconObservableToBaconObservableOfMaybe)
	 * )();
	 */
	// :: (a -> Observable b) -> Observable Maybe a -> Observable Maybe b
	flatMapLatestMaybe = curry((fn, observable) =>
		flatMapLatest(
			maybe(compose(Bacon.once, nothing), o(map_o(of_mb), fn)),
			observable
		)
	),
	// flatMapP :: (a -> Promise b) -> Observable a -> Observable b
	flatMapP = curry((fn, observable) => flatMap(o(Bacon.fromPromise, fn), observable)),
	// joinP :: Observable (Promise a) -> Observable a
	joinP = flatMapP(identity),
	// flatScan should work for Properties too. It's implementation is based on flatMapConcat.
	// flatScan :: ((b, a) -> Observable b) -> b -> EventStream a -> Property b
	flatScan = curry((asyncReducer, seed, eventStream) => eventStream.flatScan(seed, asyncReducer)),
	
	// flatScanLatest :: ((b, a) -> Observable b) -> b -> EventStream a -> Property b
	flatScanLatest = curry((asyncReducer, seed, observable) =>
		Bacon.once(seed)
		.concat(
			observable
			.flatMapLatest((function(){
				let state = seed;
				return value =>
					asyncReducer(state, value)
					.doAction(innerValue => { state = innerValue; });
			}()))
		)
		.toProperty()
	),
	
	// :: Observable Boolean -> Observable a -> Observable a
	holdWhen = curry((valve, observable) => observable.holdWhen(valve.toProperty())),
	
	last = observable => observable.last(),
	
	// onValue :: (a -> *) -> Observable a -> (() -> *)
	onValue = curry((fn, observable) => observable.onValue(fn)),
	
	runEffects = observable => observable.onValue(identity),
	// onJustValue :: (a -> *) -> Observable Maybe a -> (() -> *)
	onJustValue = curry((fn, observable) => onValue(maybe(identity, fn), observable)),
	// isJustValue :: Observable Maybe a -> Observable Boolean
	isJustValue = map_o(maybe(F, T)),
	
	fold = curry((reducer, seed, observable) => observable.fold(seed, reducer)),
	// scan :: ((b, a) -> b) -> b -> Observable a -> Property b
	scan = curry((reducer, seed, observable) => observable.scan(seed, reducer)),
	
	// see https://crocks.dev/docs/crocks/Async.html#swap
	// swap :: (e -> b) -> (a -> c) -> Observable e a -> Observable c b
	swap = curry((errorToValue, valueToError, observable) =>
		observable.transform((baconEvent, sink) => {
			if (Bacon.hasValue(baconEvent)) {
				return sink(new Bacon.Error(valueToError(baconEvent.value)));
			}
			else if (Bacon.isError(baconEvent)) {
				return sink(new Bacon.Next(errorToValue(baconEvent.error)));
			}
			else {
				return sink(baconEvent);
			}
		})
	),
	
	regeneratorEndSymbol = Symbol('regeneratorEndSymbol'),
	/**
	 *
	 * @param {Bacon.Bus} bus
	 * @param {function(): Promise<Bacon.EventStream>} generator
	 */
	regenerateReplugBus = (bus, generator) => {
		generator()
		.then(
			events => {
				bus.plug(events);
				events.onEnd(() => regenerateReplugBus(bus, generator));
			},
			e => {
				if (e !== regeneratorEndSymbol) {
					return Promise.reject(e);
				}
			}
		);
	},
	// sampledBy :: Observable a -> Observable b -> Observable b
	sampledBy = curry((sampler, samplee) => samplee.sampledBy(sampler)),
	// sampledWithBy :: ((a, b) -> c) -> Observable a -> Observable b -> Observable c
	sampledWithBy = curry((combinatorFn, sampler, samplee) => samplee.sampledBy(sampler, flip(combinatorFn))),
	// samples :: Observable a -> EventStream b -> EventStream a
	samples = curry((samplee, sampler) => sampler.withLatestFrom(samplee, (unused, observableValue) => observableValue)),
	nothingSeedValue = Symbol('nothingSeedValue'),
	/**
	 * Different to `.debounce` this implementation also delays initial values of properties.
	 * @template T
	 * @param {Number} delay
	 * @return {function(Bacon.Observable<T>): Bacon.Observable<T>}
	 * @example
	 *    debounceAll(20)(Bacon.later(10, "X").toProperty("Y")) // -> "X", <end>
	 */
	// debounceAll :: Number -> Observable t -> Observable t
	debounceAll = curry((delay, observable) => observable.flatMapLatest(x => Bacon.later(delay, x))),
	// skip :: Number -> Observable t -> Observable t
	skip = curry((count, observable) => observable.skip(count)),
	/**
	 * This implementation differs from the original implementation
	 * in that it does not consider the `isInitial` property of incoming events.
	 * Due to a bug (https://github.com/baconjs/bacon.js/issues/753) a stream may encounter
	 * multiple initial events. This reworked version of `skipDuplicates` skips these too!
	 * @template T
	 * @param {function(T, T):Boolean} equals
	 * @return {function(Bacon.Observable<T>): Bacon.Observable<T>}
	 * @deprecated because of unclear arity using `skipSame` is recommended
	 */
	skipDuplicates = (equals = identical) => observable =>
		observable.withStateMachine(nothingSeedValue, (acc, event) => {
			if (!event.hasValue) {
				return [acc, [event]];
			}
			
			return (acc !== nothingSeedValue) && equals(acc, event.value)
				? [acc, []]
				: [event.value, [event]];
		}),
	
	/**
	 * This implementation differs from the original `skipDuplicates()` implementation
	 * in that it does not consider the `isInitial` property of incoming values, but rather
	 * treats all events equally.
	 */
	skipSame = curry((isEqual, observable) =>
		observable.withStateMachine(nothingSeedValue, (acc, event) => {
			if (!event.hasValue) {
				return [acc, [event]];
			}
			
			return (acc !== nothingSeedValue) && isEqual(acc, event.value)
				? [acc, []]
				: [event.value, [event]];
		})
	),
	
	skipRamdaLikeEquals = observable => observable.skipDuplicates(equals),
	skipIdentical = observable => observable.skipDuplicates(),
	slidingWindow = curry((maximumNumberOfValues, minimumNumberOfValues, observable) => observable.slidingWindow(maximumNumberOfValues, minimumNumberOfValues)),
	startWith = curry((seed, observable) => observable.startWith(seed)),
	// Mimics @most/core tap
	// tap :: (a -> *) -> Stream a -> Stream a
	tap = curry((f, observable) => observable.flatMap(tryCatch(o(now, Rtap(f)), e => new Bacon.Error(e)))),
	// chainTap :: :: (a -> Stream g *) -> Stream e a -> Stream (e|g) a
	chainTap = curry((f, observable) => observable.flatMap(x => {
		try {
			return f(x)
			.mapEnd(x)
			.endOnError()
			.last();
		}
		catch (e) {
			return new Bacon.Error(e);
		}
	})),
	take = curry((count, observable) => observable.take(count)),
	takeUntil = curry((stopper, observable) => observable.takeUntil(stopper)),
	throttle = curry((minimumEmissionInterval, observable) => observable.throttle(minimumEmissionInterval)),
	// toEventStream :: Property a -> EventStream a
	toEventStream = property => property.toEventStream(),
	// :: ((Event a, EventSink b) -> Reply) -> Observable a -> Observable b
	// EventSink b = Event b -> Reply
	// Reply = String
	transform = curry((transformer, observable) => observable.transform(transformer)),
	// firstToPromise :: Observable a -> Promise a
	firstToPromise = observable => observable.firstToPromise(),
	// lastToPromise :: Observable a -> Promise a
	lastToPromise = observable => observable.toPromise(),
	// toProperty :: a -> EventStream a -> Property a
	toProperty = curry((initialValue, eventStream) => eventStream.toProperty(initialValue)),
	// withLatest :: ((a, b) -> c) -> Observable a -> Observable b -> Observable c
	withLatest = curry((combinator, samplee, sampler) => sampler.withLatestFrom(samplee, flip(binary(combinator)))),
	// withLatestAsPair :: Observable a -> Observable b -> Observable Pair a b
	withLatestAsPair = withLatest(pair),
	withStateMachine = curry((reducer, initialValue, observable) => observable.withStateMachine(initialValue, reducer)),
	
	// push :: a -> Bus a -> Bus a
	push = curry((valueOrBaconError, bus) => {
		bus.push(valueOrBaconError);
		return bus;
	});
	
export let chain = flatMap;
export let chainRej = flatMapError;
export let of = now;
export let map = map_o;
export let prepend = concat;
export let skipEquals = skipRamdaLikeEquals;

export {
	and,
	append,
	bufferWithCount,
	chainTap,
	coalesce,
	concat,
	changes,
	combine,
	combineConsecutive,
	constant,
	justLeftCombine,
	justLeftCombineChainToMaybe,
	combineWith,
	createError,
	debounceAll,
	debounceImmediate,
	delay,
	doAction,
	doEnd,
	doError,
	doLog,
	eagerUntil,
	empty,
	endOnError,
	error,
	filter,
	filterJust,
	first,
	firstToPromise,
	flatMap,
	flatMapConcat,
	flatMapError,
	flatMapFirst,
	flatMapLatest,
	flatMapLatestMaybe,
	flatMapP,
	flatScan,
	flatScanLatest,
	fold,
	fromEvent,
	fromPromise,
	fromInterval,
	holdWhen,
	isJustValue,
	isSubsequentPrecededBy,
	joinP,
	last,
	lastToPromise,
	later,
	lift,
	makeProperty,
	mapEnd,
	mapError,
	merge,
	mergeAll,
	not,
	now,
	onJustValue,
	onValue,
	or,
	regeneratorEndSymbol,
	regenerateReplugBus,
	reject,
	runEffects,
	sampledBy,
	sampledWithBy,
	samples,
	scan,
	skip,
	skipDuplicates,
	skipIdentical,
	skipRamdaLikeEquals,
	skipSame,
	slidingWindow,
	startWith,
	swap,
	take,
	takeUntil,
	takeWhile,
	tap,
	throttle,
	toEventStream,
	toProperty,
	transform,
	withLatest,
	withLatestAsPair,
	withStateMachine
};

