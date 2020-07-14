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

const initiateFetch = (key) => {
  return {
    [key]: {
      ...initialState,
      isFetching: true,
    },
  };
};

const completeFetch = (key, payload) => {
  return {
    [key]: {
      ...initialState,
      columns: payload.columns,
      rows: payload.rows, // Here we do not transform data into maps/dicts
      querySQL: payload.query_sql,
      isFetching: false,
      isReady: true,
      lastFetchedAt: +new Date(),
    },
  };
};

const [useStore] = create((set, get) => ({
  fetchData: async (key, querySpecification) => {
    if (!key) {
      return;
    }

    if (get()[key] && get()[key].isFetching) {
      return;
    }

    set((state) => ({
      ...initiateFetch(key),
    }));

    try {
      const response = await axios.post(dataURL, {
        source_label: querySpecification.sourceLabel,
        table_name: querySpecification.tableName,
      });
      set((state) => ({
        ...completeFetch(key, response.data),
      }));
      /* if (!!updateElse) {
        for (const updater of updateElse) {
          updater(key, response.data);
        }
      } */
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }

    const subscriber = () => {
      querySpecificationStoreAPI.subscribe(
        (qs) =>
          console.log("qs changed", qs.lastDirtyAt, get()[key].lastFetchedAt),
        (state) => state[key]
      );
    };
  },
}));

export default useStore;
