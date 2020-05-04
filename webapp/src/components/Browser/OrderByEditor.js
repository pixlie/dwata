import React, { Fragment } from "react";
import { connect } from "react-redux";

import { addOrderBy, changeOrderBy } from "services/queryEditor/actions";
import { Hx } from "components/BulmaHelpers";


const orderByEditor = ({ schema, cachedOrderBy, orderBy, addOrderBy, changeOrderBy }) => {
  const order_by_options = [<option value="" key="ord-hd">Order by</option>];
  for (const head of schema.columns) {
    order_by_options.push(<option value={head.name} key={`ord-${head.name}`}>{head.name}</option>);
  }

  if (Object.keys(orderBy).length === 0 && Object.keys(cachedOrderBy).length > 0) {
    // We have data from cache, we need to apply this to our own data
    orderBy = cachedOrderBy;
  }

  return (
    <Fragment>
      <Hx x="4">Ordering</Hx>
      <div className="control">
        <div className="select">
          <select name="filter_column" onChange={addOrderBy}>
            { order_by_options }
          </select>
        </div>
      </div>

      { Object.keys(orderBy).map(col => (
        <div className="multiple-input" key={`or-ch-${col}`}>
          {col}
          <div className="checkbox">
            <label for="order_type_asc">asc</label>
            <input type="checkbox" name={`order-${col}`} id="order_type_asc" value="asc" checked={orderBy[col] === "asc"} onChange={changeOrderBy} />
          </div>
          <div className="checkbox">
            <label for="order_type_desc">desc</label>
            <input type="checkbox" name={`order-${col}`} id="order_type_desc" value="desc" checked={orderBy[col] === "desc"} onChange={changeOrderBy} />
          </div>
        </div>
      )) }
    </Fragment>
  );
}


const mapStateToProps = state => ({
  orderBy: state.queryEditor.orderBy,
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