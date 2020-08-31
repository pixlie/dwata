import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { Hx } from "components/LayoutHelpers";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const changeOrderBy = useQuerySpecification((state) => state.changeOrderBy);
  const addOrderBy = useQuerySpecification((state) => state.addOrderBy);

  const handleChangeOrderBy = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    changeOrderBy(queryContext.key, name.substring(6), value);
  };

  const handleAddOrderBy = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    addOrderBy(queryContext.key, value);
  };

  const { orderBy } = querySpecification;
  const order_by_options = [
    <option value="" key="ord-hd">
      Order by
    </option>,
  ];
  for (const head of querySpecification.select) {
    order_by_options.push(
      <option value={head.label} key={`ord-${head.label}`}>
        {head.label}
      </option>
    );
  }

  return (
    <Fragment>
      <Hx x="4">Ordering</Hx>

      <p className="text-gray-700 my-2">
        You can filter by any column, even the ones that are not visible.
      </p>

      {Object.keys(orderBy).map((col) => (
        <div className="field is-horizontal" key={`or-${col}`}>
          <div className="field-label">
            <label className="label">{col}</label>
          </div>

          <div className="field-body">
            <div className="field is-narrow">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name={col}
                    value="asc"
                    checked={orderBy[col] === "asc"}
                    onChange={handleChangeOrderBy}
                  />
                  &nbsp;asc
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name={col}
                    value="desc"
                    checked={orderBy[col] === "desc"}
                    onChange={handleChangeOrderBy}
                  />
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
          <select onChange={handleAddOrderBy}>{order_by_options}</select>
        </div>
      </div>
    </Fragment>
  );
};
