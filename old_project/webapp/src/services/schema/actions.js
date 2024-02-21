import axios from "axios";

import { schemaURL } from "../urls";
import {
  INITIATE_FETCH_SCHEMA,
  FETCH_SCHEMA,
  LOAD_SCHEMA_FROM_CACHE,
} from "./actionTypes";

export const fetchSchema = (sourceId, callback) => (dispatch, getState) => {
  const container = getState().schema;
  const _cacheKey = sourceId;
  if (container._cachedData && container._cachedData[_cacheKey]) {
    // We have needed data in cache. Swap that into the state
    return dispatch({
      type: LOAD_SCHEMA_FROM_CACHE,
      sourceId,
    });
  }

  dispatch({
    type: INITIATE_FETCH_SCHEMA,
    sourceId,
  });

  return axios
    .get(`${schemaURL}/${sourceId}`)
    .then((res) => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_SCHEMA,
        sourceId,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Could not fetch schema. Try again later.");
    });
};
