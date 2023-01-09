import create from "zustand";

import { transformData } from "utils";
import { schemaURL } from "services/urls";
import apiClient from "utils/apiClient";
import { ISchema } from "utils/types";

interface ISchemaStore {
  columns: string[];
  rows: ISchema[];
  isFetching: boolean;
  isReady: boolean;

  fetchSchema: (sourceLabel: string) => void;
}

const initialState = {
  columns: [],
  rows: [],
  isFetching: false,
  isReady: false,
};

interface ISchemaAPIPayload {
  columns: string[];
  rows: string[];
}

const completeFetch = (payload: ISchemaAPIPayload) => ({
  columns: payload.columns,
  rows: payload.rows.map((row) => transformData(payload.columns, row)),
  isFetching: false,
  isReady: true,
});

const useSchema = create<ISchemaStore>((set, get) => ({
  ...initialState,

  fetchSchema: async (sourceLabel) => {
    if (!sourceLabel) {
      return;
    }
    if (get().isFetching) {
      return;
    }
    set((state) => ({
      ...state,
      isFetching: true,
    }));

    try {
      const response = await apiClient.get(`${schemaURL}/${sourceLabel}`);
      set(() => ({
        ...completeFetch(response.data),
      }));
    } catch (err) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useSchema;
