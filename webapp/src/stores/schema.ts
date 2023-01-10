import create from "zustand";

import { transformData } from "utils";
import { schemaURL } from "services/urls";
import apiClient from "utils/apiClient";
import { ISchema } from "utils/types";

interface IDBSchema {
  columns: string[];
  rows: ISchema[];
  isFetching: boolean;
  isReady: boolean;
}

interface ISchemaStore {
  schemas: {
    [sourceLabel: string]: IDBSchema;
  };

  fetchSchema: (sourceLabel: string) => void;
}

const initialState = {
  schemas: {},
};

interface ISchemaAPIPayload {
  columns: string[];
  rows: string[];
}

function completeFetch(payload: ISchemaAPIPayload): IDBSchema {
  return {
    columns: payload.columns,
    rows: payload.rows.map((row) => transformData(payload.columns, row)),
    isFetching: false,
    isReady: true,
  };
}

const useSchema = create<ISchemaStore>((set, get) => ({
  ...initialState,

  fetchSchema: async (sourceLabel) => {
    if (!sourceLabel) {
      return;
    }
    if (get().schemas[sourceLabel] && get().schemas[sourceLabel].isFetching) {
      return;
    }
    set((state) => ({
      ...state,
      isFetching: true,
    }));

    try {
      const response = await apiClient.get(`${schemaURL}/${sourceLabel}`);
      set((store) => ({
        ...store,
        schemas: {
          ...store.schemas,
          [sourceLabel]: completeFetch(response.data),
        },
      }));
    } catch (err) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));

export default useSchema;
