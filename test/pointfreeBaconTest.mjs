import { always, append, equals, flip, identity, o, pipe} from 'semmel-ramda';
import chai from 'chai';
import * as Bacon from
		'baconjs';
import { filterJust, firstToPromise, flatMap, flatScanLatest, lastToPromise, mapEnd, fold as reduce_o } from
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