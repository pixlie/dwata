import axios from "axios";

import { dataURL } from "services/urls";
import { matchBrowserPath } from "utils";
import { INITIATE_FETCH_DATA, FETCH_DATA, LOAD_DATA_FROM_CACHE } from "./actionTypes";
import { INITIATE_QUERY_SPECIFICATION, UPDATE_QUERY_SPECIFICATION } from "services/querySpecification/actionTypes";


export const fetchData = callback => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName}} = matchBrowserPath(state.router.location.pathname);
  const _cacheKey = `${sourceId}/${tableName}`;

  if (state.browser.sourceId !== parseInt(sourceId) && state.browser.tableName !== tableName) {
    // The browser reducer is currently not holding data for the page we are at.
    // Check if cache has our needed data.
    if (state.browser._cachedData && state.browser._cachedData[_cacheKey]) {
      // We have needed data in cache. Swap that into the state
      return dispatch({
        type: LOAD_DATA_FROM_CACHE,
        sourceId,
        tableName,
      });
    }
  }

  dispatch({
    type: INITIATE_FETCH_DATA,
    sourceId,
    tableName,
  });
  dispatch({
    type: INITIATE_QUERY_SPECIFICATION,
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
  const { orderBy, limit, offset } = state.querySpecification;
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
    limit,
    offset,
  };

  return axios
    .post(`${dataURL}/${sourceId}/${tableName}`, querySpecification)
    .then(res => {
      if (!!callback) {
        callback();
      }

      dispatch({
        type: FETCH_DATA,
        payload: res.data,
        sourceId,
        tableName,
      });
      dispatch({
        type: UPDATE_QUERY_SPECIFICATION,
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