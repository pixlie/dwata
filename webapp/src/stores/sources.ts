import create from "zustand";

import { transformData } from "utils";
import { sourceURL } from "services/urls";
import apiClient from "utils/apiClient";

interface ISourcesStore {
  columns: string[];
  rows: string[];
  isFetching: boolean;
  isReady: boolean;
}

const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};

const completeFetch = (payload: ISourcesStore) => ({
  columns: payload.columns,
  rows: payload.rows.map((row) => transformData(payload.columns, row)),
  isFetching: false,
  isReady: true,
});

const useSources = create<ISourcesStore>((set, get) => ({
  ...initialState,

  fetchSource: async () => {
    if (get().isFetching) {
      return;
    }

    set((state) => ({
      ...state,
      isFetching: true,
    }));

    try {
      const response = await apiClient.get(sourceURL);
      set(() => ({
        ...completeFetch(response.data),
      }));
    } catch (err) {
      console.log("Could not fetch sources. Try again later.");
    }
  },
}));

export default useSources;
