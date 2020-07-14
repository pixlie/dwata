import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import {
  useGlobal,
  useSchema,
  useData,
  useQuerySpecification,
} from "services/store";

/**
 * This method renders on the filter controls for a single column.
 * It is used in the top (common) filter editor, as well as in the per column head editor.
 */
export default ({ columnName }) => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const isFEVisible = useGlobal((state) => state.isFEVisible);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const setFilter = useQuerySpecification((state) => state.setFilter);

  if (
    !(
      data &&
      data.isReady &&
      isFEVisible &&
      querySpecification &&
      querySpecification.isReady
    )
  ) {
    return null;
  }

  const { filterBy } = querySpecification;
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).columns;
  const dataType = schemaColumns.find((x) => x.name === columnName);

  const handleChange = (event) => {
    const { name, value, dataset } = event.target;

    const temp = {};
    if (dataType.type === "INTEGER") {
      if (value.indexOf(",") !== -1) {
        // This is a range provided
        if (value.substring(0, value.indexOf(",")).trim() !== "") {
          temp["from"] = parseInt(
            value.substring(0, value.indexOf(",")).trim(),
            10
          );
        }
        if (value.substring(value.indexOf(",") + 1).trim() !== "") {
          temp["to"] = parseInt(value.substring(value.indexOf(",") + 1));
        }
        temp["display"] = value;
      } else {
        temp["equal"] = parseInt(value, 10);
        temp["display"] = value;
      }
    } else if (dataType.type === "VARCHAR") {
      temp["like"] = value;
      temp["display"] = value;
    } else if (dataType.type === "DATE") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (dataType.type === "TIMESTAMP") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (dataType.type === "BOOLEAN") {
      temp["value"] = null;
      if (value === "true") {
        temp["value"] = true;
      } else if (value === "false") {
        temp["value"] = false;
      }
    }

    setFilter(queryContext.key, name, temp);
  };

  if (!Object.keys(filterBy).includes(columnName)) {
    return null;
  }

  if (dataType.type === "INTEGER" || dataType.type === "FLOAT") {
    return (
      <div className="control">
        <input
          className="input"
          name={columnName}
          onChange={handleChange}
          placeholder="range 12,88 or exact 66"
          value={filterBy[columnName].display}
        />
      </div>
    );
  } else if (dataType.type === "VARCHAR") {
    return (
      <div className="control">
        <input
          className="input"
          name={columnName}
          onChange={handleChange}
          placeholder="text to search"
          value={filterBy[columnName].display}
        />
      </div>
    );
  } else if (dataType.type === "DATE") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="from"
            type="date"
            onChange={handleChange}
            value={filterBy[columnName].display}
          />
        </div>

        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="to"
            type="date"
            onChange={handleChange}
            value={filterBy[columnName].display}
          />
        </div>
      </Fragment>
    );
  } else if (dataType.type === "TIMESTAMP") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="from"
            type="datetime-local"
            onChange={handleChange}
            value={filterBy[columnName].from}
          />
        </div>

        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="to"
            type="datetime-local"
            onChange={handleChange}
            value={filterBy[columnName].to}
          />
        </div>
      </Fragment>
    );
  } else if (dataType.type === "BOOLEAN") {
    return (
      <div className="control is-narrow">
        <div className="control">
          <label className="radio">
            <input
              type="radio"
              name={columnName}
              value="true"
              checked={filterBy[columnName].value === true}
              onChange={handleChange}
            />
            &nbsp;Yes
          </label>

          <label className="radio">
            <input
              type="radio"
              name={columnName}
              value="false"
              checked={filterBy[columnName].value === false}
              onChange={handleChange}
            />
            &nbsp;No
          </label>
        </div>
      </div>
    );
  }
  return (
    <div className="control">
      <input className="input" type="text" disabled value="Coming soon" />
    </div>
  );
};

/*
const mapStateToProps = (state, props) => {
  // Our Grid can be called either for a particular data source/table or from a saved query
  let {tableName, savedQueryId} = props.match.params;
  if (!!savedQueryId) {
    // The Grid was called on a saved query, we need to find the real data source and query spec
    if (!state.apps.isReady) {
      return {
        isReady: false,
      };
    }

    const savedQuery = getSavedQuery(state, savedQueryId);
    if (!!savedQuery && Object.keys(savedQuery).includes("source_id")) {
      tableName = savedQuery.table_name;
    } else {
      return {
        isReady: false,
      };
    }
  }

  return {
    schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
    filterBy: state.querySpecification.filterBy,
  };
}


export default withRouter(connect(
  mapStateToProps,
  {
    setFilter,
  }
)(FilterItem));
*/
