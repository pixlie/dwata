import axios from "axios";

import { dataURL } from "services/urls";
import { COMPLETE_FETCH_DATA_TO_CACHE, INITIATE_FETCH_DATA_TO_CACHE } from "./actionTypes";


/**
This function is used in cases where we want to fetch data into our listCache but for a table which is
not the current table being browsed. This can be for accessory data (like for dwata features) or data
that needs to be merged with the current table data
**/
export const fetchDataToCache = (sourceId, tableName, cacheKey, qsOverride = {}, callback) => (dispatch, getState) => {
  const state = getState();

  dispatch({
    type: INITIATE_FETCH_DATA_TO_CACHE,
    cacheKey,
  });
  let querySpecification = {};

  if (state.querySpecification.cacheKey === cacheKey) {
    const {columnsSelected, orderBy, filterBy, limit, offset} = state.querySpecification;
    querySpecification = {
      columns: qsOverride.columnsSelected ? qsOverride.columnsSelected : (columnsSelected.length > 0 ? columnsSelected : undefined),
      order_by: orderBy,
      filter_by: qsOverride.filterBy ? qsOverride.filterBy : filterBy,
      limit,
      offset,
    };
  } else if (Object.keys(state.querySpecification._cachedData).includes(cacheKey)) {
    const {columnsSelected, orderBy, filterBy, limit, offset} = state.querySpecification._cachedData[cacheKey];
    querySpecification = {
      columns: qsOverride.columnsSelected ? qsOverride.columnsSelected : (columnsSelected.length > 0 ? columnsSelected : undefined),
      order_by: orderBy,
      filter_by: qsOverride.filterBy ? qsOverride.filterBy : filterBy,
      limit,
      offset,
    };
  } else {
    querySpecification = {
      columns: qsOverride.columnsSelected ? qsOverride.columnsSelected : undefined,
      filter_by: qsOverride.filterBy ? qsOverride.filterBy : undefined,
    };
  }

  return axios
    .post(`${dataURL}/${sourceId}/${tableName}`, querySpecification)
    .then(res => {
      if (!!callback) {
        return callback(res.data);
      }

      dispatch({
        type: COMPLETE_FETCH_DATA_TO_CACHE,
        payload: res.data,
        cacheKey,
      });
    })
    .catch(err => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};