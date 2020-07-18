import axios from "axios";

import { appURL, dataItemURL } from "services/urls";
import {
  INITIATE_FETCH_ITEM,
  COMPLETE_FETCH_ITEM,
} from "services/dataItem/actionTypes";
import { fetchDataToCache } from "services/listCache/actions";
import { COMPLETE_FETCH_APP } from "./actionTypes";
import { getRecordPinAppConfig, getSavedQueryAppConfig } from "./getters";
import { fetchDataItem } from "services/dataItem/actions";

export const getApps = () => (dispatch) => {
  return axios
    .get(appURL)
    .then((res) => {
      dispatch({
        type: COMPLETE_FETCH_APP,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("Could not fetch apps. Try again later.");
      console.log(err);
    });
};

/*
export const fetchNote = (path, noteAppConfig) => {
  const { source_id: sourceId, table_name: tableName } = noteAppConfig;

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk: path,
  });

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}?path=${path}`)
    .then((res) => {
      dispatch({
        type: COMPLETE_FETCH_ITEM,
        payload: res.data,
        sourceId,
        tableName,
        pk: path,
      });
    })
    .catch((err) => {
      console.log(
        "Could not fetch notes. Try again later.",
        err.response.status
      );
      if (err.response.status === 404) {
        dispatch({
          type: COMPLETE_FETCH_ITEM,
          payload: null,
          sourceId,
          tableName,
          pk: path,
          errorStatus: err.response.status,
        });
      }
    });
};

export const saveNote = (payload, pk, callback, noteAppConfig) => {
  const { source_id: sourceId, table_name: tableName } = noteAppConfig;
  const url =
    pk !== null
      ? `${dataItemURL}/${sourceId}/${tableName}/${pk}`
      : `${dataItemURL}/${sourceId}/${tableName}`;

  return axios({
    method: pk !== null ? "put" : "post",
    url,
    data: {
      path,
      ...payload,
    },
  })
    .then((res) => {
      if (!!callback) {
        callback(res);
      }
    })
    .catch((err) => {
      console.log("Could not fetch notes. Try again later.");
      console.log(err);
    });
};

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
