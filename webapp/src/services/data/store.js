import create from "zustand";
import axios from "axios";

import { dataURL } from "services/urls";

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

const initiateFetch = (inner, key) => {
  if (key in inner) {
    return {
      // No need to initiate multiple times
      ...inner,
    };
  }

  return {
    ...inner,
    [key]: {
      ...initialState,
      isFetching: true,
    },
  };
};

const completeFetch = (inner, key, payload) => {
  return {
    ...inner,
    [key]: {
      ...initialState,
      columns: payload.columns,
      rows: payload.rows, // Here we do not transform data into maps/dicts
      querySQL: payload.query_sql,
      isFetching: false,
      isReady: true,
    },
  };
};

const [useStore] = create((set, get) => ({
  inner: {},

  fetchData: async (key, querySpecification, updateElse) => {
    if (!key) {
      return;
    }

    if (get().inner[key] && get().inner[key].isFetching) {
      return;
    }

    set((state) => ({
      inner: initiateFetch(state.inner, key),
    }));

    try {
      const response = await axios.post(dataURL, {
        source_label: querySpecification.sourceLabel,
        table_name: querySpecification.tableName,
      });
      set((state) => ({
        inner: completeFetch(state.inner, key, response.data),
      }));
      if (!!updateElse) {
        for (const updater of updateElse) {
          updater(key, response.data);
        }
      }
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useStore;
