import {
  TOGGLE_QUERY_EDITOR, TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_SORT_EDITOR,
  TOGGLE_ORDER, NEXT_PAGE, CHANGE_PER_PAGE, PREVIOUS_PAGE,
  TOGGLE_COLUMN_SELECTION
} from "./actionTypes";
import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";


/**
 * This reducer specifies what we *want*, not necessarily what the backend has given us.
 **/
const initialState = {
  sourceId: null,
  tableName: null,
  columnsSelected: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,

  isQEVisible: false,
  isCSVisible: false,
  isSEVisible: false,

  isColumnsSelectedDirty: false,
  isReady: false,
  _cacheKey: null,
  _cachedData: {},
};


export default (state = initialState, action) => {
  const _cacheKey = `${action.sourceId}/${action.tableName}`;

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      if (state._cacheKey === _cacheKey) {
        return {
          ...state
        };
      }
      return {
        ...initialState,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: undefined,
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

    case COMPLETE_FETCH_DATA:
      const temp = {
        count: action.payload.count,
        limit: action.payload.limit,
        offset: action.payload.offset,
        columnsSelected: action.payload.columns,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
      };
      return {
        ...initialState,
        ...temp,
        isReady: true,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: {
            ...temp,
          },
        },
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
          ],
          isColumnsSelectedDirty: true,
        };
      }

    default:
      return {
        ...state
      };
  }
}