import {append, equals, flip, identity, o, pipe} from 'ramda';
import chai from 'chai';
import * as Bacon from "baconjs";
import {flatMapLatest, fold as reduce_o, lastToPromise, take as take_o} from "../index.js";

const
	assert = chai.assert;

describe("flatMapLatest", function() {
	this.slow(1000);

	it ("disposes the preceding sub-stream before creating the following", () => {
		const
			lifecycleEvents = [],
			N = 2,
			sourceDT = 50,

			subStream = x => {
				lifecycleEvents.push(`C${x}`);
				return Bacon.fromBinder(sink => {
					// repeat the event N times
					const subDT = sourceDT / (N + 1); // setInterval does not emit at t=0
					let interval;
					const begin = setTimeout(
						() => {
							interval = setInterval(sink, subDT, x);
						},
						subDT / 2
					);

					return () => {
						lifecycleEvents.push(`D${x}`);
						clearInterval(interval);
						clearTimeout(begin);
					};
				});
			};

		return flatMapLatest(
			subStream,
			Bacon.sequentially(sourceDT, [1, 2, 3]))
		.take(6)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, [1, 1, 2, 2, 3, 3]);
			assert.deepStrictEqual(lifecycleEvents, ["C1", "D1", "C2", "D2", "C3", "D3"]);
		});
	});
});
