import { ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER, TOGGLE_QUERY_EDITOR } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  sourceId: null,
  tableName: null,
  cacheKey: null,
  columnsSelected: {},
  filterBy: {},
  orderBy: {},  // Only used to load from localStorage
  limit: 100,
  isVisible: false,
  _cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_QUERY_EDITOR:
      return {
        ...state,
        isVisible: !state.isVisible,
      }

      default:
      return state;
  }
}