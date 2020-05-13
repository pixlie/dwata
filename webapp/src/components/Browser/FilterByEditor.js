import React, { Fragment } from 'react';

import { Hx } from "components/BulmaHelpers";


export default ({ schema, filterBy, setFilters }) => {
  const addFilter = event => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const data_type = schema.find(x => x.name === value);
    if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(data_type.type)) {
      setFilters({
        ...filterBy,
        [value]: {
          display: ""
        },
      });
    } else if (data_type.type === "BOOLEAN") {
      setFilters({
        ...filterBy,
        [value]: {
          display: "true",
          value: true,
        }
      });
    }
  }

  const changeFilter = event => {
    event.preventDefault();
    const { name, value, dataset } = event.target;

    const temp = {};
    const data_type = schema.find(x => x.name === name);
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
  
    setFilters({
      ...filterBy,
      [name]: temp,
    });
  }

  const removeFilter = event => {
    event.preventDefault();
    const { name } = event.target.dataset;
    if (name, name in filterBy) {
      const temp = {...filterBy};
      delete temp[name];
      setFilters(temp);
    }
  }

  const filters = [<p className="tip" key="fl-rm-hd">Double click column name to remove filter</p>];
  for (const [col, filter_spec] of Object.entries(filterBy)) {
    const data_type = schema.find(x => x.name === col);
    if (data_type.type === "INTEGER") {
      filters.push(
        <div className="multiple-input" key={`fl-int-${col}`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col}</div>
          <input name={col} onchange={changeFilter} placeholder="range 12,88 or exact 66" value={filterBy[col].display} />
        </div>
      );
    } else if (data_type.type === "VARCHAR") {
      filters.push(
        <div className="multiple-input" key={`fl-ch-${col}`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (LIKE)</div>
          <input name={col} onchange={changeFilter} placeholder="text to search" value={filterBy[col].display} />
        </div>
      );
    } else if (data_type.type === "DATE") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="date" onchange={changeFilter} value={filterBy[col].display} />
          <input name={col} data-meta="to" type="date" onchange={changeFilter} value={filterBy[col].display} />
        </div>
      )
    } else if (data_type.type === "TIMESTAMP") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="datetime-local" onchange={changeFilter} value={filterBy[col].from} />
          <input name={col} data-meta="to" type="datetime-local" onchange={changeFilter} value={filterBy[col].to} />
        </div>
      )
    } else if (data_type.type === "BOOLEAN") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col}</div>
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
  for (const head of schema.columns) {
    filterByOptions.push(<option value={head.name} key={`fl-${head.name}`}>{head.name}</option>);
  }

  return (
    <Fragment>
      <Hx x="6">Filters</Hx>
      <div className="control">
        <div className="select">
          <select name="filter_column" onChange={addFilter}>
            { filterByOptions }
          </select>
        </div>

        {filters}
      </div>
    </Fragment>
  );
}