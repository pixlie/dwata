import create from "zustand";
import { concat, remove } from "lodash";

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

const initiateFilter = (inner, columnName, dataType) => {
  if (Object.keys(inner.filterBy).includes(columnName)) {
    return {
      ...inner,
    };
  }

  let initialFilter = {};
  if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(dataType.type)) {
    initialFilter = {
      display: "",
    };
  } else if (dataType.type === "BOOLEAN") {
    initialFilter = {
      value: null,
    };
  }
  return {
    ...inner,
    filterBy: {
      ...inner.filterBy,
      [columnName]: {
        ...initialFilter,
      },
    },
  };
};

const removeFilter = (inner, columnName) => {
  // We create a reducer that will add any key (and its corresponding value from current filters)
  //  if the key is not the one that we want to remove
  const reducer = (acc, key) => {
    if (key !== columnName) {
      return {
        ...acc,
        [key]: inner.filterBy[key],
      };
    }
    return {
      ...acc,
    };
  };
  return {
    ...inner,
    filterBy: Object.keys(inner.filterBy).reduce(reducer, {}),
  };
};

const gotoPage = (inner, pageNum) => ({
  ...inner,
  offset: (pageNum - 1) * inner.limit,
});

const [useStore] = create((set) => ({
  inner: {},

  setQuerySpecification: (key, payload) =>
    set((state) => ({
      inner: setQuerySpecification(state.inner, key, payload),
    })),

  nextPage: (key) =>
    set((state) => ({
      inner: {
        ...state.inner,
        offset: state.inner.offset + state.inner.limit,
      },
    })),

  previousPage: (key) =>
    set((state) => ({
      inner: {
        ...state.inner,
        offset: state.inner.offset - state.inner.limit,
      },
    })),

  gotoPage: (key, pageNum) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: gotoPage(state.inner[key], pageNum),
      },
    })),

  initialFilter: (key, columnName, dataType) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: initiateFilter(state.inner[key], columnName, dataType),
      },
    })),

  removeFilter: (key, columnName) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: removeFilter(state.inner[key], columnName),
      },
    })),
}));

export default useStore;
