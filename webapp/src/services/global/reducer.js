import { TOGGLE_SIDEBAR } from './actionTypes';


const initialState = {
  isSidebarOn: false,
  currentTableID: null,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOn: !state.isSidebarOn,
      }

    default:
      return state;
  }
}