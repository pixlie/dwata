import React from "react";

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
    1: "text-5xl md:text-6xl",
    2: "text-4xl md:text-5xl",
    3: "text-3xl md:text-4xl",
    4: "text-2xl md:text-3xl",
    5: "text-xl md:text-2xl",
    6: "text-xl",
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
  color = "blue",
  active = false,
  disabled = false,
  attributes,
  children,
}) => (
  <button
    className="inline-block text-md px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-800 mr-6"
    {...attributes}
    disabled={disabled}
  >
    {children}
  </button>
);

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
