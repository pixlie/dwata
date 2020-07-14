import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";
import {
  TOGGLE_ORDER, NEXT_PAGE, CHANGE_LIMIT, PREVIOUS_PAGE, GOTO_PAGE, TOGGLE_COLUMN_SELECTION,
  INITIATE_QUERY_FILTER, SET_QUERY_FILTER, REMOVE_QUERY_FILTER, LOAD_QS_FROM_CACHE,
  LAST_QUERY_SPECIFICATION
} from "./actionTypes";


/**
 * This reducer specifies what we *want*, not necessarily what the backend has given us.
 **/
const initialState = {
  columnsSelected: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,

  isReady: false,
  cacheKey: null,

  // This is needed to check if user altered the spec so as to demand new data fetch
  lastQuerySpecification: {},
};


export default (state = initialState, action) => {
  const {cacheKey} = action;

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      if (!cacheKey) {
        return {
          ...state,
        };
      }
    
      if (cacheKey === state.cacheKey) {
        // No need to initiate multiple times
        return {
          ...state,
        };
      }
      return {
        ...initialState,
        cacheKey,
      };

    case CHANGE_LIMIT:
      return {
        ...state,
        limit: action.limit,
      };

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

    case GOTO_PAGE:
      return {
        ...state,
        offset: (action.pageNum - 1) * state.limit,  // Since pageNum comes from UI, it counts from 1, but API counts from 0
      };

    case COMPLETE_FETCH_DATA:
      if (!cacheKey) {
        return {
          ...state,
        };
      }
    
      if (cacheKey !== state.cacheKey) {
        // We have a problem, some data race perhaps
        // Todo: tackle this issue if it happens
        console.log("This is a huge problem, please check");
        return {
          ...state,
        };
      }
      return {
        ...state,
        count: action.payload.count,
        limit: action.payload.limit,
        offset: action.payload.offset,
        columnsSelected: action.payload.columns,
        isReady: true,
      };

    case LOAD_QS_FROM_CACHE:
      if (!cacheKey) {
        return {
          ...state,
        };
      }
    
      return {
        ...initialState,
        ...action.payload,
        isReady: true,
        cacheKey,
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
        };
      }

    case INITIATE_QUERY_FILTER:
      if (Object.keys(state.filterBy).includes(action.columnName)) {
        return {
          ...state,
        };
      }

      let initialFilter = {};
      if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(action.dataType.type)) {
        initialFilter = {
          display: ""
        };
      } else if (action.dataType.type === "BOOLEAN") {
        initialFilter = {
          value: null,
        };
      }
      return {
        ...state,
        filterBy: {
          ...state.filterBy,
          [action.columnName]: {
            ...initialFilter,
          },
        }
      };

    case SET_QUERY_FILTER:
      return {
        ...state,
        filterBy: {
          ...state.filterBy,
          [action.columnName]: action.filters,
        }
      };

    case REMOVE_QUERY_FILTER:
      // We create a reducer that will add any key (and its corresponding value from current filters)
      //  if the key is not the one that we want to remove
      const reducer = (acc, key) => {
        if (key !== action.columnName) {
          return {
            ...acc,
            [key]: state.filterBy[key],
          };
        }
        return {
          ...acc,
        };
      };
      return {
        ...state,
        filterBy: Object.keys(state.filterBy).reduce(reducer, {}),
      };

    case LAST_QUERY_SPECIFICATION:
      return {
        ...state,
        lastQuerySpecification: {
          ...action.payload,
        },
      };

    default:
      return {
        ...state,
      };
  }
}