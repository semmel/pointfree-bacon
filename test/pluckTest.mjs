import { equals, identity, o, pair } from 'ramda';
import chai from 'chai';
import { of, pluck } from "../index.js";
import * as Bacon from 'baconjs';

const
	assert = chai.assert;

describe("pluck", function () {
	it("maps to the value if the property is present", () =>{
		const
			oa = of({foo: "FOO", isFoo: true}),
			oFoo = pluck("foo", oa),
			oIsFoo = pluck("isFoo", oa);
		
		return Bacon.combineAsArray([oFoo, oIsFoo])
		.toPromise()
		.then(xs => {
			assert.deepStrictEqual(xs, ["FOO", true]);
		});
	});
	
	it("works for Observable Arrays", () =>
		pluck(1, of([10, 11, 12]))
		.firstToPromise()
		.then(x => {
			assert.equal(x, 11)
		})
	);
	
	it("maps to undefined if the property is not present", () => {
		const
			oa = of({foo: "FOO", isFoo: true}),
			oFoo = pluck("bar", oa);
		
		return oFoo
		.firstToPromise()
		.then(x => {
			assert.isUndefined(x);
		});
	});
});
