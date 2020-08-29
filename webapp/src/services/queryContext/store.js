import create from "zustand";
import _ from "lodash";

import * as globalConstants from "services/global/constants";

const loadFromLocalStorage = () => {
  const temp = window.localStorage.getItem("queryContext");
  if (!!temp) {
    return JSON.parse(temp);
  }
  return {
    main: {
      appType: globalConstants.APP_NAME_HOME,
    },
  };
};

const saveToLocalStorage = (appName, context) => {
  if (appName === "main") {
    window.localStorage.setItem(
      "queryContext",
      JSON.stringify({
        [appName]: {
          key: appName,
          ...context,
        },
      })
    );
  }
  return true;
};

const useStore = create((set) => ({
  ...loadFromLocalStorage(),

  setContext: (appName, context) =>
    saveToLocalStorage(appName, context) &&
    set(() => ({
      [appName]: {
        key: appName,
        ...context,
      },
    })),

  toggleDetailItem: (item) =>
    set((state) => {
      if ("detailItemList" in state.main) {
        const _index = state.main.detailItemList.findIndex((x) =>
          _.isEqual(x, item)
        );

        return {
          main: {
            ...state.main,
            detailItemList:
              _index === -1
                ? [...state.main.detailItemList, item]
                : [
                    ...state.main.detailItemList.slice(0, _index),
                    ...state.main.detailItemList.slice(_index + 1),
                  ],
          },
        };
      } else {
        return {
          main: {
            ...state.main,
            detailItemList: [item],
          },
        };
      }
    }),

  toggleColumnSelector: (appName) =>
    set((state) => ({
      [appName]: {
        ...state[appName],
        isColumnSelectorOpen: !state[appName].isColumnSelectorOpen,
      },
    })),

  toggleFilterEditor: (appName) =>
    set((state) => ({
      [appName]: {
        ...state[appName],
        isFilterEditorOpen: !state[appName].isFilterEditorOpen,
      },
    })),

  toggleMergeUI: (appName) =>
    set((state) => ({
      [appName]: {
        ...state[appName],
        isMergeUIOpen: !state[appName].isMergeUIOpen,
      },
    })),
}));

export default useStore;
