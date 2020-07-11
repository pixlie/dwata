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

const gotoPage = (inner, key, pageNum) => ({
  ...inner,
  [key]: {
    ...inner[key],
    offset: (pageNum - 1) * inner[key].limit,
  },
});

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

  nextPage: () =>
    set((state) => ({
      inner: {
        ...state.inner,
        offset: state.inner.offset + state.inner.limit,
      },
    })),

  previousPage: () =>
    set((state) => ({
      inner: {
        ...state.inner,
        offset: state.inner.offset - state.inner.limit,
      },
    })),

  gotoPage: (key, pageNum) =>
    set((state) => ({
      inner: gotoPage(state.inner, key, pageNum),
    })),
}));

export default useStore;
