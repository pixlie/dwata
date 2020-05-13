import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import OrderByEditor from "./OrderByEditor";
import FilterByEditor from "./FilterByEditor";
import { Section, Hx } from "components/BulmaHelpers";


class QueryEditor extends PureComponent {
	constructor() {
		super();
		this.state = {
      columnsSelected: {},
      filterBy: {},
      orderBy: {},  // Only used to load from localStorage
      limit: 100,
    }
  }

  /* componentDidMount() {
    const { sourceId, table_name, table_columns } = this.props;
    var cache_state = window.localStorage.getItem(`queryEditorCache/${sourceId}/${table_name}`);
    if (cache_state) {
      cache_state = JSON.parse(cache_state);
      cache_state["limit"] = cache_state["limit"] ? parseInt(cache_state["limit"]) : null;
    } else {
      cache_state = {};
    }
    if ("orderBy" in cache_state) {

    }
    this.setState(state => ({
      ...state,
      columnsSelected: table_columns.reduce((acc, ele) => ({
        ...acc,
        [ele.name]: true
      }), {}),
      ...cache_state
    }));
  } */

  componentDidUpdate(prevProps) {
    const { table_columns } = this.props;
    if (table_columns !== prevProps.table_columns) {
      this.setState(state => ({
        ...state,
        columnsSelected: table_columns.reduce((acc, ele) => ({
          ...acc,
          [ele.name]: true
        }), {})
      }));
    }
  }

  applyChanges = (event) => {
    event.preventDefault();
    const { onchange, sourceId, table_name, orderBy } = this.props;
    const { columnsSelected, filterBy, limit } = this.state;
    // We save the query specification to local storage so when we reopen the editor or refresh we can refill the form
    window.localStorage.setItem(
      `queryEditorCache/${sourceId}/${table_name}`,
      JSON.stringify({ columnsSelected, orderBy, filterBy, limit })
    );
    onchange({ columnsSelected, orderBy, filterBy, limit });
  }

  toggleColumn = (event) => {
    event.preventDefault();
    const { name } = event.target;
    this.setState(state => ({
      ...state,
      columnsSelected: {
        ...state.columnsSelected,
        [name]: !state.columnsSelected[name],
      },
    }))
  }

  changeInput = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState(state => ({
      ...state,
      [name]: value,
    }))
  }

  setFilters = (filterData) => {
    this.setState(state => ({
      ...state,
      filterBy: {
        ...filterData
      }
    }));
  }

  render() {
    const { applyChanges, toggleColumn, changeInput, setFilters } = this;
    const { sourceId, tableName, schema, qe } = this.props;
    const { columnsSelected, limit, filterBy, orderBy } = this.state;

    if (sourceId === null || tableName === null || !qe.isQEVisible) {
      return null;
    }

    return (
      <div id="query-editor">
        <Section>
          <button className="button is-rounded is-dark close" onClick={() => {}}>
            Close&nbsp;<i className="fas fa-times"></i>
          </button>

          <div className="columns">
            <div className="column is-8">
              <Hx x="6">Visible columns</Hx>
              <div className="field is-grouped is-grouped-multiline">
                { schema.columns.filter(x => !x.ui_hints.includes("is_meta")).map((head, i) => (
                  <div className="control" key={`col-get-${i}`}>
                    <input type="checkbox" name={head.name} id={`sl-${head.name}`} checked={columnsSelected[head.name]} onChange={toggleColumn} />
                    &nbsp;<label className="checkbox" htmlFor={`sl-${head.name}`}>{head.name}</label>
                  </div>
                )) }
              </div>
            </div>

            <div className="column is-4 has-meta-data">
              <div className="field is-grouped is-grouped-multiline">
                { schema.columns.filter(x => x.ui_hints.includes("is_meta")).map((head, i) => (
                  <div className="control" key={`col-get-${i}`}>
                    <input type="checkbox" name={head.name} id={`sl-${head.name}`} checked={columnsSelected[head.name]} onChange={toggleColumn} />
                    &nbsp;<label className="checkbox" htmlFor={`sl-${head.name}`}>{head.name}</label>
                  </div>
                )) }
              </div>
            </div>
          </div>
        </Section>
          {/* <FilterByEditor schema={schema} filterBy={filterBy} setFilters={setFilters} /> */}
          {/* <OrderByEditor schema={schema} cachedOrderBy={orderBy} /> */}

        { /* <div className="pure-u-1-2">
          <form className="pure-form pure-form-stacked" onSubmit={applyChanges}>
            <textarea name="raw_sql" style="width:100%;max-width:100%;height:120px;">{query}</textarea>
          </form>
        </div> */ }
      </div>
    );
  }
}



const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;

  return {
    sourceId,
    tableName,
    schema: state.schema.isReady && state.schema.sourceId === parseInt(sourceId) ? {
      ...state.schema.rows.find(x => x.table_name === tableName),
      isReady: true,
    } : {
      isReady: false,
    },
    tableData: state.browser.isReady && state.browser._cacheKey === _browserCacheKey ? state.browser : {
      isReady: false,
    },
    qe: state.querySpecification,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {}
)(QueryEditor));