import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getCacheKey } from "utils";
import { nextPage, previousPage, gotoPage } from "services/querySpecification/actions";


const PageItem = ({number, currentPage, gotoPage}) => {
  const handleGotoPage = event => {
    event.preventDefault();
    gotoPage(number);
  }
  
  return (
    <li><a className={`pagination-link${number === currentPage ? " is-current" : ""}`} aria-label={`Goto page ${number}`} onClick={handleGotoPage} href={`?page=${number}`}>{number}</a></li>
  );
}


const PageSlots = ({count, limit, offset, gotoPage}) => {
  const slots = 9;  // Includes all page numbers to be shown and ellipses
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  if (totalPages < slots) {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(totalPages).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(4).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
        <li><span className="pagination-ellipsis">&hellip;</span></li>
        {[...Array(4).keys()].reverse().map(x => (
          <PageItem key={`pg-sl-${totalPages - x}`} number={totalPages - x} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
      </ul>
    );
  }
}


const Paginator = ({isReady, count, limit, offset, handleNext, handlePrevious, gotoPage}) => {
  if (!isReady) {
    return null;
  }

  return (
    <div id="paginator">
      <nav className="pagination" role="navigation" aria-label="pagination">
        {offset < limit ? (
          <span className="pagination-previous" disabled>Previous</span>
        ) : (
          <span className="pagination-previous" onClick={handlePrevious}>Previous</span>
        )}
        {offset + limit >= count ? (
          <span className="pagination-next" disabled>Next page</span>
        ) : (
          <span className="pagination-next" onClick={handleNext}>Next page</span>
        )}
        <PageSlots count={count} limit={limit} offset={offset} gotoPage={gotoPage} />
      </nav>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let {sourceId, tableName} = props.match.params;
  sourceId = parseInt(sourceId);
  const cacheKey = getCacheKey(state);
  let isReady = false;

  if (state.querySpecification.isReady && state.querySpecification.cacheKey === cacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      count: state.querySpecification.count,
      limit: state.querySpecification.limit,
      offset: state.querySpecification.offset,
    };
  } else {
    return {
      isReady,
    };
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
    },

    gotoPage,
  }
)(Paginator));