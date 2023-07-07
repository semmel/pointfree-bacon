import {curry} from "ramda";
import { Bus, once } from "baconjs";

const
	/**
	 * @template {T}
	 * @param {import('baconjs').Observable<T>} observableOrBus
	 * @param {T} seed
	 * @private {import('baconjs').Observable<T>}
	 */
	startWith_ = (seed, observableOrBus) =>
		observableOrBus instanceof Bus
			// for Bus concat(once(i)) swallows the first immediate push or 'i' comes too late
			? once(seed).merge(observableOrBus.delay(0))
			: observableOrBus.startWith(seed),

	startWith = curry(startWith_);

export default startWith;
