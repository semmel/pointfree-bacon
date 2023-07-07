import {append, equals, flip, identity, o} from 'ramda';
import chai from 'chai';
import {startWith} from "../index.js";
import * as B from 'baconjs';

const
	assert = chai.assert;

describe("startWith", function () {
	it("prepends to observables", () => {
		const
			s = B.sequentially(5, [5, 6, 7]);

		return startWith(1, s)
		.scan([], flip(append))
		.toPromise()
		.then(xs => assert.deepStrictEqual(xs, [1, 5, 6, 7]));
	});

	it("prepends to buses with immediate pushes", () => {
		const
			b = new B.Bus(),
			p = startWith("a", b)
			.scan([], flip(append))
			.toPromise()
			.then(xs => {
				assert.deepStrictEqual(xs, ["a", "x", "y"]);
			});

		b.push("x");

		setTimeout(
			v => {
				b.push(v);
				setTimeout(() => { b.end(); }, 10);
			},
			10,
			"y"
		);

		return p;
	});
});
