import React from "react";

export const Hero = ({
  gap = "py-24",
  extraClasses = "",
  id,
  style = {},
  children,
}) => (
  <div className={`${gap} ${extraClasses}`} style={style} id={id}>
    <div className="max-w-screen-lg md:py-4 md:mx-auto">{children}</div>
  </div>
);

export const FeatureImageBox = ({
  heading,
  subHeading = null,
  extraClasses = "",
  id = null,
  imageSrc,
  imageAlt,
}) => (
  <div className={`py-24 ${extraClasses}`} id={id}>
    <div className="max-w-screen-lg md:mx-auto">
      <Hx x="3">{heading}</Hx>
      {subHeading ? (
        <p className="my-4 text-lg text-gray-700 font-bold">{subHeading}</p>
      ) : null}
    </div>

    <div
      className="max-w-screen-xl mx-auto rounded-lg border-4"
      style={{ maxHeight: "700px", overflow: "hidden" }}
    >
      <img className="w-full" src={imageSrc} alt={imageAlt} />
    </div>
  </div>
);

export const Hx = ({ x = "3", titleClass = "title", children }) => {
  const xSizeClass = {
    1: "text-5xl md:text-6xl leading-tight",
    2: "text-4xl md:text-5xl leading-tight",
    3: "text-3xl md:text-4xl leading-tight",
    4: "text-2xl md:text-3xl leading-tight",
    5: "text-xl md:text-2xl leading-tight",
    6: "text-xl leading-tight",
  };
  return React.createElement(
    `h${x}`,
    { className: `${titleClass} ${xSizeClass[x]}` },
    children
  );
};

export const Box = ({ title, message, children }) => {
  return (
    <div className="max-w-xl my-12 p-6 bg-gray-100 shadow">
      {title ? <Hx x="4">{title}</Hx> : null}
      {message ? <p className="text-lg">{message}</p> : null}
      {children}
    </div>
  );
};
