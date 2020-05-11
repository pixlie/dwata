import {
  ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER, TOGGLE_QUERY_EDITOR,
  NEXT_PAGE, PREVIOUS_PAGE, CHANGE_PER_PAGE
} from "./actionTypes";


const initialState = {
  sourceId: null,
  tableName: null,
  cacheKey: null,
  columnsSelected: {},
  filterBy: {},
  orderBy: {},  // Only used to load from localStorage
  currentPage: 0,
  perPage: 100,
  offset: 0,
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

    case CHANGE_PER_PAGE:
      return {
        ...state,
        perPage: action.payload,
      }

    case NEXT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      }

    default:
      return state;
  }
}