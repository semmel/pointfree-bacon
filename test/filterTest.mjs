import chai from 'chai';
import {filter, reject} from "../index.js";
import * as Bacon from "baconjs";
import {append, flip} from "ramda";

const
	assert = chai.assert;

describe("filter/reject", function() {
	this.slow(1000);
	this.timeout(5000);
	
	it("filters in predicate positives", () =>
		filter(x => x % 2 === 0, Bacon.fromArray([0, 1, 2, 3]))
		.reduce([], flip(append))
		.toPromise()
		.then(xs => { assert.deepStrictEqual(xs, [0, 2]); })
	);
	
	it("filters in when the valve EventStream is true", () => {
		const
			s = Bacon.sequentially(50, [50, 100, 150, 200, 250, 300]),
			valve = Bacon.mergeAll(Bacon.once(true), Bacon.later(75, false), Bacon.later(225, true));
		
		return filter(valve, s)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => { assert.deepStrictEqual(xs, [50, 250, 300]); });
	});
	
	it("filter treats the valve stream as falsy until it produces its first value", () => {
		const
			s = Bacon.sequentially(50, [50, 100, 150, 200, 250, 300]),
			valve = Bacon.later(225, true);
		
		return filter(valve, s)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => { assert.deepStrictEqual(xs, [250, 300]); });
	});
	
	it("rejects out when the valve EventStream is true", () => {
		const
			s = Bacon.sequentially(50, [50, 100, 150, 200, 250, 300]),
			valve = Bacon.mergeAll(Bacon.once(true), Bacon.later(75, false), Bacon.later(225, true));
		
		return reject(valve, s)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => { assert.deepStrictEqual(xs, [100, 150, 200]); });
	});
	
	it("reject treats the valve stream as falsy until it produces its first value", () => {
		const
			s = Bacon.sequentially(50, [50, 100, 150, 200, 250, 300]),
			valve = Bacon.later(225, true);
		
		return reject(valve, s)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => { assert.deepStrictEqual(xs, [50, 100, 150, 200]); });
	});
});
