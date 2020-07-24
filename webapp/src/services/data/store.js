import create from "zustand";
import axios from "axios";

import { dataURL, dataItemURL } from "services/urls";
import { querySpecificationStoreAPI } from "services/querySpecification/store";

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

const completeFetchList = (payload) => ({
  ...initialState,
  columns: payload.columns,
  rows: payload.rows, // Here we do not transform data into maps/dicts
  querySQL: payload.query_sql,
  isFetching: false,
  isReady: true,
  lastFetchedAt: +new Date(),
});

const completeFetchItem = (payload) => ({
  item: payload.item,
  querySQL: payload.query_sql,
  isFetching: false,
  isReady: true,
  lastFetchedAt: +new Date(),
  selectedRowList: [], // This is a hack
});

const querySpecificationObject = (state, payload) => ({
  ...state,
  select: payload.columns.map((tc) => ({
    label: tc,
    tableName: tc.split(".")[0],
    columnName: tc.split(".")[1],
  })),
  count: payload.count,
  limit: payload.limit,
  offset: payload.offset,
  isReady: true,
  isFetching: false,
  fetchNeeded: false,
});

const getQuerySpecificationPayload = (querySpecification) => ({
  select: querySpecification.select.map((x) => x.label),
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

    if (get()[key] && get()[key].isFetching) {
      return;
    }

    set(() => ({
      [key]: {
        ...initialState,
        isFetching: true,
      },
    }));

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
        set(() => ({
          [key]: completeFetchList(response.data),
        }));
        // We use the Query Specification Store API directly to set this new data
        querySpecificationStoreAPI.setState((state) => ({
          [key]: querySpecificationObject(state[key], response.data),
        }));
      }
    } catch (error) {
      console.log("Could not fetch data. Try again later.");
    }
  },
}));

export default useStore;
