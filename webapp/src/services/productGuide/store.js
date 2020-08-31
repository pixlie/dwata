import create from "zustand";

const useProductGuide = create((set) => ({
  source: {},
  gridHead: {},
  relatedButton: {},
  notesButton: {},
  tableHead: {},
  tableRow: {},
  expandButton: {},
  pagination: {},

  setPGPosition: (what, position) => {
    if (
      [
        "source",
        "gridHead",
        "relatedButton",
        "notesButton",
        "tableHead",
        "tableRow",
        "expandButton",
        "pagination",
      ].includes(what)
    ) {
      set({
        [what]: {
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        },
      });
    }
  },
}));

export default useProductGuide;
