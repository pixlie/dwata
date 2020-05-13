import {
  INITIATE_QUERY_SPECIFICATION, UPDATE_QUERY_SPECIFICATION,
  TOGGLE_QUERY_EDITOR, TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_SORT_EDITOR,
  TOGGLE_ORDER, NEXT_PAGE, CHANGE_PER_PAGE, PREVIOUS_PAGE,
  TOGGLE_COLUMN_SELECTION
} from "./actionTypes";


/**
 * This reducer specifies what we *want* to fetch, not necessarily what the backend has given us.
 **/
const initialState = {
  sourceId: null,
  tableName: null,
  cacheKey: null,
  columnsSelected: [],
  filterBy: {},
  orderBy: {},
  limit: 20,
  offset: 0,
  isQEVisible: false,
  isCSVisible: false,
  isSEVisible: false,
  _cachedData: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_QUERY_SPECIFICATION:
      if (state.sourceId === action.sourceId && state.tableName === action.tableName) {
        return {
          ...state
        };
      }
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
        isQEVisible: !state.isQEVisible,
      };

    case TOGGLE_COLUMN_SELECTOR_UI:
      return {
        ...state,
        isCSVisible: !state.isCSVisible,
      };

    case TOGGLE_SORT_EDITOR:
      return {
        ...state,
        isSEVisible: !state.isSEVisible,
      };

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
        columnsSelected: action.payload.columns,
      };

    case TOGGLE_ORDER:
      const currentOrder = state.orderBy[action.columnName];
      let newOrder = undefined;
      if (currentOrder === undefined) {
        newOrder = "asc";
      } else if (currentOrder === "asc") {
        newOrder = "desc";
      }

      return {
        ...state,
        orderBy: {
          ...state.orderBy,
          [action.columnName]: newOrder,
        }
      };

    case TOGGLE_COLUMN_SELECTION:
      if (state.columnsSelected.includes(action.columnName)) {
        // This column is currently selected, let's get it removed
        return {
          ...state,
          columnsSelected: [...state.columnsSelected].filter(x => x !== action.columnName),
        };
      } else {
        // This column is not selected, let's add it
        return {
          ...state,
          columnsSelected: [
            ...state.columnsSelected,
            action.columnName,
          ]
        };
      }

      default:
        return {
          ...state
        };
  }
}