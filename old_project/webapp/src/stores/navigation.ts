import create from "zustand";

interface IStore {
  isSideNavigationVisible: boolean;
}

const useNavigation = create<IStore>((set) => ({
  isSideNavigationVisible: false,
}));

export default useNavigation;