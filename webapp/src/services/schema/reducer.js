import { INITIATE_FETCH_SCHEMA, FETCH_SCHEMA } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_FETCH_SCHEMA:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_SCHEMA:
      return {
        columns: action.payload.columns,
        rows: action.payload.rows.map(row => transformData(action.payload.columns, row)),
        isFetching: false,
        isReady: true,
      };
    default:
      return state;
  }
}