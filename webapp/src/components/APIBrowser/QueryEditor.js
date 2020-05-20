import React, { PureComponent } from "react";
import { connect } from "react-redux";

import OrderByEditor from "./OrderByEditor";
import FilterByEditor from "./FilterByEditor";


class QueryEditor extends PureComponent {
	constructor() {
		super();
		this.state = {
      columnsSelected: {},
      filterBy: {},
      order_by: {},  // Only used to load from localStorage
      limit: 100,
    }
    this.applyChanges = this.applyChanges.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  componentDidMount() {
    const { sourceId, table_name, table_columns } = this.props;
    var cache_state = window.localStorage.getItem(`queryEditorCache/${sourceId}/${table_name}`);
    if (cache_state) {
      cache_state = JSON.parse(cache_state);
      cache_state["limit"] = cache_state["limit"] ? parseInt(cache_state["limit"]) : null;
    } else {
      cache_state = {};
    }
    if ("order_by" in cache_state) {

    }
    this.setState(state => ({
      ...state,
      columnsSelected: table_columns.reduce((acc, ele) => ({
        ...acc,
        [ele.name]: true
      }), {}),
      ...cache_state
    }));
  }

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

  applyChanges(event) {
    event.preventDefault();
    const { onchange, sourceId, table_name, order_by } = this.props;
    const { columnsSelected, filterBy, limit } = this.state;
    // We save the query specification to local storage so when we reopen the editor or refresh we can refill the form
    window.localStorage.setItem(
      `queryEditorCache/${sourceId}/${table_name}`,
      JSON.stringify({ columnsSelected, order_by, filterBy, limit })
    );
    onchange({ columnsSelected, order_by, filterBy, limit });
  }

  toggleColumn(event) {
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

  changeInput(event) {
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
    const { table_columns } = this.props;
    const { columnsSelected, limit, filterBy, order_by } = this.state;

    return (
      <div className="pure-g options-panel">
        <div className="pure-u-1-3">
          <form className="pure-form pure-form-stacked" onsubmit={applyChanges}>
            I want to get
            <div className="multiple-input">
              { table_columns.map(head => (
                <div className="checkbox">
                  <label for={`sl-${head.name}`}>{head.name}</label>
                  <input type="checkbox" name={head.name} id={`sl-${head.name}`} key={`sl-${head.name}`} checked={columnsSelected[head.name]} onChange={toggleColumn} />
                </div>
              )) }
            </div>
          </form>
        </div>

        <div className="pure-u-1-3">
          <FilterByEditor table_columns={table_columns} filterBy={filterBy} setFilters={setFilters} />
        </div>

        <div className="pure-u-1-3">
          <OrderByEditor table_columns={table_columns} cached_order_by={order_by} />

          Limited to
          <form className="pure-form pure-form-stacked" onsubmit={applyChanges}>
            <input type="number" name="limit" onchange={changeInput} value={limit} />

            <button type="submit" className="pure-button small pure-button-success">Apply</button>
          </form>
        </div>

        { /* <div className="pure-u-1-2">
          <form className="pure-form pure-form-stacked" onsubmit={applyChanges}>
            <textarea name="raw_sql" style="width:100%;max-width:100%;height:120px;">{query}</textarea>
          </form>
        </div> */ }
      </div>
    );
  }
}


const mapStateToProps = state => ({});


export default connect(
  mapStateToProps,
  {}
)(QueryEditor);