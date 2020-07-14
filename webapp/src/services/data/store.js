import create from "zustand";
import axios from "axios";

import { dataURL } from "services/urls";
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

const completeFetch = (payload) => ({
  ...initialState,
  columns: payload.columns,
  rows: payload.rows, // Here we do not transform data into maps/dicts
  querySQL: payload.query_sql,
  isFetching: false,
  isReady: true,
  lastFetchedAt: +new Date(),
});

const querySpecificationObject = (state, payload) => ({
  ...state,
  ...payload,
  columnsSelected: payload.columns,
  isReady: true,
  isFetching: false,
  fetchNeeded: false,
});

const getQuerySpecificationPayload = (querySpecification) => ({
  columns:
    !!querySpecification.columnsSelected &&
    querySpecification.columnsSelected.length > 0
      ? querySpecification.columnsSelected
      : undefined,
  source_label: querySpecification.sourceLabel,
  table_name: querySpecification.tableName,
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

    try {
      const response = await axios.post(
        dataURL,
        getQuerySpecificationPayload(querySpecification)
      );
      set(() => ({
        [key]: completeFetch(response.data),
      }));
      // We use the Query Specification Store API directly to set this new data
      querySpecificationStoreAPI.setState((state) => ({
        [key]: querySpecificationObject(state[key], response.data),
      }));
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useStore;
