import {complement, curry, pair} from "semmel-ramda";
import * as Bacon from "baconjs";
import filter from "./filter.js";

// reject :: Property Boolean -> Observable a -> Observable a
// reject :: (a -> Boolean) -> Observable a -> Observable a
const
	reject = curry((predicateOrObservable, observable) => {
		if (predicateOrObservable instanceof Bacon.EventStream) {
			return observable
			.withLatestFrom(
				Bacon.once(false).concat(predicateOrObservable),
				pair
			)
			.transform((baconEvent, sink) => {
				// boilerplate for Observable.transform :disgust-emoji:
				if (!Bacon.hasValue(baconEvent)) {// error or end
					return sink(baconEvent);
				}
				const
					[streamValue, isValveClosed] = baconEvent.value;
				
				if (!isValveClosed) {
					return sink(new Bacon.Next(streamValue));
				}
				
				return Bacon.more;
			});
		}
		else if (predicateOrObservable instanceof Bacon.Property) {
			return filter(predicateOrObservable.not(), observable);
		}
		else if (typeof predicateOrObservable === "function") {
			return filter(complement(predicateOrObservable), observable);
		}
		throw new Error("first argument must be a function or observable.");
	});

export default reject;
