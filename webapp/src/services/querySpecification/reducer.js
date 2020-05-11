import {
  INITIATE_QUERY_SPECIFICATION, TOGGLE_QUERY_EDITOR, UPDATE_QUERY_SPECIFICATION,
  NEXT_PAGE, CHANGE_PER_PAGE, PREVIOUS_PAGE
} from "./actionTypes";


/**
 * This reducer specifies what we *want* to fetch, not necessarily what the backend has given us.
 **/
const initialState = {
  sourceId: null,
  tableName: null,
  cacheKey: null,
  columnsSelected: {},
  filterBy: {},
  orderBy: {},  // Only used to load from localStorage
  limit: 20,
  offset: 0,
  isVisible: false,
  _cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_QUERY_SPECIFICATION:
      return {
        ...initialState,
        sourceId: action.sourceId,
        tableName: action.tableName,
        _cachedData: {
          ...state._cachedData,
        }
      };

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
        offset: state.offset + state.limit,
      };

    case PREVIOUS_PAGE:
      return {
        ...state,
        offset: state.offset - state.limit,
      };

    case UPDATE_QUERY_SPECIFICATION:
      return {
        ...state,
        limit: action.payload.limit,
        offset: action.payload.offset,
      }

    default:
      return state;
  }
}