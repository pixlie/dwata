import create from "zustand";

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

const [useQueryContext] = create((set) => ({
  ...loadFromLocalStorage(),

  setContext: (appName, context) =>
    saveToLocalStorage(appName, context) &&
    set(() => ({
      [appName]: {
        key: appName,
        ...context,
      },
    })),

  toggleQueryUI: (appName) =>
    set((state) => ({
      [appName]: {
        ...state[appName],
        isQueryUIOpen: !state[appName].isQueryUIOpen,
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

export default useQueryContext;
