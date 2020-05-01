import { INITIATE_FETCH_SCHEMA, FETCH_SCHEMA, LOAD_SCHEMA_FROM_CACHE } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  sourceId: null,
  _cacheKey: null,
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
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
        }
      };

    case FETCH_SCHEMA:
      const temp = {
        ...initialState,
        columns: action.payload.columns,
        rows: action.payload.rows.map(row => transformData(action.payload.columns, row)),
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
        }
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
}