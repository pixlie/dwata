import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { setFilter } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";


const FilterEditor = ({isReady, isVisible, schemaColumns, filterBy, setFilter, fetchData}) => {
  if (!isReady || !isVisible) {
    return null;
  }

  const addFilter = event => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const data_type = schemaColumns.find(x => x.name === value);
    if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(data_type.type)) {
      setFilter(
        value, {
          display: ""
        }
      );
    } else if (data_type.type === "BOOLEAN") {
      setFilter(
        value, {
          display: "true",
          value: true,
        }
      );
    }
  }

  const changeFilter = event => {
    event.preventDefault();
    const { name, value, dataset } = event.target;

    const temp = {};
    const data_type = schemaColumns.find(x => x.name === name);
    if (data_type.type === "INTEGER") {
      if (value.indexOf(",") !== -1) {
        // This is a range provided
        if (value.substring(0, value.indexOf(",")).trim() !== "") {
          temp["from"] = parseInt(value.substring(0, value.indexOf(",")).trim(), 10);
        }
        if (value.substring(value.indexOf(",") + 1).trim() !== "") {
          temp["to"] = parseInt(value.substring(value.indexOf(",") + 1));
        }
        temp["display"] = value;
      } else {
        temp["equal"] = parseInt(value, 10);
        temp["display"] = value;
      }
    } else if (data_type.type === "VARCHAR") {
      temp["like"] = value;
      temp["display"] = value;
    } else if (data_type.type === "DATE") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (data_type.type === "TIMESTAMP") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (data_type.type === "BOOLEAN") {
      temp["value"] = value === "true" ? true : false;
    }
  
    setFilter(name, temp);
  }

  const removeFilter = event => {
    event.preventDefault();
    const { name } = event.target.dataset;
    if (name, name in filterBy) {
      const temp = {...filterBy};
      delete temp[name];
      // setFilter(temp);
    }
  }

  const filters = [<p className="tip" key="fl-rm-hd">Double click column name to remove filter</p>];
  for (const [col, filter_spec] of Object.entries(filterBy)) {
    const data_type = schemaColumns.find(x => x.name === col);
    if (data_type.type === "INTEGER") {
      filters.push(
        <div className="multiple-input" key={`fl-int-${col}`}>
          <label className="label" onDoubleClick={removeFilter}>
            {col}
            <input className="input" name={col} onChange={changeFilter} placeholder="range 12,88 or exact 66" value={filterBy[col].display} />
          </label>
        </div>
      );
    } else if (data_type.type === "VARCHAR") {
      filters.push(
        <div className="multiple-input" key={`fl-ch-${col}`}>
          <div className="label" onDoubleClick={removeFilter}>{col} (LIKE)</div>
          <input name={col} onChange={changeFilter} placeholder="text to search" value={filterBy[col].display} />
        </div>
      );
    } else if (data_type.type === "DATE") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" onDoubleClick={removeFilter}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="date" onChange={changeFilter} value={filterBy[col].display} />
          <input name={col} data-meta="to" type="date" onChange={changeFilter} value={filterBy[col].display} />
        </div>
      )
    } else if (data_type.type === "TIMESTAMP") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" onDoubleClick={removeFilter}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="datetime-local" onChange={changeFilter} value={filterBy[col].from} />
          <input name={col} data-meta="to" type="datetime-local" onChange={changeFilter} value={filterBy[col].to} />
        </div>
      )
    } else if (data_type.type === "BOOLEAN") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" onDoubleClick={removeFilter}>{col}</div>
          <div className="checkbox">
            <label for={`fl_${col}_true`}>true</label>
            <input type="checkbox" name={col} id={`fl_${col}_true`} value="true" checked={filterBy[col].value === true} onChange={changeFilter} />
          </div>
          <div className="checkbox">
            <label for={`fl_${col}_false`}>false</label>
            <input type="checkbox" name={col} id={`fl_${col}_false`} value="false" checked={filterBy[col].value === false} onChange={changeFilter} />
          </div>
        </div>
      )
    }
  }

  const filterByOptions = [<option value="" key="fl-hd">Filter by</option>];
  for (const head of schemaColumns) {
    filterByOptions.push(<option value={head.name} key={`fl-${head.name}`}>{head.name}</option>);
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div id="filter-editor">
      <Section>
        <Hx x="6">Filters</Hx>
        <div className="control">
          <div className="select">
            <select name="filter_column" onChange={addFilter}>
              { filterByOptions }
            </select>
          </div>

          {filters}
          <button className="button is-fullwidth is-success" onClick={handleSubmit}>Apply</button>
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
    state.browser.isReady && state.browser._cacheKey === _browserCacheKey &&
    state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
      dataColumns: state.browser.columns,
      qsColumns: state.querySpecification.columnsSelected,
      filterBy: state.querySpecification.filterBy,
      isVisible: state.querySpecification.isFEVisible,
    };
  } else {
    return {
      isReady,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    // toggleColumnSelection,
    setFilter,
    fetchData,
  }
)(FilterEditor));