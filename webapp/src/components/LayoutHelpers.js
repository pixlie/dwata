import React, { Fragment, useCallback, useEffect } from "react";

import { tableColorWhiteOnMedium, tableColorBlackOnLight } from "utils";

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

export const Hx = ({ x = "3", children }) => {
  const xSizeClass = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-md",
  };
  return React.createElement(
    `h${x}`,
    { className: `text-gray-700 pl-3 ${xSizeClass[x]}` },
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
  size = "md",
  theme = "primary",
  active = false,
  disabled = false,
  padding = "px-3 py-1",
  margin = "mx-1",
  rounded = "rounded",
  attributes,
  children,
}) => {
  let classes = `inline-block font-bold shadow hover:shadow-sm ${rounded} ${padding} ${margin}`;
  if (theme === "primary") {
    classes =
      classes + " bg-blue-400 text-gray-800 hover:bg-blue-700 hover:text-white";
  } else if (theme === "secondary") {
    classes =
      classes + " bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white";
  } else if (theme === "info") {
    classes =
      classes +
      (active ? " bg-yellow-400" : " bg-yellow-200") +
      " text-gray-700 hover:bg-yellow-700 hover:text-white";
  } else if (theme === "link") {
    classes = "inline-block font-bold underline";
  }

  if (["sm", "md", "lg"].includes(size)) {
    classes = classes + ` text-${size}`;
  } else {
    classes = classes + " text-md";
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

export const ColumnHead = ({
  label,
  order,
  tableColor,
  attributes,
  children,
}) => {
  let classes =
    "label inline-block px-2 rounded font-bold cursor-pointer text-gray-700 hover:text-gray-900";
  classes = classes + ` ${tableColorBlackOnLight(tableColor)}`;
  if (order) {
    if (order === "asc") {
      classes = classes + " ord-asc";
    } else {
      classes = classes + " ord-desc";
    }
  }

  return (
    <th className="mb-4 text-left">
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

export const Modal = ({
  callerPosition,
  theme = "white",
  maxWidth = "lg",
  toggleModal,
  children,
}) => {
  // Notes is a modal and we handle the Esc key to hide the modal
  const handleKey = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        toggleModal();
      }
    },
    [toggleModal]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    };
  }, [handleKey]);

  let classes = `fixed z-10 shadow-lg p-4 rounded-md border max-w-${maxWidth}`;
  if (theme === "light") {
    classes = classes + " bg-gray-100";
  } else if (theme === "white") {
    classes = classes + " bg-white";
  } else if (theme === "info") {
    classes = classes + " bg-yellow-200";
  }
  const style = {
    top: "70px",
  };
  if (!!callerPosition) {
    style.top = callerPosition.top + 36 + "px";
    style.left = callerPosition.left;
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};
