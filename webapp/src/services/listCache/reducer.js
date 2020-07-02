import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";
import { INITIATE_FETCH_DATA_TO_CACHE, COMPLETE_FETCH_DATA_TO_CACHE } from "./actionTypes";


const initialState = {
  columns: [],
  rows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
  isReady: false,
  lastError: null,
  lastFetchedAt: null,
};


export default (state = {}, action) => {
  const {cacheKey} = action;  // This is a hash made of how the query is being made to API including pagination
  if (!cacheKey) {
    return {
      ...state
    };
  }

  switch (action.type) {
    case INITIATE_FETCH_DATA_TO_CACHE:
    case INITIATE_FETCH_DATA:
      return {
        ...state,
        [cacheKey]: {
          ...initialState,
        },
      };

    case COMPLETE_FETCH_DATA_TO_CACHE:
    case COMPLETE_FETCH_DATA:
      return {
        ...state,
        [cacheKey]: {
          ...initialState,
          columns: action.payload.columns,
          rows: action.payload.rows,  // Here we do not transform data into maps/dicts
          querySQL: action.payload.query_sql,
          isFetching: false,
          isReady: true,
        }
      }

    default:
      return {
        ...state,
      };
  }
}