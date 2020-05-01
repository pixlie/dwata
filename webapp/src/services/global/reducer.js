import { TOGGLE_SIDEBAR, TOGGLE_QUERY_EDITOR } from './actionTypes';


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

    case TOGGLE_QUERY_EDITOR:
      return {
        ...state,
        isQueryEditorOpen: !state.isQueryEditorOpen,
      }

    default:
      return state;
  }
}