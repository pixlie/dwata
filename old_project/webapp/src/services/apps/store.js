import create from "zustand";
import axios from "axios";

import { transformData } from "utils";
import { appURL } from "services/urls";

const initialState = {
  isNoteAppEnabled: false, // Is the notes app enabled - as in it's backend is setup
  noteAppConfig: {},

  isRecordPinAppEnabled: false,
  recordPinAppConfig: {},

  isSavedQueryAppEnabled: false,
  savedQueryAppConfig: {},

  isReady: false,
};

const completeFetch = (payload) => {
  let apps = {};
  for (const app of payload.rows.map((row) =>
    transformData(payload.columns, row)
  )) {
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
    } else if (app.label === "saved_query") {
      apps = {
        ...apps,
        isSavedQueryAppEnabled: true,
        savedQueryAppConfig: app.config,
      };
    }
  }
  return {
    ...apps,
    isReady: true,
  };
};

export default create((set) => ({
  ...initialState,

  fetchApps: async () => {
    try {
      const response = await axios.get(appURL);
      set(() => completeFetch(response.data));
    } catch (error) {
      console.log("Could not fetch schema. Try again later.");
    }
  },
}));
