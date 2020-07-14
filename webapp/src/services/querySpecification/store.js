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

const setQuerySpecification = (payload) => ({
  ...payload,
  columnsSelected: payload.columns,

  isReady: true,
  isFetching: false,
});

const initiateFilter = (inner, columnName, dataType) => {
  if (Object.keys(inner.filterBy).includes(columnName)) {
    return {};
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
    filterBy: {
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
    filterBy: Object.keys(inner.filterBy).reduce(reducer, {}),
  };
};

const nextPage = (inner) => ({
  offset: inner.offset + inner.limit,
  lastDirtyAt: +new Date(),
});

const previousPage = (inner) => ({
  offset: inner.offset - inner.limit,
  lastDirtyAt: +new Date(),
});

const gotoPage = (inner, pageNum) => ({
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
    orderBy: {
      [columnName]: newOrder,
    },
    lastDirtyAt: +new Date(),
  };
};

const setFilter = (inner, columnName, filters) => ({
  filterBy: {
    [columnName]: filters,
  },
});

const toggleColumnHeadSpecification = (inner, columnName) => ({
  activeColumnHeadSpecification:
    inner.activeColumnHeadSpecification === null ||
    inner.activeColumnHeadSpecification !== columnName
      ? columnName
      : null,
});

const [useStore, querySpecificationStoreAPI] = create((set) => ({
  initiateQuerySpecification: (key, payload) =>
    set((state) => ({
      [key]: initiateQuerySpecification(payload),
    })),

  setQuerySpecification: (key, payload) =>
    set((state) => ({
      [key]: setQuerySpecification(payload),
    })),

  nextPage: (key) =>
    set((state) => ({
      [key]: nextPage(state[key]),
    })),

  previousPage: (key) =>
    set((state) => ({
      [key]: previousPage(state[key]),
    })),

  gotoPage: (key, pageNum) =>
    set((state) => ({
      [key]: gotoPage(state[key], pageNum),
    })),

  initiateFilter: (key, columnName, dataType) =>
    set((state) => ({
      [key]: initiateFilter(state[key], columnName, dataType),
    })),

  removeFilter: (key, columnName) =>
    set((state) => ({
      [key]: removeFilter(state[key], columnName),
    })),

  changeOrderBy: (key) =>
    set((state) => ({
      [key]: changeOrderBy(state[key]),
    })),

  toggleOrderBy: (key, columnName) =>
    set((state) => ({
      [key]: toggleOrderBy(state[key], columnName),
    })),

  setFilter: (key, columnName, filters) =>
    set((state) => ({
      [key]: setFilter(state[key], columnName, filters),
    })),

  toggleColumnHeadSpecification: (key, columnName) =>
    set((state) => ({
      [key]: toggleColumnHeadSpecification(state[key], columnName),
    })),
}));

export { querySpecificationStoreAPI };
export default useStore;
