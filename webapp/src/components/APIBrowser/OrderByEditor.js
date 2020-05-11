import React from "react";
import { connect } from "react-redux";

import { addOrderBy, changeOrderBy } from "services/querySpecification/actions";


const orderByEditor = ({ table_columns, cached_order_by, order_by, addOrderBy, changeOrderBy }) => {
  const order_by_options = [<option value="">Order by</option>];
  for (const head of table_columns) {
    order_by_options.push(<option value={head.name} key={`fl-${head.name}`}>{head.name}</option>);
  }

  const ignoreSubmit = (event) => { event.preventDefault(); }
  if (Object.keys(order_by).length === 0 && Object.keys(cached_order_by).length > 0) {
    // We have data from cache, we need to apply this to our own data
    order_by = cached_order_by;
  }

  return (
    <form className="pure-form pure-form-stacked" onsubmit={ignoreSubmit}>
      <select name="filter_column" onchange={addOrderBy}>
        { order_by_options }
      </select>

      { Object.keys(order_by).map(col => (
        <div className="multiple-input" key={`or-ch-${col}`}>
          {col}
          <div className="checkbox">
            <label for="order_type_asc">asc</label>
            <input type="checkbox" name={`order-${col}`} id="order_type_asc" value="asc" checked={order_by[col] === "asc"} onChange={changeOrderBy} />
          </div>
          <div className="checkbox">
            <label for="order_type_desc">desc</label>
            <input type="checkbox" name={`order-${col}`} id="order_type_desc" value="desc" checked={order_by[col] === "desc"} onChange={changeOrderBy} />
          </div>
        </div>
      )) }
    </form>
  );
}


const mapStateToProps = state => ({
  order_by: state.querySpecification.order_by,
});


const mapDispatchToProps = dispatch => ({
  addOrderBy: (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    dispatch(addOrderBy(value));
  },

  changeOrderBy: (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    dispatch(changeOrderBy(name.substring(6), value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(orderByEditor);