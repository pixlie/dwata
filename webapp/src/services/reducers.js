import { combineReducers } from "redux";


import global from "./global/reducer";
import source from "./source/reducer";
import schema from "./schema/reducer";
import browser from "./browser/reducer";
import queryEditor from "./queryEditor/reducer";


export default combineReducers({
  global,
  source,
  schema,
  browser,
  queryEditor,
});