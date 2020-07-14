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

const initiateFetch = () => ({
  ...initialState,
  isFetching: true,
});

const completeFetch = (sourceLabel, payload) => {
  return {
    [sourceLabel]: {
      columns: payload.columns,
      rows: payload.rows.map((row) => transformData(payload.columns, row)),
      isFetching: false,
      isReady: true,
    },
  };
};

const [useStore] = create((set, get) => ({
  fetchSchema: async (sourceLabel) => {
    if (!sourceLabel) {
      return;
    }
    if (get()[sourceLabel] && get()[sourceLabel].isFetching) {
      return;
    }

    !get()[sourceLabel] &&
      set(() => ({
        [sourceLabel]: initiateFetch(),
      }));

    try {
      const response = await axios.get(`${schemaURL}/${sourceLabel}`);
      set((state) => ({
        ...completeFetch(sourceLabel, response.data),
      }));
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useStore;
