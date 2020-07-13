import create from "zustand";

const initialState = {
  sourceLabel: null,
  tableName: null,

  columnsSelected: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,
  activeColumnHeadSpecification: null,

  isReady: false,
  isFetching: false,
  lastDirtyAt: null,
};

const initiateQuerySpecification = (payload) => ({
  ...initialState,
  ...payload,

  // We do not set isReady:true implicitly
});

const setQuerySpecification = (inner, payload) => ({
  ...inner,
  ...payload,
  columnsSelected: payload.columns,

  isReady: true,
  isFetching: false,
});

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

const nextPage = (inner) => ({
  ...inner,
  offset: inner.offset + inner.limit,
  lastDirtyAt: +new Date(),
});

const previousPage = (inner) => ({
  ...inner,
  offset: inner.offset - inner.limit,
  lastDirtyAt: +new Date(),
});

const gotoPage = (inner, pageNum) => ({
  ...inner,
  offset: (pageNum - 1) * inner.limit,
  lastDirtyAt: +new Date(),
});

const changeOrderBy = (inner) => {};

const toggleOrderBy = (inner, columnName) => {
  const currentOrder = inner.orderBy[columnName];
  let newOrder = undefined;
  if (currentOrder === undefined) {
    newOrder = "asc";
  } else if (currentOrder === "asc") {
    newOrder = "desc";
  }

  return {
    ...inner,
    orderBy: {
      ...inner.orderBy,
      [columnName]: newOrder,
    },
    lastDirtyAt: +new Date(),
  };
};

const setFilter = (inner, columnName, filters) => ({
  ...inner,
  filterBy: {
    ...inner.filterBy,
    [columnName]: filters,
  },
});

const toggleColumnHeadSpecification = (inner, columnName) => ({
  ...inner,
  activeColumnHeadSpecification:
    inner.activeColumnHeadSpecification === null ||
    inner.activeColumnHeadSpecification !== columnName
      ? columnName
      : null,
});

const [useStore, querySpecificationStoreAPI] = create((set) => ({
  inner: {},

  initiateQuerySpecification: (key, payload) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: initiateQuerySpecification(payload),
      },
    })),

  setQuerySpecification: (key, payload) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: setQuerySpecification(state.inner[key], payload),
      },
    })),

  nextPage: (key) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: nextPage(state.inner[key]),
      },
    })),

  previousPage: (key) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: previousPage(state.inner[key]),
      },
    })),

  gotoPage: (key, pageNum) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: gotoPage(state.inner[key], pageNum),
      },
    })),

  initiateFilter: (key, columnName, dataType) =>
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

  changeOrderBy: (key) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: changeOrderBy(state.inner[key]),
      },
    })),

  toggleOrderBy: (key, columnName) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: toggleOrderBy(state.inner[key], columnName),
      },
    })),

  setFilter: (key, columnName, filters) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: setFilter(state.inner[key], columnName, filters),
      },
    })),

  toggleColumnHeadSpecification: (key, columnName) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [key]: toggleColumnHeadSpecification(state.inner[key], columnName),
      },
    })),
}));

export { querySpecificationStoreAPI };
export default useStore;
