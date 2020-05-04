import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchAPIData } from "services/apiBrowser/actions";
import { toggleOrderBy } from "services/queryEditor/actions";
import rowRenderer from "./rowRenderer";
import headRenderer from "./headRenderer";


class APIBrowser extends PureComponent {
  state = {
    fetching: true,
    queriedColumns: [],
    tableColumns: [],
    tableData: [],
    count: 0,
    query: undefined,
    optionsOpen: false,
  }

	componentDidMount() {
    const {match: {params: {sourceId, resourceName}}} = this.props;
    this.props.fetchAPIData(sourceId, resourceName);
  }

  componentDidUpdate(prevProps) {
    const {match: {params: {sourceId, resourceName}}} = this.props;
    const {match: {params: {sourceId: prevSourceId, resourceName: prevTableName}}} = prevProps;
    if (sourceId && resourceName && prevSourceId && prevTableName &&
      (sourceId != prevSourceId || resourceName != prevTableName)) {
        // Call the fetch actions when URL has changed but this Component was already loaded
        this.props.fetchAPIData(sourceId, resourceName);
    }
  }

	render() {
    const { tableData } = this.props;
    if (!tableData.isReady) {
      return (
        <div>Loading...</div>
      );
    }

    const rowRendererList = rowRenderer(tableData.columns);
    const headRendererList = headRenderer(tableData.columns);

    return (
      <div className="table-container">
        <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
          <thead>
            <tr>
              { tableData.columns.map((cell, j) => {
                const Cell = headRendererList[j];
                return Cell !== null ? <Cell key={`th-${j}`} data={cell} /> : null;
              }) }
              {/* { tableData.columns.map(head => <HeadItem toggleOrderBy={toggleOrderBy} key={`th-${head}`} head={head} />) } */}
            </tr>
          </thead>

          <tbody>
            { tableData.isReady ? tableData.rows.map((row, i) => (
              <tr key={`tr-${i}`}>
                { row.map((cell, j) => {
                  const Cell = rowRendererList[j];
                  return Cell !== null ? <Cell key={`td-${i}-${j}`} data={typeof cell === "object" ? "{}" : cell} /> : null;
                }) }
              </tr>
            )) : null }
          </tbody>
        </table>
      </div>
    );
	}
}


const mapStateToProps = (state, props) => {
  let { sourceId, resourceName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${resourceName}`;

  return {
    sourceId,
    resourceName,
    tableData: state.apiBrowser.isReady && state.apiBrowser._cacheKey === _browserCacheKey ? state.apiBrowser : {
      isReady: false,
    },
    orderBy: state.queryEditor.orderBy,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleOrderBy,
    fetchAPIData,
  }
)(APIBrowser));