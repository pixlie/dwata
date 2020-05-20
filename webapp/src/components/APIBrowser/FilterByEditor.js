import React from 'react';


export default ({ table_columns, filter_by, setFilters }) => {
  const addFilter = event => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const data_type = table_columns.find(x => x.name === value);
    if (["INTEGER", "VARCHAR", "TIMESTAMP"].includes(data_type.type)) {
      setFilters({
        ...filter_by,
        [value]: {
          display: ""
        },
      });
    } else if (data_type.type === "BOOLEAN") {
      setFilters({
        ...filter_by,
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
    const data_type = table_columns.find(x => x.name === name);
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
      ...filter_by,
      [name]: temp,
    });
  }

  const removeFilter = event => {
    event.preventDefault();
    const { name } = event.target.dataset;
    if (name, name in filter_by) {
      const temp = {...filter_by};
      delete temp[name];
      setFilters(temp);
    }
  }

  const filters = [<p className="tip">Double click column name to remove filter</p>];
  for (const [col, filter_spec] of Object.entries(filter_by)) {
    const data_type = table_columns.find(x => x.name === col);
    if (data_type.type === "INTEGER") {
      filters.push(
        <div className="multiple-input" key={`fl-int-${col}`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col}</div>
          <input name={col} onchange={changeFilter} placeholder="range 12,88 or exact 66" value={filter_by[col].display} />
        </div>
      );
    } else if (data_type.type === "VARCHAR") {
      filters.push(
        <div className="multiple-input" key={`fl-ch-${col}`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (LIKE)</div>
          <input name={col} onchange={changeFilter} placeholder="text to search" value={filter_by[col].display} />
        </div>
      );
    } else if (data_type.type === "DATE") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="date" onchange={changeFilter} value={filter_by[col].display} />
          <input name={col} data-meta="to" type="date" onchange={changeFilter} value={filter_by[col].display} />
        </div>
      )
    } else if (data_type.type === "TIMESTAMP") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col} (from, to)</div>
          <input name={col} data-meta="from" type="datetime-local" onchange={changeFilter} value={filter_by[col].from} />
          <input name={col} data-meta="to" type="datetime-local" onchange={changeFilter} value={filter_by[col].to} />
        </div>
      )
    } else if (data_type.type === "BOOLEAN") {
      filters.push(
        <div className="multiple-input" key={`fl-dt-${col}-st`}>
          <div className="label" ondblclick={removeFilter} data-name={col}>{col}</div>
          <div className="checkbox">
            <label for={`fl_${col}_true`}>true</label>
            <input type="checkbox" name={col} id={`fl_${col}_true`} value="true" checked={filter_by[col].value === true} onChange={changeFilter} />
          </div>
          <div className="checkbox">
            <label for={`fl_${col}_false`}>false</label>
            <input type="checkbox" name={col} id={`fl_${col}_false`} value="false" checked={filter_by[col].value === false} onChange={changeFilter} />
          </div>
        </div>
      )
    }
  }

  const filter_by_options = [<option value="">Filter by</option>];
  for (const head of table_columns) {
    filter_by_options.push(<option value={head.name} key={`fl-${head.name}`}>{head.name}</option>);
  }

  const ignoreSubmit = event => { event.preventDefault(); }

  return (
    <form className="pure-form pure-form-stacked" onsubmit={ignoreSubmit}>
      <select name="filter_column" onchange={addFilter} value="">
        { filter_by_options }
      </select>

      {filters}
    </form>
  );
}