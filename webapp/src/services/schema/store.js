import create from "zustand";
import axios from "axios";

import { transformData } from "utils";
import { schemaURL } from "services/urls";

const initialState = {
  columns: [],
  rows: [],

  isFetching: false,
  isReady: false,
};

const initiateFetch = (inner, sourceLabel) => {
  if (sourceLabel in inner) {
    return {
      ...inner,
    };
  }

  return {
    ...inner,
    [sourceLabel]: {
      ...initialState,
      isFetching: true,
    },
  };
};

const completeFetch = (inner, sourceLabel, payload) => {
  return {
    ...inner,
    [sourceLabel]: {
      columns: payload.columns,
      rows: payload.rows.map((row) => transformData(payload.columns, row)),
      isFetching: false,
      isReady: true,
    },
  };
};

const [useStore] = create((set, get) => ({
  inner: {},

  fetchSchema: async (sourceLabel) => {
    if (!sourceLabel) {
      return;
    }
    if (get().inner[sourceLabel] && get().inner[sourceLabel].isFetching) {
      return;
    }

    set((state) => ({
      inner: initiateFetch(state.inner, sourceLabel),
    }));

    try {
      const response = await axios.get(`${schemaURL}/${sourceLabel}`);
      set((state) => ({
        inner: completeFetch(state.inner, sourceLabel, response.data),
      }));
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useStore;
