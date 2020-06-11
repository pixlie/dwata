import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { addOrderBy, changeOrderBy } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";


const OrderEditor = ({isReady, isVisible, schemaColumns, orderBy, addOrderBy, changeOrderBy}) => {
  if (!isReady || !isVisible) {
    return null;
  }

  const order_by_options = [<option value="" key="ord-hd">Order by</option>];
  for (const head of schemaColumns) {
    order_by_options.push(<option value={head.name} key={`ord-${head.name}`}>{head.name}</option>);
  }

  return (
    <div id="order-editor">
      <Section>
        <Hx x="4">Ordering</Hx>

        {Object.keys(orderBy).map(col => (
          <div className="field is-horizontal" key={`or-${col}`}>
            <div className="field-label">
              <label className="label">{col}</label>
            </div>

            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <label className="radio">
                    <input type="radio" name={col} value="asc" checked={orderBy[col] === "asc"} onChange={changeOrderBy} />
                    &nbsp;asc
                  </label>

                  <label className="radio">
                    <input type="radio" name={col} value="desc" checked={orderBy[col] === "desc"} onChange={changeOrderBy} />
                    &nbsp;desc
                  </label>
                </div>
              </div>
            </div>
          </div>

          // <div className="multiple-input" key={`or-ch-${col}`}>
          //   {col}
          //   <div className="checkbox">
          //     <label htmlFor="order_type_asc">asc</label>
          //     <input type="checkbox" name={`order-${col}`} id="order_type_asc" value="asc" checked={orderBy[col] === "asc"} onChange={changeOrderBy} />
          //   </div>
          //   <div className="checkbox">
          //     <label htmlFor="order_type_desc">desc</label>
          //     <input type="checkbox" name={`order-${col}`} id="order_type_desc" value="desc" checked={orderBy[col] === "desc"} onChange={changeOrderBy} />
          //   </div>
          // </div>
        ))}

        <div className="control">
          <div className="select is-fullwidth">
            <select onChange={addOrderBy}>
              {order_by_options}
            </select>
          </div>
        </div>
      </Section>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;
  if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
    state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
      orderBy: state.querySpecification.orderBy,
      isVisible: state.global.isOEVisible,
    };
  } else {
    return {
      isReady,
    };
  }
}


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
  },
  fetchData,
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderEditor));