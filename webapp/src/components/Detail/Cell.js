import React from "react";

export default (column, sourceLabel) => {
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
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        value={data === null ? "" : data}
        disabled
      />
    </div>
  );

  const TitleCell = ({ data }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        value={data === null ? "" : data}
        disabled
      />
    </div>
  );

  const TextareaCell = ({ data }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
      <textarea
        className="block border px-2 py-1 w-full h-40 rounded"
        disabled
        defaultValue={data}
      />
    </div>
  );

  const PrimaryKeyCell = ({ data }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
      <input
        className="border px-2 py-1"
        type="text"
        value={data === null ? "" : data}
        disabled
      />
    </div>
  );

  const RelatedCell = ({ data }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        value={data === null ? "" : data}
        disabled
      />
      {/* {data ? (
        <p className="help">
          Linked to{" "}
          {column.foreign_keys.map((link) => (
            <Link
              key={`fk-${column.name}-${link.table}-${link.column}`}
              to={`/browse/${item.sourceLabel}/${link.table}/${data}`}
            >
              {link.table}/{data}
            </Link>
          ))}
        </p>
      ) : null} */}
    </div>
  );

  const BooleanCell = ({ data }) => (
    <div className="my-4">
      <label className="checkbox">
        <input type="checkbox" checked={data === true} disabled /> &nbsp;
        {column.name}
      </label>
    </div>
  );

  const JSONCell = ({ data }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{column.name}</label>
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
      <div className="my-4">
        <label className="font-semibold mr-2">{column.name}</label>
        <input
          className="block border px-2 py-1 w-full rounded"
          type="text"
          value={parsedDate === null ? "-" : data}
          disabled
        />
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
