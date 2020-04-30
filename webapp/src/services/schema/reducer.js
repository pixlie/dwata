import { INITIATE_FETCH_SCHEMA, FETCH_SCHEMA } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  sourceId: null,
  id: null,
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
  _cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_FETCH_SCHEMA:
      return {
        ...state,
        isFetching: true,
        sourceId: parseInt(action.sourceId),
        id: parseInt(action.sourceId),
      };

    case FETCH_SCHEMA:
      const temp = {
        columns: action.payload.columns,
        rows: action.payload.rows.map(row => transformData(action.payload.columns, row)),
        sourceId: parseInt(action.sourceId),
        id: parseInt(action.sourceId),
        isFetching: false,
        isReady: true,
      };
      return {
        ...state,
        ...temp,
        _cachedData: {
          ...state.cachedData,
          [action.sourceId]: temp,
        }
      };
    default:
      return state;
  }
}