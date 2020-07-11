import create from "zustand";

const [useQueryContext] = create((set) => ({
  inner: {},

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
