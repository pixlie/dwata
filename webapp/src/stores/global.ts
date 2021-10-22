import create from "zustand";

interface IStore {}

const useGlobal = create<IStore>((set) => ({}));

export default useGlobal;
