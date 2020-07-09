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

const setQuerySpecification = (inner, key, payload) => {
  return {
    ...inner,
    [key]: {
      ...initialState,
      columnsSelected: payload.columns,
      count: payload.count,
      limit: payload.limit,
      offset: payload.offset,
      isReady: true,
    },
  };
};

const cacheQuerySpecification = (inner, key, editing) => {
  return {
    ...inner,
    [key]: {
      ...initialState,
      ...editing,
      isReady: true,
    },
  };
};

const [useStore] = create((set) => ({
  inner: {},
  editing: {},

  setQuerySpecification: (key, payload) =>
    set((state) => ({
      inner: setQuerySpecification(state.inner, key, payload),
    })),

  cacheQuerySpecification: (key) =>
    set((state) => ({
      inner: cacheQuerySpecification(state.inner, key, state.editing),
    })),
}));

export default useStore;
