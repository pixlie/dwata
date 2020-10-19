import create from "zustand";
import _ from "lodash";

/*
const initialState = {
  selectedList: [],
};
*/

export default create((set) => ({
  toggleSelection: (key, item) =>
    set((state) => {
      const _index = state[key].selectedList.findIndex((x) =>
        _.isEqual(x, item)
      );

      if (_index === -1) {
        // This item does not exist, we just insert it
        return {
          [key]: {
            selectedList: [...state[key].selectedList, item],
          },
        };
      } else {
        return {
          [key]: {
            selectedList: [
              ...state[key].selectedList.slice(0, _index),
              ...state[key].selectedList.slice(_index + 1),
            ],
          },
        };
      }
    }),
}));
