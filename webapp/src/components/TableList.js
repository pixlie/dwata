import React, { useEffect, Fragment } from "react";
// import { connect } from "react-redux";
// import { Link } from "react-router-dom";

import { fetchSchema } from "services/schema/actions";

export default ({ sourceIndex, schema, fetchSchema, sourceType }) => {
  useEffect(() => {
    fetchSchema(sourceIndex);
  }, [sourceIndex, fetchSchema]);
  const urlBase = sourceType === "database" ? "/browse" : "/service";

  return (
    <Fragment>
      {schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === false)
            .map((s, i) => (
              <a
                className="panel-block"
                to={`${urlBase}/${sourceIndex}/${s.table_name}`}
                key={`sr-${i}`}
              >
                &nbsp;&nbsp;&nbsp;&nbsp; {s.table_name}
              </a>
            ))
        : null}
      <div className="panel-block">
        <i>System tables</i>
      </div>
      {schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === true)
            .map((s, i) => (
              <a
                className="panel-block"
                to={`${urlBase}/${sourceIndex}/${s.table_name}`}
                key={`sr-${i}`}
              >
                &nbsp;&nbsp;&nbsp;&nbsp; {s.table_name}
              </a>
            ))
        : null}
    </Fragment>
  );
};

// const mapStateToProps = state => ({
//   schema: state.schema,
// });

// export default connect(
//   mapStateToProps,
//   { fetchSchema }
// )(TableList);
