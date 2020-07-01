import { createCacheKeyFromParts, getSourceFromPath } from "utils";
import { AppException, AppExceptionCodes } from "./exceptions";


export const getRecordPinAppConfig = (state) => {
  const {isRecordPinAppEnabled, recordPinAppConfig} = state.apps;
  if (!isRecordPinAppEnabled) {
    throw new AppException(AppExceptionCodes.notEnabled, "recordPin");
  } else if (!recordPinAppConfig) {
    throw new AppException(AppExceptionCodes.configNotLoaded, "recordPin");
  }
  const {source_id: sourceId, table_name: tableName} = recordPinAppConfig;
  const cacheKey = createCacheKeyFromParts(sourceId, tableName);
  return {
    sourceId,
    tableName,
    cacheKey,
  };
};


export const getPinsFromCache = (state, path = undefined, allPins = false) => {
  const {cacheKey} = getRecordPinAppConfig(state);

  if (Object.keys(state.listCache).includes(cacheKey)) {
    if (allPins) {
      // We are asked to return all pins
      // Todo: The filters work with fixed index for attributes, this will break soon, need better way to manage
      return state.listCache[cacheKey];
    }
    if (path !== undefined) {
      // We have a path request, let's return pins for that
      return state.listCache[cacheKey].filter(x => x[1] === path);
    }
    // Check if we get a path from current URL
    if (state.router && state.router.location && state.router.location.pathname) {
      const fromPath = getSourceFromPath(state.router.location.pathname);
      if (fromPath) {
        const {params: {sourceId, tableName}} = fromPath;
        const temp = btoa(`${sourceId}/${tableName}`);
        // Return pins for current URL
        // Todo: The filters work with fixed index for attributes, this will break soon, need better way to manage
        return state.listCache[cacheKey].rows.filter(x => x[1] === temp).map(x => [x[0], x[1], parseInt(x[2])]);
      }
    }
    // Return all pins
    return state.listCache[cacheKey];
  } else {
    throw new AppException(AppExceptionCodes.dataNotLoaded, "recordPin");
  }
};


export const getSavedQuerySpecificationAppConfig = (state) => {
  const {isSavedQuerySpecificationAppEnabled, savedQuerySpecificationAppConfig} = state.apps;
  if (!isSavedQuerySpecificationAppEnabled) {
    throw new AppException(AppExceptionCodes.notEnabled, "savedQuerySpecification");
  } else if (!savedQuerySpecificationAppConfig) {
    throw new AppException(AppExceptionCodes.configNotLoaded, "savedQuerySpecification");
  }
  const {source_id: sourceId, table_name: tableName} = savedQuerySpecificationAppConfig;
  const cacheKey = createCacheKeyFromParts(sourceId, tableName);
  return {
    sourceId,
    tableName,
    cacheKey,
  };
};


export const getSavedQuerySpecification = (state, savedQueryId, sourceId, tableName) => {
  const {cacheKey} = getSavedQuerySpecificationAppConfig(state);

  if (!!savedQueryId) {
    // We are being asked for a single Saved Query Specification
    if (Object.keys(state.dataItem).includes(`${cacheKey}/${savedQueryId}`)) {
      return state.dataItem[`${cacheKey}/${savedQueryId}`].data;
    }
  } else if (Object.keys(state.listCache).includes(cacheKey)) {
    if (!sourceId) {
      // We have been asked for all Saved Query Specifications
      return state.listCache[cacheKey];
    }
    if (!!sourceId && !!tableName) {
      // We have a sourceId and tableName, let's return Saved Query Specifications for that
      // Todo: The filters work with fixed index for attributes, this will break soon, need better way to manage
      return state.listCache[cacheKey].rows.filter(x => x[2] === sourceId && x[3] === tableName);
    }
    if (!!sourceId) {
      // We have a sourceId, let's return Saved Query Specifications for that
      // Todo: The filters work with fixed index for attributes, this will break soon, need better way to manage
      return state.listCache[cacheKey].rows.filter(x => x[2] === sourceId);
    }
    // Return all Saved Query Specifications
    return state.listCache[cacheKey];
  } else {
    return {};
  }
};