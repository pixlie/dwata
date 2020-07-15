import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useData, useQuerySpecification } from "services/store";
import { Button } from "components/LayoutHelpers";

const PageItem = ({ number }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const gotoPage = useQuerySpecification((state) => state.gotoPage);

  let offset = null,
    limit = null;
  if (querySpecification) {
    ({ offset, limit } = querySpecification);
  }
  const currentPage = Math.floor(offset / limit) + 1;

  const handleGotoPage = () => {
    gotoPage(queryContext.key, number);
  };

  return (
    <Button
      active={number === currentPage ? true : false}
      attributes={{
        "aria-label": `Goto page ${number}`,
        onClick: handleGotoPage,
      }}
    >
      {number}
    </Button>
  );
};

const PageSlots = () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );

  if (!(querySpecification && querySpecification.isReady)) {
    return null;
  }

  let count = null,
    limit = null;
  if (querySpecification) {
    ({ count, limit } = querySpecification);
  }
  const slots = 9; // Includes all page numbers to be shown and ellipses
  const totalPages = Math.ceil(count / limit);

  if (totalPages < slots) {
    return (
      <ul className="pagination-list">
        <li>
          <span className="pagination-ellipsis">{limit}/page</span>
        </li>
        {[...Array(totalPages).keys()].map((x) => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="pagination-list">
        <li>
          <span className="pagination-ellipsis">{limit}/page</span>
        </li>
        {[...Array(4).keys()].map((x) => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} />
        ))}
        <li>
          <span className="pagination-ellipsis">&hellip;</span>
        </li>
        {[...Array(4).keys()].reverse().map((x) => (
          <PageItem key={`pg-sl-${totalPages - x}`} number={totalPages - x} />
        ))}
      </ul>
    );
  }
};

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const nextPage = useQuerySpecification((state) => state.nextPage);
  const previousPage = useQuerySpecification((state) => state.previousPage);

  if (
    !(data && data.isReady && querySpecification && querySpecification.isReady)
  ) {
    return null;
  }
  let count = null,
    offset = null,
    limit = null;
  if (querySpecification) {
    ({ count, offset, limit } = querySpecification);
  }

  const handleNext = (event) => {
    event.preventDefault();
    nextPage(queryContext.key);
  };

  const handlePrevious = (event) => {
    event.preventDefault();
    previousPage(queryContext.key);
  };

  return (
    <div id="paginator">
      <nav className="pagination" role="navigation" aria-label="pagination">
        {offset < limit ? (
          <Button disabled>Previous</Button>
        ) : (
          <Button attributes={{ onClick: handlePrevious }}>Previous</Button>
        )}
        {offset + limit >= count ? (
          <Button disabled>Next page</Button>
        ) : (
          <Button attributes={{ onClick: handleNext }}>Next page</Button>
        )}
        <PageSlots />
      </nav>
    </div>
  );
};
