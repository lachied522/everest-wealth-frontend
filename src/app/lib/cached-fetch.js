import { cache } from "react";

import { fetchSymbol } from "./redis";

const cachedFetch = cache(fetchSymbol);

export default cachedFetch;