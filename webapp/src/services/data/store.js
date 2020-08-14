import create from "zustand";
import axios from "axios";

import { dataURL, dataItemURL } from "services/urls";
import { querySpecificationStoreAPI } from "services/querySpecification/store";

const initialState = {
  columns: [],
  rows: [],
  embeddedRows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
  isReady: false,
  lastError: null,
  lastFetchedAt: null,
};

const completeFetchList = (inner, payload) => ({
  columns: payload.columns,
  rows: payload.rows, // Here we do not transform data into maps/dicts
  embeddedRows: "embedded_rows" in payload ? payload.embedded_rows : [],
  querySQL: payload.query_sql,
  selectedRowList: [...inner.selectedRowList],

  isFetching: false,
  isReady: true,
  lastError: null,
  lastFetchedAt: +new Date(),
});

const completeFetchItem = (payload) => ({
  item: payload.item,
  querySQL: payload.query_sql,
  selectedRowList: [], // This is a hack

  isFetching: false,
  isReady: true,
  lastFetchedAt: +new Date(),
});

const processColumns = (columns) => {
  const acc = [];
  for (const el of columns) {
    if (typeof el === "string") {
      acc.push({
        label: el,
        tableName: el.split(".")[0],
        columnName: el.split(".")[1],
      });
    } else if (typeof el === "object" && Array.isArray(el)) {
      acc.push(processColumns(el));
    }
  }
  return acc;
};

const querySpecificationObject = (state, payload) => ({
  ...state,
  select: processColumns(payload.columns),
  count: payload.count,
  limit: payload.limit,
  offset: payload.offset,
  isReady: true,
  isFetching: false,
  fetchNeeded: false,
});

const processSelect = (select) => {
  const acc = [];
  for (const el of select) {
    if (typeof el === "object" && !Array.isArray(el)) {
      acc.push(el.label);
    } else if (typeof el === "object" && Array.isArray(el)) {
      acc.push(processSelect(el));
    }
  }
  return acc;
};

const getQuerySpecificationPayload = (querySpecification) => ({
  select: processSelect(querySpecification.select),
  source_label: querySpecification.sourceLabel,
  order_by: querySpecification.orderBy,
  filter_by: querySpecification.filterBy,
  offset: querySpecification.offset,
  limit: querySpecification.limit,
});

const [useStore] = create((set, get) => ({
  fetchData: async (key, querySpecification) => {
    if (!key) {
      return;
    }

    if (get()[key]) {
      if (get()[key].isFetching) {
        // There is a fetch currently executing, no need to run another one
        return;
      }
      set((state) => ({
        [key]: {
          ...state[key],
          isFetching: true,
        },
      }));
    } else {
      set(() => ({
        [key]: {
          ...initialState,
          isFetching: true,
        },
      }));
    }

    let response = null;
    try {
      if ("pk" in querySpecification) {
        response = await axios.get(
          `${dataItemURL}/${querySpecification.sourceLabel}/${querySpecification.tableName}/${querySpecification.pk}`
        );
        set(() => ({
          [key]: completeFetchItem(response.data),
        }));
      } else {
        response = await axios.post(
          dataURL,
          getQuerySpecificationPayload(querySpecification)
        );
        // We use the Query Specification Store API directly to set this new data
        querySpecificationStoreAPI.setState((state) => ({
          [key]: querySpecificationObject(state[key], response.data),
        }));
        set((state) => ({
          [key]: completeFetchList(state[key], response.data),
        }));
      }
    } catch (error) {
      console.log("Could not fetch data. Try again later.");
    }
  },
}));

export default useStore;
