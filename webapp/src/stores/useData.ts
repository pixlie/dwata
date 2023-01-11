import create from "zustand";
import axios from "axios";

import { dataURL, dataItemURL } from "services/urls";
import useQuerySpecification, {
  querySpecificationObject,
  getQuerySpecificationPayload,
} from "stores/querySpecification";
import useSelected from "services/selected/store";
import { IQuerySpecification } from "utils/types";

interface IListData {
  columns: string[];
  rows: string[];
  querySQL?: string;
  embedded?: any;

  isFetching: boolean;
  isReady: boolean;
  lastError?: string;
  lastFetchedAt?: number;
}

interface IItemData {
  item: any;
  querySQL: string;

  isFetching: boolean;
  isReady: boolean;
  lastFetchedAt?: number;
}

interface IDataStore {
  data: { [key: string]: IListData | IItemData };

  fetchData: (key: string, querySpecification: IQuerySpecification) => void;
}

function completeFetchList(inner, payload): IListData {
  return {
    columns: payload.columns,
    rows: payload.rows, // Here we do not transform data into maps/dicts
    querySQL: payload.query_sql,
    embedded: payload.embedded,

    isFetching: false,
    isReady: true,
    // lastError: null,
    lastFetchedAt: +new Date(),
  };
}

function completeFetchItem(payload): IItemData {
  return {
    item: payload.item,
    querySQL: payload.query_sql,

    isFetching: false,
    isReady: true,
    lastFetchedAt: +new Date(),
  };
}

const useData = create<IDataStore>((set, get) => ({
  data: {},

  fetchData: async (key, querySpecification) => {
    if (!key) {
      return;
    }

    if (get().data[key]) {
      if (get().data[key].isFetching) {
        // There is a fetch currently executing, no need to run another one
        return;
      }
      set((state) => ({
        ...state,
        data: {
          ...state.data,
          [key]: {
            ...state.data[key],
            isFetching: true,
          },
        },
      }));
    } else {
      set((state) => ({
        ...state,
        data: {
          ...state.data,
          [key]: {
            columns: [],
            rows: [],
            isReady: false,
            isFetching: true,
          },
        },
      }));
    }

    let response: any = null;
    try {
      if ("pk" in querySpecification) {
        response = await axios.get(
          `${dataItemURL}/${querySpecification.sourceLabel}/${querySpecification.tableName}/${querySpecification.pk}`
        );
        set((state) => ({
          ...state,
          data: {
            ...state.data,
            [key]: completeFetchItem(response.data),
          },
        }));
      } else {
        response = await axios.post(
          dataURL,
          getQuerySpecificationPayload(querySpecification)
        );
        // We use the Query Specification Store API directly to set this new data
        useQuerySpecification.setState((state) => ({
          ...state,
          specifications: {
            ...state.specifications,
            [key]: querySpecificationObject(
              state.specifications[key],
              response.data
            ),
          },
        }));
        // useSelected.setState(() => ({
        //   [key]: {
        //     selectedList: [],
        //   },
        // }));
        set((state) => ({
          ...state,
          data: {
            ...state.data,
            [key]: completeFetchList(state.data[key], response.data),
          },
        }));
      }
    } catch (error) {
      console.log("Could not fetch data. Try again later.");
    }
  },
}));

export default useData;
