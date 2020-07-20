import React, { useEffect, useContext, Fragment, useRef } from "react";

import { QueryContext } from "utils";
import { useGlobal, useApps, useData, useQueryContext } from "services/store";
import { Button, ButtonGroup } from "components/LayoutHelpers";

export default ({
  cacheKey,
  showNotes,
  toggleActions,
  togglePinnedRecords,
}) => {
  const queryContext = useContext(QueryContext);
  const showPinnedRecords = useGlobal((state) => state.showPinnedRecords);
  const toggleQueryUI = useQueryContext((state) => state.toggleQueryUI);
  const data = useData((state) => state[queryContext.key]);
  const fetchApps = useApps((state) => state.fetchApps);
  const isNoteAppEnabled = useApps((state) => state.isNoteAppEnabled);
  const isRecordPinAppEnabled = useApps((state) => state.isRecordPinAppEnabled);
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);
  const buttonRefs = {
    columns: useRef(null),
    filters: useRef(null),
    ordering: useRef(null),
  };

  if (!(data && data.isReady)) {
    return null;
  }
  const { selectedRowList } = data;

  const handleNotesClick = () => {
    showNotes(cacheKey);
  };
  const handleActionsClick = () => {
    toggleActions();
  };
  const handlePinClick = () => {
    togglePinnedRecords();
  };
  const handleQueryClick = () => {
    toggleQueryUI(queryContext.key);
  };

  return (
    <Fragment>
      <Button
        theme="secondary"
        active={selectedRowList.length > 0}
        disabled={selectedRowList.length === 0}
        attributes={{ onClick: handleActionsClick }}
      >
        <span className="icon">
          <i className="far fa-check-square" />
        </span>
        &nbsp; Actions
      </Button>

      {isNoteAppEnabled ? (
        <Button attributes={{ onClick: handleNotesClick }} theme="info">
          <i className="far fa-sticky-note" />
          &nbsp; Notes
        </Button>
      ) : null}
      {isRecordPinAppEnabled ? (
        <Button
          attributes={{ onClick: handlePinClick }}
          active={showPinnedRecords === true}
          theme="secondary"
        >
          <i className="fas fa-thumbtack" />
          &nbsp; Pins
        </Button>
      ) : null}

      <Button theme="primary" attributes={{ onClick: handleQueryClick }}>
        Query
      </Button>
    </Fragment>
  );
};

/*
const mapStateToProps = (state, props) => {
  const match = getSourceFromPath(props.location.pathname);
  const { sourceId, tableName } =
    match != null ? match.params : { sourceId: null, tableName: null };
  let isInTable = false;
  let hasColumnsSpecified = false;
  let hasFiltersSpecified = false;
  let hasOrderingSpecified = false;
  const cacheKey = getCacheKey(state);

  if (sourceId && tableName) {
    isInTable = true;
    if (
      state.schema.isReady &&
      state.schema.sourceId === parseInt(sourceId) &&
      state.browser.isReady &&
      state.browser.cacheKey === cacheKey &&
      state.querySpecification.isReady &&
      state.querySpecification.cacheKey === cacheKey
    ) {
      hasColumnsSpecified =
        state.querySpecification.columnsSelected.length !==
        state.schema.rows.find((x) => x.table_name === tableName).columns
          .length;
      hasFiltersSpecified =
        Object.keys(state.querySpecification.filterBy).length > 0;
      hasOrderingSpecified =
        Object.keys(state.querySpecification.orderBy).length > 0;
    }
  }
  const { isNoteAppEnabled, isRecordPinAppEnabled } = state.apps;

  return {
    isSourceFetching: state.source.isFetching,
    sourceId,
    tableName,
    isFilterEnabled: sourceId && tableName,
    isInTable,
    hasColumnsSpecified,
    hasFiltersSpecified,
    hasOrderingSpecified,
    selectedRowList: state.browser.selectedRowList,
    cacheKey,
    isNoteAppEnabled,
    isRecordPinAppEnabled,
    showPinnedRecords: state.global.showPinnedRecords,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    toggleSidebar,
    toggleFilterEditor,
    toggleColumnSelector,
    toggleOrderEditor,
    showNotes,
    getApps,
    toggleActions,
    togglePinnedRecords,
  })(Navbar)
);
*/
