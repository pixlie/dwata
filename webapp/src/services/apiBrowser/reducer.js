import { INITIATE_FETCH_API_DATA, FETCH_API_DATA, LOAD_API_DATA_FROM_CACHE } from "./actionTypes";


const initialState = {
  sourceId: null,
  tableName: null,
  rows: [],
  columns: [],
  querySQL: null,
  isFetching: false,
  isReady: false,
  _cacheKey: null,
  _cachedData: {},
};


export default (state = initialState, action) => {
  const _cacheKey = `${action.sourceId}/${action.tableName}`;

  switch (action.type) {
    case INITIATE_FETCH_API_DATA:
      return {
        ...initialState,
        isFetching: true,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: undefined,
        }
      };

    case FETCH_API_DATA: {
      const temp = {
        rows: action.payload.rows,  // Here we do not transform data into maps/dicts
        columns: action.payload.columns,
        // querySQL: action.payload.query_sql,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
        isFetching: false,
        isReady: true,
      };
      return {
        ...initialState,
        ...temp,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: temp,
        }
      }
    }

    case LOAD_API_DATA_FROM_CACHE: {
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