import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { fetchSchema } from "services/schema/actions";
import { toggleOrderBy } from "services/queryEditor/actions";
import QueryEditor from "./QueryEditor";


const RowRenderer = (schema, queriedColumns) => {
  const row_list = [];
  const date_time_options = {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data }) => <td>{data}</td>;
  const BooleanCell = ({ data }) => <td>{(data === true || data === false) ?
    (data === true ? <i className="far fa-check-square dark-text" /> : <i className="far fa-window-close light-text" />) : <i />}</td>;
  const JSONCell = ({ data }) => <td>{"{}"}</td>;
  const TimeStampCell = (({ data }) => {
    try {
      return <td>{new Intl.DateTimeFormat("en-GB", date_time_options).format(new Date(data * 1000))}</td>;
    } catch (error) {
      if (error instanceof RangeError) {
        return <td>{data}</td>
      }
    }
  });
  console.log(schema);

  for (let i = 0; i < queriedColumns.length; i++) {
    const head = schema.columns.find(x => x.name === queriedColumns[i]);
    if (head.type === "BOOLEAN") {
      row_list.push(BooleanCell);
    } else if (head.type === "JSONB" || head.type === "JSON") {
      row_list.push(JSONCell);
    } else if (head.type === "TIMESTAMP") {
      row_list.push(TimeStampCell);
    } else {
      row_list.push(DefaultCell);
    }
  }

  return row_list;
}


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
    options_open: false,
  }

	componentDidMount() {
    const { orderBy, schema, match } = this.props;
    const { dbId, tableName } = match.params;
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

    this.props.fetchSchema(dbId);
    this.props.fetchData(dbId, tableName, querySpecification);
	}

  toggleOptions = () => {
    this.setState(state => ({
      ...state,
      options_open: !state.options_open
    }));
  }

	render() {
    const { source_id, table_name, tableData, schema, toggleOrderBy } = this.props;
    const { options_open } = this.state;
    const { toggleOptions, fetchData } = this;

    if (!tableData.isReady || !schema.isReady) {
      return (
        <div>Loading...</div>
      );
    }

    const row_renderer_list = RowRenderer(schema, tableData.columns);

    return (
      <Fragment>
        <div className="pure-g main-head">
          <div className="pure-u-1-4">
            <h1>Data browser</h1>
          </div>

          <div className="pure-u-1-4">travlyng / {table_name}</div>

          <div className="pure-u-1-2 right-menu">
            <button className="pure-button pure-button-primary small" onClick={toggleOptions}>Edit query</button>
          </div>
        </div>

        { options_open ? <QueryEditor source_id={source_id} table_name={table_name}
          tableColumns={schema} onchange={fetchData} /> : null }

        <div className="pure-g">
          <div className="pure-u">
            <table className="pure-table pure-table-horizontal data-table">
              <thead>
                <tr>
                  { tableData.columns.map(head => <HeadItem toggleOrderBy={toggleOrderBy} key={`th-${head}`} head={head} />) }
                </tr>
              </thead>

              <tbody>
                { tableData.isReady ? tableData.rows.map((row, i) => (
                  <tr key={`tr-${i}`}>
                    { row.map((cell, j) => {
                      const Cell = row_renderer_list[j];
                      return <Cell key={`td-${i}-${j}`} data={cell} />;
                      // return <Fragment />;
                    }) }
                  </tr>
                )) : null }
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
	}
}


const mapStateToProps = (state, props) => {
  const { tableName } = props.match.params;

  return {
    schema: state.schema.isReady ? {
      ...state.schema.rows.find(x => x.table_name === tableName),
      isReady: true,
    } : {
      isReady: false,
    },
    tableData: {
      columns: state.browser.columns,
      rows: state.browser.rows,
      query_sql: state.browser.query_sql,
      isFetching: state.browser.isFetching,
      isReady: state.browser.isReady,
    },
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