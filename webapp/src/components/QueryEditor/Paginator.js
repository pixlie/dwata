import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Button } from "components/LayoutHelpers";

const PageItem = ({ number }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const gotoPage = useQuerySpecification((state) => state.gotoPage);
  const { offset, limit } = querySpecification;
  const currentPage = Math.floor(offset / limit) + 1;

  const handleGotoPage = () => {
    gotoPage(queryContext.key, number);
  };

  return (
    <Button
      active={number === currentPage ? true : false}
      margin="mr-1"
      theme="info"
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
  const { count, limit } = querySpecification;
  const slots = 9; // Includes all page numbers to be shown and ellipses
  const totalPages = Math.ceil(count / limit);

  if (totalPages < slots) {
    return (
      <Fragment>
        <span className="pagination-ellipsis">{limit}/page</span>
        {[...Array(totalPages).keys()].map((x) => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} />
        ))}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <span className="pagination-ellipsis">{limit}/page</span>
        {[...Array(4).keys()].map((x) => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} />
        ))}
        <li>
          <span className="pagination-ellipsis">&hellip;</span>
        </li>
        {[...Array(4).keys()].reverse().map((x) => (
          <PageItem key={`pg-sl-${totalPages - x}`} number={totalPages - x} />
        ))}
      </Fragment>
    );
  }
};

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const nextPage = useQuerySpecification((state) => state.nextPage);
  const previousPage = useQuerySpecification((state) => state.previousPage);
  const { count, offset, limit } = querySpecification;

  const handleNext = (event) => {
    event.preventDefault();
    nextPage(queryContext.key);
  };

  const handlePrevious = (event) => {
    event.preventDefault();
    previousPage(queryContext.key);
  };

  return (
    <div
      className="fixed right-0 mr-16 z-10 bg-gray-700 p-2 p-y-4 shadow-lg text-white"
      style={{ bottom: "2rem" }}
    >
      <nav className="pagination" role="navigation" aria-label="pagination">
        {offset < limit ? (
          <Button margin="mr-2" theme="info" disabled>
            Previous
          </Button>
        ) : (
          <Button
            margin="mr-2"
            theme="info"
            attributes={{ onClick: handlePrevious }}
          >
            Previous
          </Button>
        )}
        {offset + limit >= count ? (
          <Button theme="info" disabled>
            Next page
          </Button>
        ) : (
          <Button theme="info" attributes={{ onClick: handleNext }}>
            Next page
          </Button>
        )}
        <PageSlots />
      </nav>
    </div>
  );
};
