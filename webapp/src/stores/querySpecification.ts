import create from "zustand";
import _ from "lodash";
import { IDatabaseTable } from "utils/types";

interface IQuerySpecification {
  sourceLabel: string;
  select: IDatabaseTable[];
  columns?: string[];
  embeddedColumns?: string[];

  filterBy?: {
    [key: string]: string;
  };
  orderBy?: {
    [key: string]: string;
  };
  count?: number;
  limit?: number;
  offset?: number;

  isSavedQuery?: boolean;
  fetchNeeded?: boolean;
}

const initialState = {
  sourceLabel: null,

  select: [],
  columns: [],
  embeddedColumns: [],
  filterBy: {},
  orderBy: {},

  count: undefined,
  limit: undefined,
  offset: undefined,
  activeColumnHeadSpecification: null,

  tableColors: {},

  isRowSelectable: false,
  isReady: false,
  isFetching: false,
  fetchNeeded: false,
};

const loadFromLocalStorage = () => {
  const temp = window.localStorage.getItem("querySpecification");
  if (!!temp) {
    return JSON.parse(temp);
  }
  return {};
};

const saveToLocalStorage = (key: string, payload: IQuerySpecification) => {
  if (key === "main") {
    window.localStorage.setItem(
      "querySpecification",
      JSON.stringify({
        [key]: payload,
      })
    );
  }
};

const colors = [
  "orange",
  "teal",
  "pink",
  "purple",
  "indigo",
  "blue",
  "red",
  "yellow",
];

const selectColor = (tableColumnName: string, existingColors = {}) => {
  const tableName =
    tableColumnName.indexOf(".") === -1
      ? tableColumnName
      : tableColumnName.split(".")[0];

  if (Object.keys(existingColors).includes(tableName)) {
    return existingColors;
  } else {
    let rc = colors[_.random(0, colors.length - 1)];
    while (
      colors.length > Object.keys(existingColors).length &&
      Object.values(existingColors).includes(rc)
    ) {
      rc = colors[_.random(0, colors.length - 1)];
    }
    return {
      ...existingColors,
      [tableName]: rc,
    };
  }
};

const initiateQuerySpecification = (payload: IQuerySpecification) => ({
  ...initialState,
  ...payload,

  // tableColors: selectColor(payload.select[0].tableName),

  // We do not set isReady:true implicitly
});

// const initiateFilter = (inner, columnName, dataType) => {
//   if (Object.keys(inner.filterBy).includes(columnName)) {
//     return {
//       ...inner,
//     };
//   }

//   let initialFilter = {};
//   if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(dataType.type)) {
//     initialFilter = {
//       display: "",
//     };
//   } else if (dataType.type === "BOOLEAN") {
//     initialFilter = {
//       value: null,
//     };
//   }
//   return {
//     ...inner,
//     filterBy: {
//       ...inner.filterBy,
//       [columnName]: {
//         ...initialFilter,
//       },
//     },
//   };
// };

// const removeFilter = (inner, columnName) => {
//   // We create a reducer that will add any key (and its corresponding value from current filters)
//   //  if the key is not the one that we want to remove
//   const reducer = (acc, key) => {
//     if (key !== columnName) {
//       return {
//         ...acc,
//         [key]: inner.filterBy[key],
//       };
//     }
//     return {
//       ...acc,
//     };
//   };
//   return {
//     ...inner,
//     filterBy: Object.keys(inner.filterBy).reduce(reducer, {}),
//     fetchNeeded: true,
//   };
// };

const nextPage = (inner: IQuerySpecification) => ({
  ...inner,
  offset: (inner.offset || 0) + (inner.limit || 0),
  fetchNeeded: true,
});

// const previousPage = (inner) => ({
//   ...inner,
//   offset: inner.offset - inner.limit,
//   fetchNeeded: true,
// });

// const gotoPage = (inner, pageNum) => ({
//   ...inner,
//   offset: (pageNum - 1) * inner.limit,
//   fetchNeeded: true,
// });

// const changeOrderBy = (inner) => ({
//   ...inner,
//   fetchNeeded: true,
// });

// const toggleOrderBy = (inner, columnName) => {
//   const currentOrder = inner.orderBy[columnName];
//   let newOrder = undefined;
//   if (currentOrder === undefined) {
//     newOrder = "asc";
//   } else if (currentOrder === "asc") {
//     newOrder = "desc";
//   }

//   return {
//     ...inner,
//     orderBy: {
//       ...inner.orderBy,
//       [columnName]: newOrder,
//     },
//     fetchNeeded: true,
//   };
// };

// const setFilter = (inner, columnName, filters) => ({
//   ...inner,
//   filterBy: {
//     ...inner.filterBy,
//     [columnName]: filters,
//   },
//   // We do not set `fetchNeeded: true` implicitly
// });

// const requestRefetch = (inner) => ({
//   ...inner,
//   fetchNeeded: true,
// });

// const toggleColumnHeadSpecification = (inner, columnName) => ({
//   ...inner,
//   activeColumnHeadSpecification:
//     inner.activeColumnHeadSpecification === null ||
//     inner.activeColumnHeadSpecification !== columnName
//       ? columnName
//       : null,
// });

// const toggleColumnSelection = (inner, label) => {
//   const selectedColumLabels = inner.columns.map((x) => x.label);
//   if (selectedColumLabels.includes(label)) {
//     // This column is currently selected, let's get it removed
//     // Find the position of this column
//     const pos = inner.columns.findIndex((x) => x.label === label);
//     return {
//       ...inner,
//       select: [...inner.columns.slice(0, pos), ...inner.columns.slice(pos + 1)],
//       fetchNeeded: true,
//     };
//   } else {
//     // This column is not selected, let's add it
//     const [tableName, columnName] = label.split(".");
//     return {
//       ...inner,
//       select: [
//         ...inner.columns,
//         {
//           label,
//           tableName,
//           columnName,
//         },
//       ],
//       fetchNeeded: true,
//     };
//   }
// };

// const toggleRelatedTable = (inner, label) => {
//   const selectedTableNames = [...new Set(inner.select.map((x) => x.tableName))];
//   if (selectedTableNames.includes(label)) {
//     // This table is currently selected, let's get it (or all of its columns) removed
//     return {
//       ...inner,
//       select: inner.select.filter((x) => x.tableName !== label),
//       tableColors: _.omit(inner.tableColors, [label]),
//       fetchNeeded: true,
//     };
//   } else {
//     // This column is not selected, let's add it
//     return {
//       ...inner,
//       select: [
//         ...inner.select,
//         {
//           label,
//           tableName: label,
//         },
//       ],
//       tableColors: selectColor(label, inner.tableColors),
//       fetchNeeded: true,
//     };
//   }
// };

const expandTableColumn = (el: string) => ({
  label: el,
  tableName: el.split(".")[0],
  columnName: el.split(".")[1],
});

// export const querySpecificationObject = (state, payload) => ({
//   ...state,
//   select: payload.select.map((x) => expandTableColumn(x)),
//   columns: payload.columns.map((x) => expandTableColumn(x)),
//   embeddedColumns: payload.embedded.reduce(
//     (acc, x) => [...acc, x.columns.map((xy) => expandTableColumn(xy))],
//     []
//   ),
//   count: payload.count,
//   limit: payload.limit,
//   offset: payload.offset,

//   isReady: true,
//   isFetching: false,
//   fetchNeeded: false,
// });

// export const getQuerySpecificationPayload = (querySpecification) => ({
//   select: querySpecification.select.map((x) => x.label),
//   source_label: querySpecification.sourceLabel,
//   order_by: querySpecification.orderBy,
//   filter_by: querySpecification.filterBy,
//   offset: querySpecification.offset,
//   limit: querySpecification.limit,
// });

interface IQuerySpecificationStore {
  specifications: {
    [key: string]: IQuerySpecification;
  };

  initiateQuerySpecification: (
    key: string,
    payload: IQuerySpecification
  ) => void;
  nextPage: (key: string) => void;
}

const useQuerySpecification = create<IQuerySpecificationStore>((set) => ({
  ...loadFromLocalStorage(),

  initiateQuerySpecification: (key, payload) =>
    set((state) => {
      const _temp = initiateQuerySpecification(payload);
      saveToLocalStorage(key, _temp);
      return {
        ...state,
        specifications: {
          ...state.specifications,
          [key]: _temp,
        },
      };
    }),

  nextPage: (key) =>
    set((state) => ({
      ...state,
      specifications: {
        ...state.specifications,
        [key]: nextPage(state.specifications[key]),
      },
    })),

  // previousPage: (key) =>
  //   set((state) => ({
  //     [key]: previousPage(state[key]),
  //   })),

  // gotoPage: (key, pageNum) =>
  //   set((state) => ({
  //     [key]: gotoPage(state[key], pageNum),
  //   })),

  // initiateFilter: (key, columnName, dataType) =>
  //   set((state) => ({
  //     [key]: initiateFilter(state[key], columnName, dataType),
  //   })),

  // removeFilter: (key, columnName) =>
  //   set((state) => ({
  //     [key]: removeFilter(state[key], columnName),
  //   })),

  // changeOrderBy: (key) =>
  //   set((state) => ({
  //     [key]: changeOrderBy(state[key]),
  //   })),

  // toggleOrderBy: (key, columnName) =>
  //   set((state) => ({
  //     [key]: toggleOrderBy(state[key], columnName),
  //   })),

  // setFilter: (key, columnName, filters) =>
  //   set((state) => ({
  //     [key]: setFilter(state[key], columnName, filters),
  //   })),

  // requestRefetch: (key) =>
  //   set((state) => ({
  //     [key]: requestRefetch(state[key]),
  //   })),

  // toggleColumnHeadSpecification: (key, columnName) =>
  //   set((state) => ({
  //     [key]: toggleColumnHeadSpecification(state[key], columnName),
  //   })),

  // toggleColumnSelection: (key, columnName) =>
  //   set((state) => {
  //     const _temp = toggleColumnSelection(state[key], columnName);
  //     saveToLocalStorage(key, _temp);
  //     return {
  //       [key]: _temp,
  //     };
  //   }),

  // toggleRelatedTable: (key, relatedLabel) =>
  //   set((state) => {
  //     const _temp = toggleRelatedTable(state[key], relatedLabel);
  //     saveToLocalStorage(key, _temp);
  //     return {
  //       [key]: _temp,
  //     };
  //   }),
}));

export default useQuerySpecification;
