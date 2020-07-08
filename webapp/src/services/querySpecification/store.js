import create from "zustand";

const initialState = {
  columnsSelected: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,

  isReady: false,
};

const initiateFetch = (state, queryUUID) => {
  if (!queryUUID) {
    return {
      ...state,
    };
  }

  if (queryUUID in state) {
    // No need to initiate multiple times
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
      columnsSelected: payload.columns,
      count: payload.count,
      limit: payload.limit,
      offset: payload.offset,
      isReady: true,
    },
  };
};

const cacheQuerySpecification = (state, queryUUID, editing) => {
  if (!queryUUID) {
    return {
      ...state,
    };
  }

  return {
    ...state,
    [queryUUID]: {
      ...initialState,
      ...editing,
      isReady: true,
    },
  };
};

const [useStore] = create((set) => ({
  inner: {},
  editing: {},

  initiateFetch: (queryUUID) =>
    set((state) => ({
      inner: initiateFetch(state.inner, queryUUID),
    })),

  completeFetch: (queryUUID, payload) =>
    set((state) => ({
      inner: completeFetch(state.inner, queryUUID, payload),
    })),

  cacheQuerySpecification: (queryUUID) =>
    set((state) => ({
      inner: cacheQuerySpecification(state.inner, queryUUID, state.editing),
    })),
}));

export default useStore;
