import {curry, pair} from "semmel-ramda";
import * as Bacon from "baconjs";

// :: ((a -> Boolean) | Observable Boolean) -> Observable a -> Observable a
const
	filter = curry((predicateOrObservable, observable) => {
		if (predicateOrObservable instanceof Bacon.EventStream) {
			return observable
			.withLatestFrom(
				predicateOrObservable,
				pair
			)
			.transform((baconEvent, sink) => {
				// boilerplate for Observable.transform :disgust-emoji:
				if (!Bacon.hasValue(baconEvent)) {// error or end
					return sink(baconEvent);
				}
				const
					[streamValue, isValveOpen] = baconEvent.value;
				
				if (isValveOpen) {
					return sink(new Bacon.Next(streamValue));
				}
				
				return Bacon.more;
			});
		}
		return observable.filter(predicateOrObservable);
	});

export default filter;
