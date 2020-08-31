import create from "zustand";

const initialState = {
  isSidebarVisible: false, // Is Sidebar modal On
  isNotesVisible: false,
  navigationButtonMeta: {},
  showProductGuideFor: null,
};

const useStore = create((set) => ({
  ...initialState,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarVisible: !state.isSidebarVisible,
    })),

  showNotes: () =>
    set((state) => ({
      isNotesVisible: !state.isNotesVisible,
    })),

  setNavigationButtonMeta: (name, meta) =>
    set((state) => ({
      navigationButtonMeta: {
        ...state.navigationButtonMeta,
        [name]: meta,
      },
    })),

  setActiveProductGuideFor: (guideFor) =>
    set({
      showProductGuideFor: guideFor,
    }),
}));

export default useStore;
