import React, { Fragment } from "react";

export default (columnDefinition, sourceLabel) => {
  const date_time_options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data, isDisabled = true, updateChange }) => {
    const handleChange = (event) => {
      updateChange(columnDefinition.name, event.target.value);
    };

    return (
      <div className="my-4">
        <label className="font-semibold mr-2">{columnDefinition.name}</label>
        <input
          className="block border px-2 py-1 w-full rounded"
          type="text"
          value={!!data ? data : ""}
          disabled={isDisabled}
          onChange={handleChange}
        />
      </div>
    );
  };

  const TitleCell = ({ data, isDisabled = true, updateChange }) => {
    const handleChange = (event) => {
      updateChange(columnDefinition.name, event.target.value);
    };

    return (
      <div className="my-4">
        <label className="font-semibold mr-2">{columnDefinition.name}</label>
        <input
          className="block border px-2 py-1 w-full rounded"
          type="text"
          value={!!data ? data : ""}
          disabled={isDisabled}
          onChange={handleChange}
        />
      </div>
    );
  };

  const TextareaCell = ({ data, isDisabled = true, updateChange }) => {
    const handleChange = (event) => {
      updateChange(columnDefinition.name, event.target.value);
    };

    return (
      <div className="my-4">
        <label className="font-semibold mr-2">{columnDefinition.name}</label>
        <textarea
          className="block border px-2 py-1 w-full h-40 rounded"
          value={!!data ? data : ""}
          disabled={isDisabled}
          onChange={handleChange}
        />
      </div>
    );
  };

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

  const BooleanCell = ({ data, isDisabled = true, updateChange }) => {
    const handleChange = (event) => {
      updateChange(columnDefinition.name, event.target.value);
    };

    return (
      <div className="my-4">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={data === true}
            disabled={isDisabled}
            onChange={handleChange}
          />
          &nbsp;
          {columnDefinition.name}
        </label>
      </div>
    );
  };

  const JSONCheck = ({ data }) => {
    let _status = false;

    try {
      if (!!data.parsed) {
        _status = true;
      }
    } catch (error) {
      // Todo: see if we can give hints on errors
    }

    return (
      <Fragment>
        <div
          className={`text-xs bg-gray-300 px-1 leading-6 ${
            !!_status ? "" : "rounded rounded-t-none"
          }`}
        >
          JSON is {!!_status ? "valid" : "invalid"}
        </div>
        {!!_status && (
          <div className="text-xs bg-gray-400 rounded rounded-t-none p-1">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(data.parsed, null, 2)}
            </pre>
          </div>
        )}
      </Fragment>
    );
  };

  const JSONCell = ({ data, isDisabled = true, updateChange }) => {
    const initialParse = (_data) => {
      // Supposed we are getting this data straight from the API
      // So we try and parse JSON and set the status and internal value
      let _temp = undefined;
      if (_data instanceof Object && "is_dwata_field" in _data) {
        // We have already parsed the raw data into an Object fit for our form handling
        _temp = _data;
      } else {
        // We have not parsed the raw data, let us do that here
        let value = _data;
        if (value === "") {
          value = undefined;
        }
        let parsed = undefined;

        try {
          if (!!value) {
            parsed = JSON.parse(value);
          }
        } catch (error) {
          // Todo: see if we can give hints on errors
        }

        _temp = {
          is_dwata_field: true,
          parsed,
          value,
          payload: !!parsed ? parsed : value,
        };
      }

      return _temp;
    };

    const dwata_data = initialParse(data);

    const handleChange = (event) => {
      let { value } = event.target;
      if (value === "") {
        value = undefined;
      }
      let parsed = undefined;

      try {
        if (!!value) {
          parsed = JSON.parse(value);
        }
      } catch (error) {
        // Todo: see if we can give hints on errors
      }

      updateChange(columnDefinition.name, {
        is_dwata_field: true,
        parsed,
        value,
        payload: !!parsed ? parsed : value,
      });
    };

    return (
      <div className="my-4">
        <label className="font-semibold mr-2">{columnDefinition.name}</label>
        <textarea
          className="block border rounded-b-none px-2 py-1 w-full h-40 rounded"
          value={dwata_data.value !== undefined ? dwata_data.value : ""}
          disabled={isDisabled}
          onChange={handleChange}
        />
        <JSONCheck data={dwata_data} />
      </div>
    );
  };

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
