import create from "zustand";

import { transformData } from "utils";
import { sourceURL } from "services/urls";
import apiClient from "utils/apiClient";
import { ISource } from "utils/types";

interface ISourcesStore {
  columns: string[];
  rows: ISource[];
  isFetching: boolean;
  isReady: boolean;

  fetchSource: () => void;
}

const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};

interface ISourcesAPIPayload {
  columns: string[];
  rows: string[];
}

const completeFetch = (payload: ISourcesAPIPayload) => ({
  columns: payload.columns,
  rows: payload.rows.map((row) => transformData(payload.columns, row)),
  isFetching: false,
  isReady: true,
});

const useSource = create<ISourcesStore>((set, get) => ({
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

export default useSource;
