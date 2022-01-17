import {append, equals, flip, identity, o} from 'ramda';
import chai from 'chai';
import * as B from "baconjs";
import {takeWhile} from "../index.js";

const
	assert = chai.assert;

describe("takeWhile for EventStream valve", function () {
	this.slow(1000);
	this.timeout(5000);
	let src, begin;
	
	beforeEach(function() {
		src = B.mergeAll(
			B.once("a"),
			B.later(150, "b"),
			B.later(350, "c")
		);
		
		begin = Date.now();
	});
	
	it("skips until the valve gets true, and ends after it gets false", () =>
		takeWhile(
			B.mergeAll(B.later(100, true), B.later(200, false)),
			src
		)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.approximately(Date.now() - begin, 350, 30);
			assert.deepStrictEqual(xs, ["b"]);
		})
	);
	
	it("ends even if the valve ends with true", () =>
		takeWhile(
			B.mergeAll(B.later(100, true), B.later(400, true))
			.takeUntil(B.later(200, undefined)),
			src
		)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, ["b"]);
			assert.approximately(Date.now() - begin, 350, 30);
		})
	);
	
	it("ends without a value if the valve begins with false", () =>
		takeWhile(
			B.mergeAll(B.once(false), B.later(100, true), B.later(400, true)),
			src
		)
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, []);
			assert.approximately(Date.now() - begin, 0, 30);
		})
	);
});
