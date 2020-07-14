import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";
import { SAVE_QS_TO_CACHE } from "./actionTypes";


const initialState = {
  columnsSelected: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,

  isReady: false,
};


export default (state = {}, action) => {
  const {cacheKey} = action;
  if (!cacheKey) {
    return {
      ...state,
    };
  }

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      if (cacheKey === state.cacheKey) {
        // No need to initiate multiple times
        return {
          ...state,
        };
      }
      return {
        ...state,
        [cacheKey]: {
          ...initialState,
        }
      };

    case COMPLETE_FETCH_DATA:
      return {
        ...state,
        [cacheKey]: {
          ...initialState,
          columnsSelected: action.payload.columns,
          count: action.payload.count,
          limit: action.payload.limit,
          offset: action.payload.offset,
          isReady: true,
        },
      };

    case SAVE_QS_TO_CACHE:
      return {
        ...state,
        [cacheKey]: {
          ...initialState,
          ...action.payload,
          isReady: true,
        },
      }

    default:
      return {
        ...state
      };
  }
}