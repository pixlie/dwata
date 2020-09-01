import React from 'react';


export const Hero = ({ size = "", extraClasses = "", textCentered = false, id, style = {}, children }) => (
  <section className={`block clear-both py-40 ${extraClasses}`} style={style} id={id}>
    <div className="">
      {children}
    </div>
  </section>
);


export const Section = ({ extraClasses = "", style = {}, id = null, children }) => (
  <section className={`block clear-both py-24 ${extraClasses}`} style={style} id={id}>
    <div className="container mx-auto">
      { children }
    </div>
  </section>
);


export const Hx = ({ x = "3", titleClass = "title", children }) => {
  const xSizeClass = {
    1: "text-5xl md:text-6xl",
    2: "text-4xl md:text-5xl",
    3: "text-3xl md:text-4xl",
    4: "text-2xl md:text-3xl",
    5: "text-xl md:text-2xl",
    6: "text-xl"
  }
  return React.createElement(`h${x}`, {className: `${titleClass} ${xSizeClass[x]}`}, children);
}


export const Box = ({ title, message, children }) => {
  return (
    <div className="max-w-xl my-12 p-6 bg-gray-100 shadow">
      { title ? <Hx x="4">{title}</Hx> : null }
      { message ? (
        <p className="text-lg">{message}</p>
      ) : null }
      { children }
    </div>
  );
}


export const DataTable = ({ thead, children }) => (
  <div className="table-container">
    <table className="table is-narrow is-fullwidth">
      { thead }
      { children }
    </table>
  </div>
);


export const Panel = ({ title, hasSearch, hasTabs, children }) => (
  <nav className="panel">
    <p className="panel-heading">
      { title }
    </p>
    { hasSearch ? (
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    ) : null }
    { hasTabs ? (
      <p className="panel-tabs">
      </p>
    ) : null }
    { children }
  </nav>
);