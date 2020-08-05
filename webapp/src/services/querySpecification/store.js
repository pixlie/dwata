import create from "zustand";

const initialState = {
  sourceLabel: null,

  select: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,
  activeColumnHeadSpecification: null,

  isReady: false,
  isFetching: false,
  fetchNeeded: false,
};

const initiateQuerySpecification = (payload) => ({
  ...initialState,
  ...payload,

  // We do not set isReady:true implicitly
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
    fetchNeeded: true,
  };
};

const nextPage = (inner) => ({
  ...inner,
  offset: inner.offset + inner.limit,
  fetchNeeded: true,
});

const previousPage = (inner) => ({
  ...inner,
  offset: inner.offset - inner.limit,
  fetchNeeded: true,
});

const gotoPage = (inner, pageNum) => ({
  ...inner,
  offset: (pageNum - 1) * inner.limit,
  fetchNeeded: true,
});

const changeOrderBy = (inner) => ({
  ...inner,
  fetchNeeded: true,
});

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
    fetchNeeded: true,
  };
};

const setFilter = (inner, columnName, filters) => ({
  ...inner,
  filterBy: {
    ...inner.filterBy,
    [columnName]: filters,
  },
  // We do not set `fetchNeeded: true` implicitly
});

const requestRefetch = (inner) => ({
  ...inner,
  fetchNeeded: true,
});

const toggleColumnHeadSpecification = (inner, columnName) => ({
  ...inner,
  activeColumnHeadSpecification:
    inner.activeColumnHeadSpecification === null ||
    inner.activeColumnHeadSpecification !== columnName
      ? columnName
      : null,
});

const toggleColumnSelection = (inner, label) => {
  const selectedColumLabels = inner.select.map((x) => x.label);
  if (selectedColumLabels.includes(label)) {
    // This column is currently selected, let's get it removed
    // Find the position of this column
    const pos = inner.select.findIndex((x) => x.label === label);
    return {
      ...inner,
      select: [...inner.select.slice(0, pos), ...inner.select.slice(pos + 1)],
    };
  } else {
    // This column is not selected, let's add it
    const [tableName, columnName] = label.split(".");
    return {
      ...inner,
      select: [
        ...inner.select,
        {
          label,
          tableName,
          columnName,
        },
      ],
      fetchNeeded: true,
    };
  }
};

const toggleRelatedTable = (inner, label) => {
  const selectedTableNames = [...new Set(inner.select.map((x) => x.tableName))];
  if (selectedTableNames.includes(label)) {
    // This table is currently selected, let's get all of its columns removed
    return {
      ...inner,
      select: inner.select.filter((x) => x.tableName !== label),
      fetchNeeded: true,
    };
  } else {
    // This column is not selected, let's add it
    return {
      ...inner,
      select: [
        ...inner.select,
        {
          label,
          tableName: label,
        },
      ],
      fetchNeeded: true,
    };
  }
};

const [useStore, querySpecificationStoreAPI] = create((set) => ({
  initiateQuerySpecification: (key, payload) =>
    set(() => ({
      [key]: initiateQuerySpecification(payload),
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

  requestRefetch: (key) =>
    set((state) => ({
      [key]: requestRefetch(state[key]),
    })),

  toggleColumnHeadSpecification: (key, columnName) =>
    set((state) => ({
      [key]: toggleColumnHeadSpecification(state[key], columnName),
    })),

  toggleColumnSelection: (key, columnName) =>
    set((state) => ({
      [key]: toggleColumnSelection(state[key], columnName),
    })),

  toggleRelatedTable: (key, relatedLabel) =>
    set((state) => ({
      [key]: toggleRelatedTable(state[key], relatedLabel),
    })),
}));

export { querySpecificationStoreAPI };
export default useStore;
