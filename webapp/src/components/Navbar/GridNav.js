import React, { useEffect, useContext, Fragment, useRef } from "react";

import { QueryContext } from "utils";
import { useGlobal, useApps, useData } from "services/store";
import { Button, ButtonGroup } from "components/LayoutHelpers";

export default ({
  cacheKey,
  hasColumnsSpecified,
  hasFiltersSpecified,
  hasOrderingSpecified,
  showNotes,
  toggleActions,
  togglePinnedRecords,
}) => {
  const queryContext = useContext(QueryContext);
  const showPinnedRecords = useGlobal((state) => state.showPinnedRecords);
  const toggleFilterEditor = useGlobal((state) => state.toggleFilterEditor);
  const toggleColumnSelector = useGlobal((state) => state.toggleColumnSelector);
  const toggleOrderEditor = useGlobal((state) => state.toggleOrderEditor);
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

  const handleNotesClick = (event) => {
    showNotes(cacheKey);
  };
  const handleActionsClick = (event) => {
    toggleActions();
  };
  const handlePinClick = (event) => {
    togglePinnedRecords();
  };
  const queryButtons = [
    {
      active: hasColumnsSpecified === true,
      attributes: { onClick: toggleColumnSelector, ref: buttonRefs.columns },
      inner: (
        <Fragment>
          <i className="fas fa-columns" />
          &nbsp;Columns
        </Fragment>
      ),
    },
    {
      active: hasFiltersSpecified === true,
      attributes: { onClick: toggleFilterEditor },
      inner: (
        <Fragment>
          <i className="fas fa-filter" />
          &nbsp;Filters
        </Fragment>
      ),
    },
    {
      active: hasOrderingSpecified === true,
      attributes: { onClick: toggleOrderEditor },
      inner: (
        <Fragment>
          <i className="fas fa-sort" />
          &nbsp;Ordering
        </Fragment>
      ),
    },
  ];

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

      <ButtonGroup theme="secondary" buttons={queryButtons} />
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
