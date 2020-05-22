import { TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_HEAD_SPECIFICATION } from './actionTypes';


const initialState = {
  isSidebarOn: false,
  isQueryEditorOpen: false,
  activeColumnHeadSpecification: null,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOn: !state.isSidebarOn,
      }

    case TOGGLE_FILTER_EDITOR:
      return {
        ...state,
        isQueryEditorOpen: !state.isQueryEditorOpen,
      }

    case TOGGLE_COLUMN_HEAD_SPECIFICATION:
      if (state.activeColumnHeadSpecification === action.columnName) {
        return {
          ...state,
          activeColumnHeadSpecification: null,
        };
      }
      return {
        ...state,
        activeColumnHeadSpecification: action.columnName,
      };

    default:
      return state;
  }
}