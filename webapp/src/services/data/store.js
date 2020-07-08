import create from "zustand";

const initialState = {
  columns: [],
  rows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
  isReady: false,
  lastError: null,
  lastFetchedAt: null,
};

const initiateFetch = (state, queryUUID) => {
  if (!queryUUID) {
    return {
      ...state,
    };
  }

  return {
    ...state,
    [queryUUID]: {
      ...initialState,
    },
  };
};

const completeFetch = (state, queryUUID, payload) => {
  if (!queryUUID) {
    return {
      ...state,
    };
  }

  return {
    ...state,
    [queryUUID]: {
      ...initialState,
      columns: payload.columns,
      rows: payload.rows, // Here we do not transform data into maps/dicts
      querySQL: payload.query_sql,
      isFetching: false,
      isReady: true,
    },
  };
};

const [useStore] = create((set) => ({
  inner: {},

  initiateFetch: (queryUUID) =>
    set((state) => ({
      inner: initiateFetch(state.inner, queryUUID),
    })),

  completeFetch: (queryUUID, payload) =>
    set((state) => ({
      inner: completeFetch(state.inner, queryUUID, payload),
    })),
}));

export default useStore;
