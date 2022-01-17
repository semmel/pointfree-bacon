import * as Bacon from "baconjs";
import {curry} from "ramda";

const
	/**
	 * Makes takeWhile work also for EventStream<boolean> valves.
	 * Please note, that
	 * - if the valve stream has not yet produced a value it is considered false for takeWhile
	 * - Differences to a Property<boolean>
	 *    - when the valve stream ends it again is considered as `false`, thus ending the stream
	 *    on the next src event
	 * @template T
	 * @param predicateOrObservable
	 * @param {Observable<T>} src
	 * @return {Observable<T>}
	 */
	takeWhile = (predicateOrObservable, src) => {
		if (predicateOrObservable instanceof Bacon.EventStream) {
			return src.takeWhile(predicateOrObservable.toProperty().mapEnd(() => false));
		}
		
		return src.takeWhile(predicateOrObservable);
	};

export default curry(takeWhile);
