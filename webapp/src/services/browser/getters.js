import { getCacheKey } from "utils";
import { getSavedQuery } from "services/apps/getters";

export const getQueryDetails = (state, props) => {
  // Our Grid can be called either for a particular data source/table or from a saved query
  // First we see if sourceId, tableName, savedQueryId are directly in URL
  let { sourceId, tableName, pk, savedQueryId } = props.match.params;
  let cacheKey = null,
    savedQuery = {};

  if (!!savedQueryId) {
    // The Grid was called on a saved query, we need to find the real data source and query spec
    if (!!state.apps.isReady) {
      savedQuery = getSavedQuery(state, savedQueryId);
      if (!!savedQuery && "source_id" in savedQuery) {
        cacheKey = getCacheKey(null, savedQuery);
        sourceId = parseInt(savedQuery.source_id);
        tableName = savedQuery.table_name;
      }
    }
  } else {
    cacheKey = getCacheKey(state);
    sourceId = parseInt(sourceId);
  }
  return {
    cacheKey,
    sourceId,
    tableName,
    pk,
    savedQueryId,
    savedQuery,
  };
};
