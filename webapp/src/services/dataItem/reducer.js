import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "./actionTypes";


const initialItemState = {
  data: {},
  querySQL: null,

  isFetching: false,
  isReady: false,
};

const initialState = {
};


export default (state = initialState, action) => {
  const _cacheKey = `${action.sourceId}/${action.tableName}/${action.pk}`;

  switch (action.type) {
    case INITIATE_FETCH_ITEM:
      if (_cacheKey in Object.keys(state)) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [_cacheKey]: {
          ...initialItemState,
          isFetching: true,
        }
      };

    case COMPLETE_FETCH_ITEM: {
      return {
        ...state,
        [_cacheKey]: {
          ...state[_cacheKey],
          data: action.errorStatus ? null : action.payload.item,
          querySQL: action.errorStatus ? null : action.payload.query_sql,
          isFetching: false,
          isReady: true,
          errorStatus: action.errorStatus,
        }
      }
    }

    default:
      return {
        ...state,
      };
  }
}