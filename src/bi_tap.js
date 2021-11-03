import {curry} from "semmel-ramda";
import * as Bacon from "baconjs";

/**
 * pointfree-bacon: bi_tap.js
 *
 * Created by Matthias Seemann on 3.11.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */
const
	// Mimics @visisoft/staticland/promise/bi_tap
	// bi_tap :: (* -> ()) -> (a -> ()) -> Observable a -> Observable a
	bi_tap = curry((onFailure, onSuccess, observable) =>
		observable.transform((event, sink) => {
			if (Bacon.hasValue(event)) {
				try {
					onSuccess(event.value);
				}
				catch (error) {
					sink(event);
					return sink(new Bacon.Error(error));
				}
			}
			else if (Bacon.isError(event)) {
				try {
					onFailure(event.error);
				}
				catch (error) {
					sink(event);
					return sink(new Bacon.Error(error));
				}
			}
			
			return sink(event);
	}));

export default bi_tap;
