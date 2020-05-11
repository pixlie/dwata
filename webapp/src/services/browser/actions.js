import axios from "axios";

import { dataURL } from "services/urls";
import { matchBrowserPath } from "utils";
import { INITIATE_FETCH_DATA, FETCH_DATA, LOAD_DATA_FROM_CACHE } from "./actionTypes";


export const fetchData = callback => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName}} = matchBrowserPath(state.router.location.pathname);
  const _cacheKey = `${sourceId}/${tableName}`;
  if (state.browser._cachedData && state.browser._cachedData[_cacheKey]) {
    // We have needed data in cache. Swap that into the state
    return dispatch({
      type: LOAD_DATA_FROM_CACHE,
      sourceId,
      tableName,
    });
  }

  dispatch({
    type: INITIATE_FETCH_DATA,
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
  const orderBy = state.queryEditor.orderBy;
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
    .post(`${dataURL}/${sourceId}/${tableName}`, querySpecification)
    .then(res => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_DATA,
        payload: res.data,
        sourceId,
        tableName,
      });
    })
    .catch(err => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};