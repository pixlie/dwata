import { TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR } from './actionTypes';


const initialState = {
  isSidebarOn: false,
  isQueryEditorOpen: false,
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

    default:
      return state;
  }
}