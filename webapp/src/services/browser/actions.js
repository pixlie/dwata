import axios from "axios";
import _ from "lodash";

import { dataURL } from "services/urls";
import { getSourceFromPath, getCacheKey } from "utils";
import { LOAD_QS_FROM_CACHE, LAST_QUERY_SPECIFICATION } from "services/querySpecification/actionTypes";
import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA, LOAD_DATA_FROM_CACHE, TOGGLE_ROW_SELECTION } from "./actionTypes";


export const fetchData = (callback) => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName}} = getSourceFromPath(state.router.location.pathname);
  const cacheKey = getCacheKey(state);
  const {columnsSelected, orderBy, filterBy, limit, offset, lastQuerySpecification} = state.querySpecification;

  if (Object.keys(state.listCache).includes(cacheKey)) {
    // We have needed data in cache.
    // Let's check if the last Query Specification is same as what user wants now
    if (_.isEqual({
      columnsSelected, orderBy, filterBy, limit, offset
    }, lastQuerySpecification)) {
      // OK so the Query Specification has not changed, let's load the data from cache
      const {columns, rows, querySQL, selectedRowList} = state.listCache[cacheKey];
      dispatch({
        type: LOAD_DATA_FROM_CACHE,
        cacheKey,
        payload: {
          columns,
          rows,
          querySQL,
          selectedRowList,
        },
      });
      if (Object.keys(state.querySpecificationCache).includes(cacheKey)) {
        const {columnsSelected, filterBy, orderBy, count, limit, offset} = state.querySpecificationCache[cacheKey];
        dispatch({
          type: LOAD_QS_FROM_CACHE,
          cacheKey,
          payload: {
            columnsSelected,
            filterBy,
            orderBy,
            count,
            limit,
            offset,
          },
        });
      }
      return;  
    }
  }

  dispatch({
    type: INITIATE_FETCH_DATA,
    cacheKey,
  });
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
        return callback(res.data);
      }

      dispatch({
        type: COMPLETE_FETCH_DATA,
        payload: res.data,
        cacheKey,
      });
      dispatch({
        type: LAST_QUERY_SPECIFICATION,
        payload: querySpecification,
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