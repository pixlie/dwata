import axios from "axios";

import { INITIATE_FETCH_API_DATA, FETCH_API_DATA, LOAD_API_DATA_FROM_CACHE } from "./actionTypes";
import { apiDataURL } from "services/urls";


export const fetchAPIData = (sourceId, tableName, callback) => (dispatch, getState) => {
  const state = getState();
  const _cacheKey = `${sourceId}/${tableName}`;
  if (state.browser._cachedData && state.browser._cachedData[_cacheKey]) {
    // We have needed data in cache. Swap that into the state
    return dispatch({
      type: LOAD_API_DATA_FROM_CACHE,
      sourceId,
      tableName,
    });
  }

  dispatch({
    type: INITIATE_FETCH_API_DATA,
    sourceId,
    tableName,
  });
  // This tells the API which DB/table and what filters/ordering to apply
  const schema = state.schema.isReady && state.schema.sourceId === parseInt(sourceId) ? {
    ...state.schema.rows.find(x => x.table_name === tableName),
    isReady: true,
  } : {
    isReady: false,
  }
  const orderBy = state.querySpecification.orderBy;
  const columnsSelected = schema.isReady ? schema.columns.reduce((acc, ele) => ({
    ...acc,
    [ele.name]: true
  }), {}) : {};
  const querySpecification = {
    columns: Object.keys(columnsSelected).
      map(col => columnsSelected[col] === true ? col : undefined).
      filter(col => col !== undefined),
    orderBy,
    // filterBy,
    // limit,
  };

  return axios
    .post(`${apiDataURL}/${sourceId}/${tableName}`, querySpecification)
    .then(res => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_API_DATA,
        payload: res.data,
        sourceId,
        tableName,
      });
    })
    .catch(err => {
      console.log('Could not fetch sources. Try again later.');
    });
};