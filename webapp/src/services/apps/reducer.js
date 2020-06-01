import { transformData } from "utils";
import { COMPLETE_FETCH_APP } from "./actionTypes";


const initialState = {
  isNoteAppEnabled: false,  // Is the notes app enabled - as in it's backend is setup
  noteAppConfig: {},
};



export default (state = initialState, action) => {
  switch (action.type) {
    case COMPLETE_FETCH_APP:
      for (const app of action.payload.rows.map(row => transformData(action.payload.columns, row))) {
        if (app.label === "note") {
          return {
            ...state,
            isNoteAppEnabled: true,
            noteAppConfig: app.config,
          };
        }
        // Todo: refactor the return to be outside the for loop
        return {
          ...state,
        };
      }
      break;

    default:
      return state;
  }
}