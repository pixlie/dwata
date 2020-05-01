import { ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  sourceId: null,
  tableName: null,
  cacheKey: null,
  columnsSelected: {},
  filterBy: {},
  orderBy: {},  // Only used to load from localStorage
  limit: 100,
  _cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}