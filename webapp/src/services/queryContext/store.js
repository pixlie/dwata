import create from "zustand";

import * as globalConstants from "services/global/constants";

const [useQueryContext] = create((set) => ({
  inner: {
    main: {
      appType: globalConstants.APP_NAME_HOME,
    },
  },

  setContext: (appName, context) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [appName]: {
          ...context,
          key: appName,
        },
      },
    })),

  mergeContext: (appName, context) =>
    set((state) => ({
      inner: {
        ...state.inner,
        [appName]: {
          ...state.inner[appName],
          ...context,
        },
      },
    })),
}));

export default useQueryContext;
