import {append, flip, equals, identity, o, reverse} from 'ramda';
import chai from 'chai';
import bi_tap from "../src/bi_tap.js";
import * as B from 'baconjs';

const
	assert = chai.assert;

describe("bi_tap", function () {
	let successResult, failureResult;
	
	beforeEach(function() {
		successResult = failureResult = "";
	});
	
	const
		appendFailure = s => { failureResult += `-${s}`; },
		appendSuccess = s => { successResult += `-${s}`; };
	
	it("executes the success side effect for each value event", () =>
		bi_tap(
			appendFailure,
			appendSuccess,
			B.sequentially(10, ["foo", new B.Error("qux"), "bar"])
		)
		.mapError(s => `error-${s}`)
		.scan([], flip(append))
		.toPromise()
		.then(
			xs => {
				assert.deepStrictEqual(xs, ["foo", "error-qux", "bar"]);
				assert.strictEqual(successResult, "-foo-bar");
				assert.strictEqual(failureResult, "-qux");
			}
		)
	);
	
	it ("propagates exceptions in the side-effect to the returned stream", () =>
		bi_tap(
			appendFailure,
			
			s => {
				if (s.endsWith("z")) {
					throw reverse(s);
				}
				appendSuccess(s);
			},
			
			B.sequentially(10, ["foo", "baz", "bar"])
		)
		.mapError(s => `error-${s}`)
		.scan([], flip(append))
		.toPromise()
		.then(
			xs => {
				assert.deepStrictEqual(xs, ["foo", "baz", "error-zab", "bar"]);
				assert.strictEqual(successResult, "-foo-bar");
				assert.strictEqual(failureResult, "");
			}
		)
	);
});
