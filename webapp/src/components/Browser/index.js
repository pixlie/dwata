import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { fetchSchema } from "services/schema/actions";
import { toggleOrderBy } from "services/queryEditor/actions";
import { Section } from "components/BulmaHelpers";
import QueryEditor from "./QueryEditor";
import rowRenderer from "./rowRenderer";
import headRenderer from "./headRenderer";


const HeadItem = ({ toggleOrderBy, head }) => {
  const handleClick = event => {
    event.preventDefault();
    toggleOrderBy(head);
  }

  return (
    <th onClick={handleClick}>{head}</th>
  );
}


class Browser extends PureComponent {
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
    const { orderBy, schema, match } = this.props;
    const { sourceId, tableName } = match.params;
    const columnsSelected = schema.isReady ? schema.columns.reduce((acc, ele) => ({
      ...acc,
      [ele.name]: true
    }), {}) : {};
    const querySpecification = {
      columns: Object.keys(columnsSelected).
        map(col => columnsSelected[col] === true ? col : undefined).
        filter(col => col !== undefined),
      orderBy,
      // filterBy,
      // limit,
    };

    this.props.fetchSchema(sourceId);
    this.props.fetchData(sourceId, tableName, querySpecification);
  }

  componentDidUpdate(prevProps) {
    const { sourceId, tableName, tableData, schema, toggleOrderBy } = this.props;

  }

  toggleOptions = () => {
    this.setState(state => ({
      ...state,
      optionsOpen: !state.optionsOpen
    }));
  }

	render() {
    const { sourceId, tableName, tableData, schema, toggleOrderBy } = this.props;
    const { optionsOpen } = this.state;
    const { toggleOptions, fetchData } = this;

    if (!tableData.isReady || !schema.isReady || tableData.columns.length !== schema.columns.length) {
      return (
        <div>Loading...</div>
      );
    }

    const rowRendererList = rowRenderer(schema, tableData.columns);
    const headRendererList = headRenderer(schema, tableData.columns);

    return (
      <Section>
        { optionsOpen ? <QueryEditor onchange={fetchData} /> : null }

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
                  return Cell !== null ? <Cell key={`td-${i}-${j}`} data={cell} /> : null;
                }) }
              </tr>
            )) : null }
          </tbody>
        </table>
      </Section>
    );
	}
}


const currentOrCache = (container, id) => {
  if (container.id === id && container.isReady) {
    // We seem to have current data and it is ready
    return {
      ...container,
      _cachedData: undefined, // Cache data not to be sent out
    };
  }
  if (container._cachedData && container._cachedData[id]) {
    // Do we have needed data in cache? If so, return that
    return container._cachedData[id];
  }
  // console.log(container);
  return {
    isReady: false,
  }
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _id = `${sourceId}/${tableName}`;
  const schema = currentOrCache(state.schema, sourceId);

  return {
    sourceId,
    tableName,
    schema: schema.isReady ? {
      ...schema.rows.find(x => x.table_name === tableName),
      isReady: true,
    } : schema,
    tableData: currentOrCache(state.browser, _id),
    orderBy: state.queryEditor.orderBy,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleOrderBy,
    fetchData,
    fetchSchema,
  }
)(Browser));