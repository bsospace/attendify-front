/**
 * url.util.ts
 * This file contains utility functions for handling URL.
 * Created: 21/09/2024
 */

import { URLSearchParamsInit, SetURLSearchParams } from "react-router-dom";

export const updateSearchParams = (
  setSearchParams: SetURLSearchParams,
  params: URLSearchParamsInit
) => {
  setSearchParams(params);
};