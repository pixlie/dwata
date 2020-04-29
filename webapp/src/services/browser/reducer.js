import { INITIATE_FETCH_DATA, FETCH_DATA } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  columns: [],
  rows: [],
  query_sql: null,
  isFetching: false,
  isReady: false,
  cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_FETCH_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_DATA:
      return {
        columns: action.payload.columns,
        rows: action.payload.rows,  // Here we do not transform data into maps/dicts
        query_sql: action.payload.query_sql,
        isFetching: false,
        isReady: true,
      };

    default:
      return state;
  }
}