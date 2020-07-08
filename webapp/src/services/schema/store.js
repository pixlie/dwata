import create from "zustand";
import axios from "axios";

import { transformData } from "utils";
import { sourceURL } from "services/urls";

const initialState = {
  sourceId: null,
  columns: [],
  rows: [],

  isFetching: false,
  isReady: false,
  _cacheKey: null,
  _cachedData: {},
};

export default (state = initialState, action) => {
  const _cacheKey = parseInt(action.sourceId);

  switch (action.type) {
    case INITIATE_FETCH_SCHEMA:
      return {
        ...initialState,
        sourceId: parseInt(action.sourceId),
        _cacheKey,
        isFetching: true,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: undefined,
        },
      };

    case FETCH_SCHEMA:
      const temp = {
        ...initialState,
        columns: action.payload.columns,
        rows: action.payload.rows.map((row) =>
          transformData(action.payload.columns, row)
        ),
        sourceId: parseInt(action.sourceId),
        _cacheKey,
        isFetching: false,
        isReady: true,
      };
      return {
        ...temp,
        _cachedData: {
          ...state.cachedData,
          [_cacheKey]: temp,
        },
      };

    case LOAD_SCHEMA_FROM_CACHE: {
      const temp = state._cachedData[_cacheKey];
      return {
        ...temp,
        _cachedData: state._cachedData,
      };
    }

    default:
      return state;
  }
};

const [useStore] = create((set) => ({
  fetchSchema: async (sourceId) => {
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
      .get(`${schemanURL}/${sourceId}`)
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
  },
}));

export default useStore;
