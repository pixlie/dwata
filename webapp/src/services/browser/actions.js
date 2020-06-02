import axios from "axios";

import { dataURL } from "services/urls";
import { getSourceFromPath, getCacheKey } from "utils";
import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA, LOAD_DATA_FROM_CACHE, TOGGLE_ROW_SELECTION } from "./actionTypes";


export const fetchData = (filterByOverride, callback) => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName}} = getSourceFromPath(state.router.location.pathname);
  const cacheKey = getCacheKey(state);

  if (Object.keys(state.listCache).includes(cacheKey)) {
    // We have needed data in cache. Swap that into the state
    const {columns, rows, querySQL} = state.listCache[cacheKey];
    return dispatch({
      type: LOAD_DATA_FROM_CACHE,
      payload: {
        columns,
        rows,
        querySQL,
      },
    });
  }

  dispatch({
    type: INITIATE_FETCH_DATA,
    cacheKey,
  });
  const {columnsSelected, orderBy, filterBy, limit, offset} = state.querySpecification;
  const querySpecification = {
    columns: columnsSelected.length > 0 ? columnsSelected : undefined,
    order_by: orderBy,
    filter_by: filterByOverride ? filterByOverride : filterBy,
    limit,
    offset,
  };

  return axios
    .post(`${dataURL}/${sourceId}/${tableName}`, querySpecification)
    .then(res => {
      if (!!callback) {
        return callback(res.data);
      }

      dispatch({
        type: COMPLETE_FETCH_DATA,
        payload: res.data,
        cacheKey,
      });
    })
    .catch(err => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};


export const toggleRowSelection = rowId => dispatch => {
  dispatch({
    type: TOGGLE_ROW_SELECTION,
    rowId,
  });
};