import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";
import {
  TOGGLE_ORDER, NEXT_PAGE, CHANGE_LIMIT, PREVIOUS_PAGE, GOTO_PAGE, TOGGLE_COLUMN_SELECTION,
  INITIATE_QUERY_FILTER, SET_QUERY_FILTER, REMOVE_QUERY_FILTER, LOAD_QS_FROM_CACHE
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
  _cachedData: {},
};


const keysToCache = ["columnsSelected", "filterBy", "orderBy", "count", "limit", "offset", "cacheKey"];
const extractObjectToCache = state => Object.keys(state).reduce((acc, key) => {
  if (keysToCache.includes(key)) {
    acc[key] = state[key];
  }
  return acc;
}, {});


export default (state = initialState, action) => {
  const {cacheKey} = action;
  const setDeltaAndCache = delta => ({
    ...state,
    ...delta,
    _cachedData: {
      ...state._cachedData,
      [state.cacheKey]: extractObjectToCache({
        ...state,
        ...delta,
      }),
    },
  });

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      if (cacheKey === state.cacheKey) {
        // No need to initiate multiple times
        return {
          ...state,
        };
      }
      return {
        ...initialState,
        cacheKey: cacheKey,
        _cachedData: {
          ...state._cachedData,
          [cacheKey]: undefined,
        }
      };

    case CHANGE_LIMIT:
      return setDeltaAndCache({
        limit: action.limit,
      });

    case NEXT_PAGE:
      return setDeltaAndCache({
        offset: state.offset + state.limit,
      });

    case PREVIOUS_PAGE:
      return setDeltaAndCache({
        offset: state.offset - state.limit,
      });

    case GOTO_PAGE:
      return setDeltaAndCache({
        offset: (action.pageNum - 1) * state.limit,  // Since pageNum comes from UI, it counts from 1, but API counts from 0
      });

    case COMPLETE_FETCH_DATA:
      if (cacheKey !== state.cacheKey) {
        // We have a problem, some data race perhaps
        // Todo: tackle this issue if it happens
        console.log("This is a huge problem, please check");
        return {
          ...state,
        };
      }
      return setDeltaAndCache({
        count: action.payload.count,
        limit: action.payload.limit,
        offset: action.payload.offset,
        columnsSelected: action.payload.columns,
        isReady: true,
      });

    case LOAD_QS_FROM_CACHE:
      if (cacheKey === state.cacheKey) {
        // We already have the correct query specifications loaded, nothing to do
        return {
          ...state,
        }
      }
      if (Object.keys(state._cachedData).includes(cacheKey)) {
        // Data found in cache, let us set that cached data to the main state of this reducer
        return {
          ...initialState,
          ...state._cachedData[cacheKey],
          isReady: true,
          _cachedData: {
            ...state._cachedData
          },
        };
      }
      // Requested cacheKey is not in cacheData, we simply initiate fresh data in the state of this reducer
      return {
        ...initialState,
        cacheKey: cacheKey,
        _cachedData: {
          ...state._cachedData,
          [cacheKey]: undefined,
        }
      };

    case TOGGLE_ORDER:
      const currentOrder = state.orderBy[action.columnName];
      let newOrder = undefined;
      if (currentOrder === undefined) {
        newOrder = "asc";
      } else if (currentOrder === "asc") {
        newOrder = "desc";
      }

      return setDeltaAndCache({
        orderBy: {
          ...state.orderBy,
          [action.columnName]: newOrder,
        }
      });

    case TOGGLE_COLUMN_SELECTION:
      if (state.columnsSelected.includes(action.columnName)) {
        // This column is currently selected, let's get it removed
        return setDeltaAndCache({
          columnsSelected: [...state.columnsSelected].filter(x => x !== action.columnName),
        });
      } else {
        // This column is not selected, let's add it
        return setDeltaAndCache({
          columnsSelected: [
            ...state.columnsSelected,
            action.columnName,
          ],
        });
      }

    case INITIATE_QUERY_FILTER:
      if (action.columnName in state.filterBy) {
        return {
          ...state
        };
      }

      let initialFilter = {};
      if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(action.dataType.type)) {
        initialFilter = {
          display: ""
        };
      } else if (action.dataType.type === "BOOLEAN") {
        initialFilter = {
          display: "true",
          value: true,
        };
      }
      return setDeltaAndCache({
        filterBy: {
          ...state.filterBy,
          [action.columnName]: {
            ...initialFilter,
          },
        }
      });

    case SET_QUERY_FILTER:
      return setDeltaAndCache({
        filterBy: {
          ...state.filterBy,
          [action.columnName]: action.filters,
        }
      });

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
      return setDeltaAndCache({
        filterBy: Object.keys(state.filterBy).reduce(reducer, {}),
      });

    default:
      return {
        ...state
      };
  }
}