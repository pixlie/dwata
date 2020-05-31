import { INITIATE_FETCH_DATA, COMPLETE_FETCH_DATA, LOAD_DATA_FROM_CACHE, TOGGLE_ROW_SELECTION } from "./actionTypes";


const initialState = {
  sourceId: null,
  tableName: null,
  columns: [],
  rows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
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
        isFetching: true,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: undefined,
        }
      };

    case COMPLETE_FETCH_DATA: {
      const temp = {
        columns: action.payload.columns,
        rows: action.payload.rows,  // Here we do not transform data into maps/dicts
        querySQL: action.payload.query_sql,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        _cacheKey,
      };
      return {
        ...initialState,
        ...temp,
        isFetching: false,
        isReady: true,
        _cachedData: {
          ...state._cachedData,
          [_cacheKey]: {
            ...temp
          },
        }
      }
    }

    case LOAD_DATA_FROM_CACHE: {
      return {
        ...initialState,
        ...state._cachedData[_cacheKey],
        isFetching: false,
        isReady: true,
        _cachedData: {
          ...state._cachedData
        },
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