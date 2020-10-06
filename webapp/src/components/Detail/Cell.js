import React from "react";

export default (columnDefinition, updateChange, sourceLabel) => {
  const date_time_options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const handleChange = (event) => {
    updateChange(columnDefinition.name, event.target.value);
  };

  const DefaultCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        defaultValue={data === null ? "" : data}
        disabled={isDisabled}
      />
    </div>
  );

  const TitleCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        defaultValue={data === null ? "" : data}
        disabled={isDisabled}
      />
    </div>
  );

  const TextareaCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <textarea
        className="block border px-2 py-1 w-full h-40 rounded"
        disabled={isDisabled}
        defaultValue={data}
      />
    </div>
  );

  const PrimaryKeyCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        defaultValue={data === null ? "" : data}
        disabled={isDisabled}
      />
    </div>
  );

  const RelatedCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <input
        className="block border px-2 py-1 w-full rounded"
        type="text"
        defaultValue={data === null ? "" : data}
        disabled={isDisabled}
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

  const BooleanCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="checkbox">
        <input type="checkbox" checked={data === true} disabled={isDisabled} />{" "}
        &nbsp;
        {columnDefinition.name}
      </label>
    </div>
  );

  const JSONCell = ({ data, isDisabled = true }) => (
    <div className="my-4">
      <label className="font-semibold mr-2">{columnDefinition.name}</label>
      <textarea
        className="block border px-2 py-1 w-full h-40 rounded"
        disabled={isDisabled}
        defaultValue={data !== null ? JSON.stringify(data, null, 2) : ""}
        onChange={handleChange}
      />
    </div>
  );

  const TimeStampCell = ({ data, isDisabled = true }) => {
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
        <label className="font-semibold mr-2">{columnDefinition.name}</label>
        <input
          className="block border px-2 py-1 w-full rounded"
          type="text"
          defaultValue={parsedDate === null ? "-" : data}
          disabled={isDisabled}
        />
      </div>
    );
  };

  if (columnDefinition.is_primary_key) {
    return PrimaryKeyCell;
  } else if (columnDefinition.has_foreign_keys) {
    return RelatedCell;
  } else if (columnDefinition.type === "BOOLEAN") {
    return BooleanCell;
  } else if (
    columnDefinition.type === "JSONB" ||
    columnDefinition.type === "JSON"
  ) {
    return JSONCell;
  } else if (columnDefinition.type === "TIMESTAMP") {
    return TimeStampCell;
  } else if (columnDefinition.ui_hints.includes("is_title")) {
    return TitleCell;
  } else if (columnDefinition.ui_hints.includes("is_text_lg")) {
    return TextareaCell;
  } else {
    return DefaultCell;
  }
};
