import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { fetchSchema } from "services/schema/actions";


const TableList = ({ sourceIndex, schema, fetchSchema }) => {
  useEffect(() => {
    fetchSchema(sourceIndex);
  }, []);

  return (
    <Fragment>
      { schema.isReady ? schema.rows.map((s, i) => (
        <Link className="panel-block" to={`/browse/${sourceIndex}/${s.table_name}`} key={`sr-${i}`}>
          -- {s.table_name}
        </Link>
      )) : null }
    </Fragment>
  )
}


const mapStateToProps = state => ({
  schema: state.schema,
});


export default connect(
  mapStateToProps,
  { fetchSchema }
)(TableList);