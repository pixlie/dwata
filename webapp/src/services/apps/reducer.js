import { transformData } from "utils";
import { COMPLETE_FETCH_APP } from "./actionTypes";


const initialState = {
  isNoteAppEnabled: false,  // Is the notes app enabled - as in it's backend is setup
  noteAppConfig: {},

  isRecordPinAppEnabled: false,
  recordPinAppConfig: {},
};



export default (state = initialState, action) => {
  switch (action.type) {
    case COMPLETE_FETCH_APP:
      let apps = {};
      for (const app of action.payload.rows.map(row => transformData(action.payload.columns, row))) {
        if (app.label === "note") {
          apps = {
            ...apps,
            isNoteAppEnabled: true,
            noteAppConfig: app.config,
          };
        } else if (app.label === "record_pin") {
          apps = {
            ...apps,
            isRecordPinAppEnabled: true,
            recordPinAppConfig: app.config,
          };
        }
      }
      return {
        ...state,
        ...apps,
      };

    default:
      return state;
  }
}