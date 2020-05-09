import React, { useEffect, useCallback } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { Section, Hx } from "components/BulmaHelpers";


const cellRenderer = (column, sourceId) => {
  const date_time_options = {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input className="input" type="text" value={data === null ? "" : data} disabled />
      </div>
    </div>
  );

  const TitleCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input className="input is-medium is-fullwidth" type="text" value={data === null ? "" : data} disabled />
      </div>
    </div>
  );

  const TextareaCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <textarea className="textarea is-fullwidth" disabled defaultValue={data} />
      </div>
    </div>
  );

  const PrimaryKeyCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input className="input" type="text" value={data === null ? "" : data} disabled />
      </div>
    </div>
  );

  const RelatedCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input className="input" type="text" value={data === null ? "" : data} disabled />
      </div>
      {data ? <p className="help">Linked to {column.foreign_keys.map(link => (
        <Link key={`fk-${column.name}-${link.table}-${link.column}`} to={`/browse/${sourceId}/${link.table}/${data}`}>{link.table}/{data}</Link>
      ))}</p> : null}
    </div>
  )

  const BooleanCell = ({ data }) => (
    <div className="field">
      <div className="control">
        <label className="checkbox">
          <input type="checkbox" checked={data === true} disabled /> &nbsp;
          {column.name}
        </label>
      </div>
    </div>
  );

  const JSONCell = ({ data }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        {data !== null ? <div onClick={() => { alert(JSON.stringify(data)); }}>{"{ click to expand }"}</div> : "-"}
      </div>
    </div>
  );

  const TimeStampCell = (({ data }) => {
    let parsedDate = null;
    if (data !== null) {
      try {
        parsedDate = new Intl.DateTimeFormat("en-GB", date_time_options).format(new Date(data * 1000));
      } catch (error) {
        // Perhaps log this for admin
      }
    }
    return (
      <div className="field">
        <label className="label">{column.name}</label>
        <div className="control">
          <input className="input" type="text" value={parsedDate === null ? "" : data} disabled />
        </div>
      </div>
    )
  });

  if (column.is_primary_key) {
    return PrimaryKeyCell;
  } else if (column.has_foreign_keys) {
    return RelatedCell;
  } else if (column.type === "BOOLEAN") {
    return BooleanCell;
  } else if (column.type === "JSONB" || column.type === "JSON") {
    return JSONCell;
  } else if (column.type === "TIMESTAMP") {
    return TimeStampCell;
  } else if (column.ui_hints.includes("is_title")) {
    return TitleCell;
  } else if (column.ui_hints.includes("is_text_lg")) {
    return TextareaCell;
  } else {
    return DefaultCell;
  }
}


const Detail = ({ sourceId, tableName, pk, schema, tableData, history }) => {
  const handleKey = useCallback(event => {
    if (event.keyCode === 27) {
      history.push(`/browse/${sourceId}/${tableName}`);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    }
  }, []);
  let currentRow = {};
  if (!schema.isReady || !tableData.isReady) {
    return (
      <div>Loading...</div>
    );
  }
  currentRow = tableData.rows.find(x => x[0] == pk);

  return (
    <div id="detail-modal">
      <Section>
        <button className="button is-rounded is-dark close" onClick={() => history.push(`/browse/${sourceId}/${tableName}`)}>
          Close&nbsp;<i className="fas fa-times"></i>
        </button>

        <div className="columns">
          <div className="column is-9">
            { currentRow.map((cell, i) => {
              if (schema.columns[i].ui_hints.includes("is_meta")) { return null; }
              const Cell = cellRenderer(schema.columns[i], sourceId);
              return Cell !== null ? <Cell key={`cl-${i}`} data={cell} column={schema.columns[i]} /> : null;
            }) }
          </div>

          <div className="column is-3">
            { currentRow.map((cell, i) => {
              if (!schema.columns[i].ui_hints.includes("is_meta")) { return null; }
              const Cell = cellRenderer(schema.columns[i], sourceId);
              return Cell !== null ? <Cell key={`cl-${i}`} data={cell} column={schema.columns[i]} /> : null;
            }) }
          </div>
        </div>
      </Section>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName, pk } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  const tableData = state.browser.isReady && state.browser._cacheKey === _browserCacheKey ? state.browser : {
    isReady: false,
  };

  return {
    sourceId,
    tableName,
    pk,
    schema: state.schema.isReady && state.schema.sourceId === parseInt(sourceId) ? {
      ...state.schema.rows.find(x => x.table_name === tableName),
      isReady: true,
    } : {
      isReady: false,
    },
    tableData
  }
}


export default withRouter(connect(
  mapStateToProps,
  {}
)(Detail));