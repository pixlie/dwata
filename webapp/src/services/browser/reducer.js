import { INITIATE_FETCH_DATA, FETCH_DATA } from "./actionTypes";


const initialState = {
  sourceId: null,
  tableName: null,
  id: null,
  columns: [],
  rows: [],
  querySQL: null,
  isFetching: false,
  isReady: false,
  _cachedData: {},
};


export default (state = initialState, action) => {
  const _id = `${action.sourceId}/${action.tableName}`;

  switch (action.type) {
    case INITIATE_FETCH_DATA:
      return {
        ...state,
        isFetching: true,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        id: _id,
        _cachedData: {
          ...state._cachedData,
          [_id]: undefined,
        }
      };

    case FETCH_DATA:
      const temp = {
        columns: action.payload.columns,
        rows: action.payload.rows,  // Here we do not transform data into maps/dicts
        querySQL: action.payload.query_sql,
        sourceId: parseInt(action.sourceId),
        tableName: action.tableName,
        id: _id,
        isFetching: false,
        isReady: true,
      };
      return {
        ...state,
        ...temp,
        _cachedData: {
          ...state._cachedData,
          [_id]: temp,
        }
      }

    default:
      return state;
  }
}