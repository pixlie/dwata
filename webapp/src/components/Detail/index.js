import React, { useEffect, useCallback } from "react";

import { QueryContext } from "utils";
import { Section } from "components/BulmaHelpers";

const cellRenderer = (column, sourceId) => {
  const date_time_options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input
          className="input"
          type="text"
          value={data === null ? "" : data}
          disabled
        />
      </div>
    </div>
  );

  const TitleCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input
          className="input is-medium is-fullwidth"
          type="text"
          value={data === null ? "" : data}
          disabled
        />
      </div>
    </div>
  );

  const TextareaCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <textarea
          className="textarea is-fullwidth"
          disabled
          defaultValue={data}
        />
      </div>
    </div>
  );

  const PrimaryKeyCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input
          className="input"
          type="text"
          value={data === null ? "" : data}
          disabled
        />
      </div>
    </div>
  );

  const RelatedCell = ({ data, column }) => (
    <div className="field">
      <label className="label">{column.name}</label>
      <div className="control">
        <input
          className="input"
          type="text"
          value={data === null ? "" : data}
          disabled
        />
      </div>
      {/* {data ? (
        <p className="help">
          Linked to{" "}
          {column.foreign_keys.map((link) => (
            <Link
              key={`fk-${column.name}-${link.table}-${link.column}`}
              to={`/browse/${sourceId}/${link.table}/${data}`}
            >
              {link.table}/{data}
            </Link>
          ))}
        </p>
      ) : null} */}
    </div>
  );

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
        {data !== null ? (
          <div
            onClick={() => {
              alert(JSON.stringify(data));
            }}
          >
            {"{JSON}"}
          </div>
        ) : (
          "{}"
        )}
      </div>
    </div>
  );

  const TimeStampCell = ({ data }) => {
    let parsedDate = null;
    if (data !== null) {
      try {
        parsedDate = new Intl.DateTimeFormat("en-GB", date_time_options).format(
          new Date(data * 1000)
        );
      } catch (error) {
        // Perhaps log this for admin
      }
    }
    return (
      <div className="field">
        <label className="label">{column.name}</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={parsedDate === null ? "-" : data}
            disabled
          />
        </div>
      </div>
    );
  };

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
};

export default () => {
  useEffect(() => {
    fetchDataItem();
  }, [sourceId, tableName, pk, fetchDataItem]);
  const handleKey = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        history.push(`/browse/${sourceId}/${tableName}`);
      }
    },
    [history, sourceId, tableName]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    };
  }, [handleKey]);
  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div id="detail-modal">
      <Section>
        <button
          className="button is-rounded is-dark close"
          onClick={() => history.push(`/browse/${sourceId}/${tableName}`)}
        >
          Close&nbsp;<i className="fas fa-times"></i>
        </button>

        <div className="columns">
          <div className="column is-9">
            {Object.keys(dataItem).map((col, i) => {
              if (
                schemaColumns
                  .find((x) => x.name === col)
                  .ui_hints.includes("is_meta")
              ) {
                return null;
              }
              const cell = dataItem[col];
              const Cell = cellRenderer(schemaColumns[i], sourceId);
              return Cell !== null ? (
                <Cell key={`cl-${i}`} data={cell} column={schemaColumns[i]} />
              ) : null;
            })}
          </div>

          <div className="column is-3 has-meta-data">
            {Object.keys(dataItem).map((col, i) => {
              if (
                !schemaColumns
                  .find((x) => x.name === col)
                  .ui_hints.includes("is_meta")
              ) {
                return null;
              }
              const cell = dataItem[col];
              const Cell = cellRenderer(schemaColumns[i], sourceId);
              return Cell !== null ? (
                <Cell key={`cl-${i}`} data={cell} column={schemaColumns[i]} />
              ) : null;
            })}
          </div>
        </div>
      </Section>
    </div>
  );
};

/*
const mapStateToProps = (state, props) => {
  const { sourceId, tableName, pk } = getQueryDetails(state, props);
  const _cacheKey = `${sourceId}/${tableName}/${pk}`;

  // We are ready only when all the needed data is there
  if (
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    _cacheKey in state.dataItem &&
    state.dataItem[_cacheKey].isReady
  ) {
    return {
      isReady: true,
      sourceId,
      tableName,
      pk,
      schemaColumns: state.schema.rows.find((x) => x.table_name === tableName)
        .columns,
      dataItem: state.dataItem[_cacheKey].data,
    };
  }

  return {
    isReady: false,
    sourceId,
    tableName,
    pk,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchDataItem,
  })(Detail)
);
*/
