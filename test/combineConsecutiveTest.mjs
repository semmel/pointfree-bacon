import {append, equals, flip, identity, o} from 'ramda';
import chai from 'chai';
import {combineConsecutive} from "../index.js";
import * as Bacon from "baconjs";

const
	assert = chai.assert;

describe("combineConsecutive", function () {
	const distance = function (a,b) { return a - b; };
	
	it("computes running differences of a number series", () =>
		combineConsecutive(distance, 10, Bacon.sequentially(1, [9, 7, 4]))
		.reduce([], flip(append))
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, [1, 2, 3]);
		})
	);
});
