import { curry } from "ramda";

/**
 * pointfree-bacon: map.js
 *
 * Created by Matthias Seemann on 19.04.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */
export default curry((fn, observable) => observable.map(fn));
