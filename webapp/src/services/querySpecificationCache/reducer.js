import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA } from "services/browser/actionTypes";


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
        ...initialState,
        cacheKey: cacheKey,
        _cachedData: {
          ...state._cachedData,
          [cacheKey]: undefined,
        }
      };

    case COMPLETE_FETCH_DATA:
      return {
        ...state,
      };

    default:
      return {
        ...state
      };
  }
}