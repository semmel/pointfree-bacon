/**
 * pointfree-bacon: pluck.js
 *
 * Created by Matthias Seemann on 19.04.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import { curry, prop } from 'ramda';
import map from './map.js';

export default curry((key, mo) => map(prop(key), mo));
