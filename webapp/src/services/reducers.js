import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import global from "./global/reducer";
import source from "./source/reducer";
import schema from "./schema/reducer";
import listCache from "./listCache/reducer";
import browser from "./browser/reducer";
import dataItem from "./dataItem/reducer";
import querySpecification from "./querySpecification/reducer";
import querySpecificationCache from "./querySpecificationCache/reducer";
import apiBrowser from "./apiBrowser/reducer";
import apps from "./apps/reducer";

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    global,
    source,
    schema,
    listCache,
    browser,
    dataItem,
    querySpecification,
    querySpecificationCache,
    apiBrowser,
    apps,
  });
