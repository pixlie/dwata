import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { nextPage } from "services/queryEditor/actions";


const PageItem = ({ number, currentPage }) => (
  <li><a className={`pagination-link${number === currentPage ? " is-current" : ""}`} aria-label={`Goto page ${number}`}>{number}</a></li>
);


const Paginator = ({ meta: {isReady, count, limit, offset}, nextPage }) => {
  if (!isReady) {
    return null;
  }
  const currentPage = ((limit + offset) % limit) + 1;

  return (
    <div id="paginator">
      <nav className="pagination" role="navigation" aria-label="pagination">
        <a className="pagination-previous">Previous</a>
        <a className="pagination-next">Next page</a>
        <ul className="pagination-list">
          <li><span className="pagination-ellipsis">{limit}/page</span></li>
          <PageItem number={1} currentPage={currentPage} />
          <li><span className="pagination-ellipsis">&hellip;</span></li>
          {/* <li><a className="pagination-link" aria-label="Goto page 45">45</a></li> */}
          {/* <li><a className="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li> */}
          <li><a className="pagination-link" aria-label={`Goto page ${Math.floor(count/limit)/2}`}>{Math.floor(count/limit)/2}</a></li>
          {/* <li><a className="pagination-link" aria-label="Goto page 47">47</a></li> */}
          <li><span className="pagination-ellipsis">&hellip;</span></li>
          <li><a className="pagination-link" aria-label={`Goto page ${Math.floor(count/limit)}`}>{Math.floor(count/limit)}</a></li>
        </ul>
      </nav>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;

  return {
    sourceId,
    tableName,
    meta: state.browser.isReady && state.browser._cacheKey === _browserCacheKey ? {
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
    nextPage: event => {
      event.preventDefault();
      nextPage();
    }
  }
)(Paginator));