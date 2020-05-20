import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { fetchSchema } from "services/schema/actions";


const TableList = ({sourceIndex, schema, fetchSchema, sourceType}) => {
  useEffect(() => {
    fetchSchema(sourceIndex);
  }, []);
  const urlBase = sourceType === "database" ? "/browse" : "/service";

  return (
    <Fragment>
      {schema.isReady ? schema.rows.filter(s => s.properties.is_system_table === false).map((s, i) => (
        <Link className="panel-block" to={`${urlBase}/${sourceIndex}/${s.table_name}`} key={`sr-${i}`}>
          &nbsp;&nbsp;&nbsp;&nbsp; {s.table_name}
        </Link>
      )) : null}
      <div className="panel-block"><i>System tables</i></div>
      {schema.isReady ? schema.rows.filter(s => s.properties.is_system_table === true).map((s, i) => (
        <Link className="panel-block" to={`${urlBase}/${sourceIndex}/${s.table_name}`} key={`sr-${i}`}>
          &nbsp;&nbsp;&nbsp;&nbsp; {s.table_name}
        </Link>
      )) : null}
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