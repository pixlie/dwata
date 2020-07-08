import create from "zustand";

import { LOAD_DATA_FROM_CACHE, TOGGLE_ROW_SELECTION } from "./actionTypes";

const initialState = {
  columns: [],
  rows: [],
  querySQL: null,
  selectedRowList: [],

  isFetching: false,
  isReady: false,
  cacheKey: null,
};

const stateManager = (state = initialState, action) => {
  const { cacheKey } = action;
  if (!cacheKey) {
    return {
      ...state,
    };
  }

  switch (action.type) {
    case LOAD_DATA_FROM_CACHE: {
      return {
        ...initialState,
        ...action.payload,
        isFetching: false,
        isReady: true,
        cacheKey,
      };
    }

    case TOGGLE_ROW_SELECTION:
      if (state.selectedRowList.includes(action.rowId)) {
        const temp = state.selectedRowList.indexOf(action.rowId);
        return {
          ...state,
          selectedRowList: [
            ...state.selectedRowList.slice(0, temp),
            ...state.selectedRowList.slice(temp + 1),
          ],
        };
      } else {
        return {
          ...state,
          selectedRowList: [...state.selectedRowList, action.rowId],
        };
      }

    default:
      return {
        ...state,
      };
  }
};

const loadFromCache = (cacheKey, payload) => ({
  ...initialState,
  ...payload,
  isFetching: false,
  isReady: true,
  cacheKey,
});

const [useStore] = create((set) => ({
  state: {
    ...initialState,
  },

  loadFromCache: (cacheKey, payload) =>
    set(() => ({
      state: loadFromCache(cacheKey, payload),
    })),
}));

export default useStore;
