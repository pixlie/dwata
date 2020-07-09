import create from "zustand";
import axios from "axios";

import { transformData } from "utils";
import { sourceURL } from "services/urls";

const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};

const initiateFetch = (inner) => ({
  ...inner,
  isFetching: true,
});

const completeFetch = (inner, payload) => ({
  columns: payload.columns,
  rows: payload.rows.map((row) => transformData(payload.columns, row)),
  isFetching: false,
  isReady: true,
});

const [useStore] = create((set, get) => ({
  inner: {
    ...initialState,
  },

  fetchSource: async () => {
    if (get().inner.isFetching) {
      return;
    }

    set((state) => ({
      inner: initiateFetch(state.inner),
    }));

    try {
      const response = await axios.get(sourceURL);
      set((state) => ({
        inner: completeFetch(state.inner, response.data),
      }));
    } catch (err) {
      console.log("Could not fetch sources. Try again later.");
    }
  },
}));

export default useStore;
