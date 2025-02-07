import { URLSearchParamsInit, SetURLSearchParams } from "react-router-dom";

export const updateSearchParams = (
  setSearchParams: SetURLSearchParams,
  params: URLSearchParamsInit
) => {
  setSearchParams(params);
};