import axios from "axios";

import { dataItemURL, workerExecuteURL } from "services/urls";

export const saveNote = async (querySpecification, payload, pk) => {
  const baseURL = `${dataItemURL}/dwata_meta/dwata_meta_note`;
  const url = !!pk ? `${baseURL}/${pk}` : baseURL;

  await axios({
    method: !!pk ? "put" : "post",
    url,
    data: {
      query_specification: querySpecification,
      content: payload,
    },
  });
};

export const saveDataSource = async (payload, pk) => {
  const baseURL = `${dataItemURL}/dwata_meta/dwata_meta_data_sources`;
  const url = !!pk ? `${baseURL}/${pk}` : baseURL;

  await axios({
    method: !!pk ? "put" : "post",
    url,
    data: payload,
  });
};

export const refreshTables = async (payload) => {
  const url = `${workerExecuteURL}/tables/refresh`;

  await axios({
    method: "post",
    url,
    data: payload,
  });
};

/*
export const pinRecords = (path, selectedRowList) => {
  const { sourceId, tableName } = getRecordPinAppConfig(state);

  for (const rowId of selectedRowList) {
    axios.post(`${dataItemURL}/${sourceId}/${tableName}`, {
      path,
      record_id: rowId,
    });
  }
};

export const fetchPins = () => (dispatch, getState) => {
  const state = getState();
  const { sourceId, tableName, cacheKey } = getRecordPinAppConfig(state);

  dispatch(
    fetchDataToCache(sourceId, tableName, cacheKey, {
      columnsSelected: ["id", "path", "record_id"],
    })
  );
};

const getQuerySpecificationPayload = (querySpecification) => ({
  columns:
    !!querySpecification.columnsSelected &&
    querySpecification.columnsSelected.length > 0
      ? querySpecification.columnsSelected
      : undefined,
  source_label: querySpecification.sourceLabel,
  table_name: querySpecification.tableName,
  order_by: querySpecification.orderBy,
  filter_by: querySpecification.filterBy,
  offset: querySpecification.offset,
  limit: querySpecification.limit,
});

export const saveQuery = async (label, querySpecification, pk) => {
  const url = !!pk
    ? `${dataItemURL}/dwata_meta/dwata_meta_saved_query/${pk}`
    : `${dataItemURL}/dwata_meta/dwata_meta_saved_query`;

  try {
    if (!!pk) {
      await axios.put(url, {
        label,
        query_specification: getQuerySpecificationPayload(querySpecification),
      });
    } else {
      await axios.post(url, {
        label,
        query_specification: getQuerySpecificationPayload(querySpecification),
      });
    }
  } catch (error) {
    return false;
  }
};

export const fetchSavedQuery = (savedQueryId) => (dispatch, getState) => {
  const state = getState();
  const { sourceId, tableName, cacheKey } = getSavedQueryAppConfig(state);

  if (!savedQueryId) {
    dispatch(
      fetchDataToCache(sourceId, tableName, cacheKey, {
        columnsSelected: [
          "id",
          "label",
          "source_id",
          "table_name",
          "query_specification",
        ],
      })
    );
  } else {
    dispatch(fetchDataItem(`/browse/${sourceId}/${tableName}/${savedQueryId}`));
  }
};
*/
