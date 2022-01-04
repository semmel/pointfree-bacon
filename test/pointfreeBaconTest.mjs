import { always, append, equals, flip, identity, o, pipe} from 'semmel-ramda';
import chai from 'chai';
import * as Bacon from
		'baconjs';
import {
	filter,
	filterJust,
	firstToPromise,
	flatMap,
	flatMapLatest,
	flatScanLatest,
	lastToPromise,
	mapEnd,
	fold as reduce_o,
	reject,
	tap as tap_o,
	take as take_o,
	chainTap, skipSame,
} from
		'../index.js';
import { nothing, of } from
		'@visisoft/staticland/maybe';

const
	assert = chai.assert;

describe("flatScanLatest", function() {
	this.slow(5000);
	
	it("produces just the seed value if the inner stream never emits", pipe(
		() => Bacon.once(1),
		flatScanLatest(() => Bacon.never(), 0),
		reduce_o(flip(append), []),
		flatMap(Bacon.try(xs => { assert.deepStrictEqual(xs, [0]); })),
		lastToPromise
	));
	
	it("produces a sequence of the seed value and all reducer emitted values", pipe(
		() => Bacon.mergeAll([
			Bacon.once(10),
			Bacon.later(200, 100),
			Bacon.later(275, 1000)
		]),
		flatScanLatest(
			(state, outer) =>
				Bacon.sequentially(50, [state + outer, state + outer + 1, state + outer + 2]),
			0
		),
		reduce_o(flip(append), []),
		flatMap(Bacon.try(xs => { assert.deepStrictEqual(xs, [0, 10, 11, 12, 112, 1112, 1113, 1114]); })),
		lastToPromise
	));
});

describe("flatMapLatest", function() {
	this.slow(1000);
	
	it ("disposes the preceding sub-stream before creating the following", () => {
		const
			lifecycleEvents = [],
			
			subStream = x => {
				lifecycleEvents.push(`C${x}`);
				return Bacon.fromBinder(sink => {
					const interval = setInterval(sink, 10, x);
					return () => {
						lifecycleEvents.push(`D${x}`);
						clearInterval(interval);
					};
				});
			};
		
		return pipe(
			() => Bacon.sequentially(25, [1, 2, 3]),
			flatMapLatest(subStream),
			take_o(6),
			reduce_o(flip(append), []),
			lastToPromise
		)()
		.then(xs => {
			assert.deepStrictEqual(xs, [1, 1, 2, 2, 3, 3]);
			assert.deepStrictEqual(lifecycleEvents, ["C1", "D1", "C2", "D2", "C3", "D3"]);
		});
	});
});

describe("Pointfree Maybe Streams", function () {
	describe(".filterJust", function() {
		it("absorbs nothing values", () =>
			pipe(
				Bacon.once,
				filterJust,
				mapEnd(always("bar")),
				flatMap(Bacon.try(x => { assert.strictEqual(x, "bar"); })),
				firstToPromise
			)(nothing())
		);
		
		it("unwraps just values", () =>
			pipe(
				Bacon.fromArray,
				filterJust,
				reduce_o(flip(append), []),
				flatMap(Bacon.try(xs => { assert.deepStrictEqual(xs, [0, 1, 3]); })),
				lastToPromise
			)([of(0), of(1), nothing(), of(3)])
		);
	});
});

describe("tap", function() {
	it ("execute the side effect and forwards the event values", () => {
		let valueSum = 0;
		return pipe(
			() => Bacon.fromArray([1, 2]),
			tap_o(x => valueSum += x),
			reduce_o(flip(append), []),
			lastToPromise
		)()
		.then(acc => {
			assert.deepStrictEqual(acc, [1, 2]);
			assert.strictEqual(valueSum, 3);
		});
	});
	
	it("continues with the error thrown in the side-effect", () =>
		pipe(
			() => Bacon.once("foo"),
			tap_o(() => { throw {message: "bar"}; }),
			lastToPromise,
		)()
		.then(
			x => { assert.fail(`Should not succeed with ${x}`); },
			e => { assert.deepStrictEqual(e, {message: "bar"}); }
		)
	);
});

describe("chainTap", function() {
	it ("waits for the last event in the side effect stream and then continues with the source value", () => {
		let isSideEffectCalled = false;
		const beginT = Date.now();
		
		return chainTap(
			s => {
				isSideEffectCalled = true;
				return Bacon.once(`${s}-bar`).concat(Bacon.later(300, "baz"));
			},
			Bacon.once("foo")
		)
		.toPromise()
		.then(x => {
			assert.strictEqual(x, "foo");
			assert.isTrue(isSideEffectCalled);
			assert.approximately(Date.now() - beginT, 300, 50);
		});
	});
	
	it ("propagates the first error in the side-effect stream", () =>
		chainTap(
			x => Bacon.fromArray([x, new Bacon.Error("e-foo"), new Bacon.Error("e-bar")]),
			Bacon.once("bar")
		)
		.toPromise()
		.then(
			x => { assert.fail(`must not succeed with ${x}`); },
			e => { assert.strictEqual(e, "e-foo"); }
		)
	);
});

describe("skipSame", function() {
	it("skips consecutive 'equals'", () =>
		skipSame(equals, Bacon.fromArray([0, 1, 1, 2, 3, 2, 4, 4]))
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, [0, 1, 2, 3, 2, 4]);
		})
	);
	
	it("calls the comparison fn only with event values", () => {
		class Foo {
			constructor(text) {
				this.text = text;
			}
		}
		
		return skipSame(
			(a, b) => {
				assert.instanceOf(a, Foo);
				assert.instanceOf(b, Foo);
				return a.text === b.text;
			},
			Bacon.fromArray([new Foo("a"), new Foo("b"), new Foo("b"), new Foo("a")])
		)
		.map(foo => foo.text)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, ["a", "b", "a"]);
		});
	});
});

