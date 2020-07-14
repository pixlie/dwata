import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA, LOAD_DATA_FROM_CACHE, TOGGLE_ROW_SELECTION } from "./actionTypes";


const initialState = {
  columns: [],
  rows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
  isReady: false,
  cacheKey: null,
};


export default (state = initialState, action) => {
  const {cacheKey} = action;
  if (!cacheKey) {
    return {
      ...state,
    };
  }

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      if (state.cacheKey === cacheKey) {
        // No need to initiate multiple times
        return {
          ...state
        };
      }
      return {
        ...initialState,
        isFetching: true,
        cacheKey,
      };

    case COMPLETE_FETCH_DATA: {
      return {
        ...initialState,
        columns: action.payload.columns,
        rows: action.payload.rows,  // Here we do not transform data into maps/dicts
        querySQL: action.payload.query_sql,
        isFetching: false,
        isReady: true,
        cacheKey,
      }
    }

    case LOAD_DATA_FROM_CACHE: {
      return {
        ...initialState,
        ...action.payload,
        isFetching: false,
        isReady: true,
        cacheKey,
      };
    }

    case TOGGLE_ROW_SELECTION:
      if (state.selectedRowList.includes(action.rowId)) {
        const temp = state.selectedRowList.indexOf(action.rowId);
        return {
          ...state,
          selectedRowList: [
            ...state.selectedRowList.slice(0, temp),
            ...state.selectedRowList.slice(temp + 1)
          ],
        };
      } else {
        return {
          ...state,
          selectedRowList: [
            ...state.selectedRowList,
            action.rowId,
          ]
        };
      }

    default:
      return {
        ...state,
      };
  }
}