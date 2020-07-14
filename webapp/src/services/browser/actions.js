import axios from "axios";
import _ from "lodash";

import { dataURL } from "services/urls";
import { getSourceFromPath, getCacheKey } from "utils";
import {
  LOAD_QS_FROM_CACHE,
  LAST_QUERY_SPECIFICATION,
} from "services/querySpecification/actionTypes";
import {
  INITIATE_FETCH_DATA,
  COMPLETE_FETCH_DATA,
  LOAD_DATA_FROM_CACHE,
  TOGGLE_ROW_SELECTION,
} from "./actionTypes";
import { SAVE_QS_TO_CACHE } from "services/querySpecificationCache/actionTypes";

/**
 * Fetch a list of data rows from a table-like source using the dwata API. This method checks if we
 * are fetching from a saved query, or if the requested data is already there in cache, etc.
 *
 * @param {Object} savedQuery - The Object containing a query that user had saved earlier
 */
export const fetchData = (savedQuery) => (dispatch, getState) => {
  const state = getState();
  let sourceId = null,
    tableName = null,
    cacheKey = null,
    qS = {};
  if (!!savedQuery) {
    // Todo: Refactor the repeat code in cache key and path parts
    sourceId = savedQuery.source_id;
    tableName = savedQuery.table_name;
    cacheKey = getCacheKey(null, savedQuery);
    ({
      params: { sourceId, tableName },
    } = getSourceFromPath(`/browse/${sourceId}/${tableName}`));
    // Todo: Frontend should not have to parse as JSON, backend should respond with JSON and not String
    qS = JSON.parse(savedQuery.query_specification);
    qS = {
      columnsSelected: qS.columns,
      orderBy: qS.order_by,
      filterBy: qS.filter_by,
      limit: qS.limit,
      offset: qS.offset,
    };
  } else {
    ({
      params: { sourceId, tableName },
    } = getSourceFromPath(state.router.location.pathname));
    cacheKey = getCacheKey(state);
    if (state.querySpecification.cacheKey === cacheKey) {
      qS = state.querySpecification;
    }
  }

  const { columnsSelected, orderBy, filterBy, limit, offset } = qS;

  if (Object.keys(state.listCache).includes(cacheKey)) {
    // We have needed data in cache.
    // Let's check if the last Query Specification is same as what user wants now
    const { lastQuerySpecification } = qS;
    if (
      _.isEqual(
        {
          columnsSelected,
          orderBy,
          filterBy,
          limit,
          offset,
        },
        lastQuerySpecification
      )
    ) {
      // OK so the Query Specification has not changed, let's load the data from cache
      const { columns, rows, querySQL, selectedRowList } = state.listCache[
        cacheKey
      ];
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
        // If the query specification is in cache, then let's load it from there
        const {
          columnsSelected,
          filterBy,
          orderBy,
          count,
          limit,
          offset,
        } = state.querySpecificationCache[cacheKey];
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
  // Since we are fetching new data, perhaps for a new table, we cache current query specification
  if (!!state.querySpecification.cacheKey) {
    dispatch({
      type: SAVE_QS_TO_CACHE,
      payload: {
        ...state.querySpecification,
        isReady: undefined,
        cacheKey: undefined,
        lastQuerySpecification: undefined,
      },
      cacheKey: state.querySpecification.cacheKey,
    });
  }
  const querySpecification = {
    columns:
      !!columnsSelected && columnsSelected.length > 0
        ? columnsSelected
        : undefined,
    order_by: orderBy,
    filter_by: filterBy,
    limit,
    offset,
  };

  return axios
    .post(`${dataURL}/${sourceId}/${tableName}`, querySpecification)
    .then((res) => {
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

      if (cacheKey !== state.querySpecification.cacheKey) {
        // We are loading data for a table-like source that is different than the one currently loaded.
        // Check if we have a cached query specification for this newly loaded data.
        if (Object.keys(state.querySpecificationCache).includes(cacheKey)) {
          // Yes! We have query specification in cache, then let's load it from there.
          const {
            columnsSelected,
            filterBy,
            orderBy,
            count,
            limit,
            offset,
          } = state.querySpecificationCache[cacheKey];
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
      }
    })
    .catch((err) => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};

export const toggleRowSelection = (rowId) => (dispatch) => {
  dispatch({
    type: TOGGLE_ROW_SELECTION,
    rowId,
  });
};
