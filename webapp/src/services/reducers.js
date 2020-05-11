import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";


import global from "./global/reducer";
import source from "./source/reducer";
import schema from "./schema/reducer";
import browser from "./browser/reducer";
import queryEditor from "./queryEditor/reducer";
import apiBrowser from "./apiBrowser/reducer";


export default (history) => combineReducers({
  router: connectRouter(history),
  global,
  source,
  schema,
  browser,
  queryEditor,
  apiBrowser,
});