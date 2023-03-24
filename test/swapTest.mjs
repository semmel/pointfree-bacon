import { append, equals, flip, identity, o, pipe } from 'ramda';
import chai from 'chai';
import { swap } from "../index.js";
import * as B from 'baconjs';

const
	assert = chai.assert;

describe("swap", function () {
	const
		sampleError = new Error("qux");
	
	it("simple swap with identity mappings", () =>
		swap(identity, identity)(B.sequentially(10, ["foo", new B.Error(sampleError), "bar"]))
		.mapError(e => `error-${e}`)
		.scan([], flip(append))
		.toPromise()
		.then(
			xs => {
				assert.deepStrictEqual(xs, ["error-foo", sampleError, "error-bar"]);
			}
		)
	);
	
	it("simply keeps the stream with two identity mapping swaps", pipe(
		() => B.sequentially(10, ["foo", new B.Error(sampleError), "bar"]),
		swap(identity, identity),
		s => s.delay(20),
		swap(identity, identity),
		s => s
		.mapError(identity)
		.scan([], flip(append))
		.toPromise()
		.then(
			xs => {
				assert.deepStrictEqual(xs, ["foo", "bar", sampleError]);
			}
		)
	));
});
