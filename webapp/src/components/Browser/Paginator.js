import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { nextPage, previousPage } from "services/querySpecification/actions";


const PageItem = ({ number, currentPage }) => (
  <li><a className={`pagination-link${number === currentPage ? " is-current" : ""}`} aria-label={`Goto page ${number}`}>{number}</a></li>
);


const PageSlots = ({count, limit, offset}) => {
  const slots = 9;  // Includes all page numbers to be shown and ellipses
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  const slotComponents = [];
  if (totalPages < slots) {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(totalPages).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(4).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} />
        ))}
        <li><span className="pagination-ellipsis">&hellip;</span></li>
        {[...Array(4).keys()].reverse().map(x => (
          <PageItem key={`pg-sl-${totalPages - x}`} number={totalPages - x} currentPage={currentPage} />
        ))}
      </ul>
    );
  }
}


const Paginator = ({meta: {isReady, count, limit, offset}, handleNext, handlePrevious}) => {
  if (!isReady) {
    return null;
  }

  return (
    <div id="paginator">
      <nav className="pagination" role="navigation" aria-label="pagination">
        {offset < limit ? (
          <a className="pagination-previous" disabled>Previous</a>
        ) : (
          <a className="pagination-previous" onClick={handlePrevious}>Previous</a>
        )}
        {offset + limit >= count ? (
          <a className="pagination-next" disabled>Next page</a>
        ) : (
          <a className="pagination-next" onClick={handleNext}>Next page</a>
        )}
        <PageSlots count={count} limit={limit} offset={offset} />
      </nav>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);

  return {
    sourceId,
    tableName,
    meta: state.browser.isReady && state.browser.sourceId === sourceId && state.browser.tableName === tableName ? {
      count: state.browser.count,
      limit: state.browser.limit,
      offset: state.browser.offset,
      isReady: true,
    } : {
      isReady: false,
    },
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    handleNext: event => {
      event.preventDefault();
      return nextPage();
    },

    handlePrevious: event => {
      event.preventDefault();
      return previousPage();
    }
  }
)(Paginator));