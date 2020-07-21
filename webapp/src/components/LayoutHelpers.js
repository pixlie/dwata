import React, { Fragment } from "react";

export const Hero = ({
  size = "",
  textCentered = false,
  style = {},
  children,
}) => (
  <section className={`hero ${size}`} style={style}>
    <div className="hero-body">
      <div className={`container${textCentered ? " has-text-centered" : null}`}>
        {children}
      </div>
    </div>
  </section>
);

export const Section = ({ size = "", style = {}, children }) => (
  <section className={`section ${size}`} style={style}>
    <div className="container">{children}</div>
  </section>
);

export const Hx = ({ x = "3", titleClass = "title", children }) => {
  const xSizeClass = {
    1: "text-5xl",
    2: "text-4xl",
    3: "text-3xl",
    4: "text-2xl",
    5: "text-xl",
    6: "text-lg",
  };
  return React.createElement(
    `h${x}`,
    { className: `${titleClass} ${xSizeClass[x]}` },
    children
  );
};

export const Box = ({ title, message, children }) => {
  return (
    <div className="box">
      {title ? (
        <Hx x="4" titleclassName="subtitle">
          {title}
        </Hx>
      ) : null}
      {message ? <p>{message}</p> : null}
      {children}
    </div>
  );
};

export const Button = ({
  label,
  size = "medium",
  theme = "primary",
  active = false,
  disabled = false,
  padding = "px-3 py-1",
  margin = "mr-6",
  rounded = "rounded",
  attributes,
  children,
}) => {
  let classes = `inline-block text-md font-bold shadow hover:shadow-sm ${rounded} ${padding} ${margin}`;
  if (theme === "primary") {
    classes =
      classes + " bg-blue-400 text-gray-800 hover:bg-blue-700 hover:text-white";
  } else if (theme === "secondary") {
    classes =
      classes + " bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white";
  } else if (theme === "info") {
    classes =
      classes +
      " bg-yellow-200 text-gray-700 hover:bg-yellow-700 hover:text-white";
  }

  return (
    <button className={classes} {...attributes} disabled={disabled}>
      {label}
      {children}
    </button>
  );
};

export const ButtonGroup = ({
  size = "medium",
  theme = "primary",
  hasGap = false,
  attributes,
  buttons,
}) => {
  const rounded = Array(buttons.length).fill("rounded");
  if (!hasGap) {
    rounded.fill("");
    rounded[0] = "rounded-l";
    rounded[buttons.length - 1] = "rounded-r";
  }

  return (
    <Fragment>
      {buttons.map((button, i) => (
        <Button
          key={`btgr-${i}`}
          rounded={rounded[i]}
          label={button.label}
          theme={theme}
          margin={!hasGap ? "" : "mr-2"}
          attributes={{ ...attributes, ...button.attributes }}
        >
          {button.inner}
        </Button>
      ))}
    </Fragment>
  );
};

export const ColumnHead = ({ label, order, group, attributes, children }) => {
  let classes =
    "label inline-block bg-gray-200 px-2 rounded font-bold cursor-pointer hover:bg-gray-400";
  if (order) {
    if (order === "asc") {
      classes = classes + " ord-asc";
    } else {
      classes = classes + " ord-desc";
    }
  }

  return (
    <th className="col-hd text-left">
      <span className={classes} {...attributes}>
        {label}
      </span>
      {children}
    </th>
  );
};

export const Panel = ({ title, hasSearch, hasTabs, children }) => (
  <div className="bg-white shadow-md border rounded">
    <div className="bg-gray-200">
      <span className="block text-2xl font-bold px-4 py-2">{title}</span>
    </div>
    {hasSearch ? (
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    ) : null}
    {hasTabs ? <p className="panel-tabs"></p> : null}
    {children}
  </div>
);

export const Modal = ({ callerRef, theme = "white", children }) => {
  let classes = "fixed z-10 shadow-lg p-4 rounded-md border";
  if (theme === "light") {
    classes = classes + " bg-gray-100";
  } else if (theme === "white") {
    classes = classes + " bg-white";
  }

  return (
    <div className={classes} style={{ top: "70px" }}>
      {children}
    </div>
  );
};
