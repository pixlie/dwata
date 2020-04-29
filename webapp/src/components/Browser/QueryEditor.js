import React, { PureComponent } from "react";
import { connect } from "react-redux";

import OrderByEditor from "./OrderByEditor";
import FilterByEditor from "./FilterByEditor";


class QueryEditor extends PureComponent {
	constructor() {
		super();
		this.state = {
      columns_selected: {},
      filter_by: {},
      order_by: {},  // Only used to load from localStorage
      limit: 100,
    }
    this.applyChanges = this.applyChanges.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  componentDidMount() {
    const { source_id, table_name, table_columns } = this.props;
    var cache_state = window.localStorage.getItem(`queryEditorCache/${source_id}/${table_name}`);
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
      columns_selected: table_columns.reduce((acc, ele) => ({
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
        columns_selected: table_columns.reduce((acc, ele) => ({
          ...acc,
          [ele.name]: true
        }), {})
      }));
    }
  }

  applyChanges(event) {
    event.preventDefault();
    const { onchange, source_id, table_name, order_by } = this.props;
    const { columns_selected, filter_by, limit } = this.state;
    // We save the query specification to local storage so when we reopen the editor or refresh we can refill the form
    window.localStorage.setItem(
      `queryEditorCache/${source_id}/${table_name}`,
      JSON.stringify({ columns_selected, order_by, filter_by, limit })
    );
    onchange({ columns_selected, order_by, filter_by, limit });
  }

  toggleColumn(event) {
    event.preventDefault();
    const { name } = event.target;
    this.setState(state => ({
      ...state,
      columns_selected: {
        ...state.columns_selected,
        [name]: !state.columns_selected[name],
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
      filter_by: {
        ...filterData
      }
    }));
  }

  render() {
    const { applyChanges, toggleColumn, changeInput, setFilters } = this;
    const { table_columns } = this.props;
    const { columns_selected, limit, filter_by, order_by } = this.state;

    return (
      <div className="pure-g options-panel">
        <div className="pure-u-1-3">
          <form className="pure-form pure-form-stacked" onsubmit={applyChanges}>
            I want to get
            <div className="multiple-input">
              { table_columns.map(head => (
                <div className="checkbox">
                  <label for={`sl-${head.name}`}>{head.name}</label>
                  <input type="checkbox" name={head.name} id={`sl-${head.name}`} key={`sl-${head.name}`} checked={columns_selected[head.name]} onChange={toggleColumn} />
                </div>
              )) }
            </div>
          </form>
        </div>

        <div className="pure-u-1-3">
          <FilterByEditor table_columns={table_columns} filter_by={filter_by} setFilters={setFilters} />
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


const mapStateToProps = state => ({
  order_by: state.queryEditor.order_by,
});


const mapDispatchToProps = () => ({});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryEditor);