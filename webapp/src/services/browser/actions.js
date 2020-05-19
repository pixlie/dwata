import axios from "axios";

import { dataURL } from "services/urls";
import { getSourceFromPath, getItemPartsFromPath } from "utils";
import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA, LOAD_DATA_FROM_CACHE } from "./actionTypes";


export const fetchData = callback => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName}} = getSourceFromPath(state.router.location.pathname);
  const _cacheKey = `${sourceId}/${tableName}`;

  if (state.browser._cacheKey !== _cacheKey) {
    // The browser reducer is currently not holding data for the page we are at.
    // Check if cache has our needed data.
    if (state.browser._cachedData && _cacheKey in state.browser._cachedData) {
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
  const {columnsSelected, orderBy, filterBy, limit, offset} = getState().querySpecification;
  const querySpecification = {
    columns: columnsSelected.length > 0 ? columnsSelected : undefined,
    order_by: orderBy,
    filter_by: filterBy,
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
        type: COMPLETE_FETCH_DATA,
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


export const fetchItem = callback => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName, pk}} = getItemPartsFromPath(state.router.location.pathname);

  dispatch({
    type: INITIATE_FETCH_DATA,
    sourceId,
    tableName,
  });
  const {columnsSelected, orderBy, filterBy, limit, offset} = getState().querySpecification;
  const querySpecification = {
    columns: columnsSelected.length > 0 ? columnsSelected : undefined,
    order_by: orderBy,
    filter_by: filterBy,
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
        type: COMPLETE_FETCH_DATA,
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