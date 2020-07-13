import React, { useContext } from "react";

import { QueryContext } from "utils";
import {
  useGlobal,
  useSchema,
  useData,
  useQuerySpecification,
} from "services/store";
import { Section, Hx } from "components/BulmaHelpers";

export default () => {
  const queryContext = useContext(QueryContext);
  const schema = useSchema((state) => state.inner[queryContext.sourceLabel]);
  const data = useData((state) => state.inner[queryContext.key]);
  const fetchData = useData((state) => state.fetchData);
  const isOEVisible = useGlobal((state) => state.inner.isOEVisible);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );

  if (
    !(
      data &&
      data.isReady &&
      isOEVisible &&
      querySpecification &&
      querySpecification.isReady
    )
  ) {
    return null;
  }

  const { orderBy } = querySpecification;
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === queryContext.tableName
  ).columns;
  const order_by_options = [
    <option value="" key="ord-hd">
      Order by
    </option>,
  ];
  for (const head of schemaColumns) {
    order_by_options.push(
      <option value={head.name} key={`ord-${head.name}`}>
        {head.name}
      </option>
    );
  }

  return (
    <div id="order-editor">
      <Section>
        <Hx x="4">Ordering</Hx>

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
                      onChange={changeOrderBy}
                    />
                    &nbsp;asc
                  </label>

                  <label className="radio">
                    <input
                      type="radio"
                      name={col}
                      value="desc"
                      checked={orderBy[col] === "desc"}
                      onChange={changeOrderBy}
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
            <select onChange={addOrderBy}>{order_by_options}</select>
          </div>
        </div>
      </Section>
    </div>
  );
};

/*
const mapStateToProps = (state, props) => {
  const { cacheKey, sourceId, tableName } = getQueryDetails(state, props);

  if (
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    state.querySpecification.isReady &&
    state.querySpecification.cacheKey === cacheKey
  ) {
    return {
      isReady: true,
      schemaColumns: state.schema.rows.find((x) => x.table_name === tableName)
        .columns,
      orderBy: state.querySpecification.orderBy,
      isVisible: state.global.isOEVisible,
    };
  }

  return {
    isReady: false,
  };
};

const mapDispatchToProps = (dispatch) => ({
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderEditor)
);
*/
