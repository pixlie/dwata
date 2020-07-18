import React from "react";

const matchPath = () => ({});

export const transformData = (columns, row) =>
  row.reduce(
    (acc, cur, i) => ({
      ...acc,
      [columns[i]]: cur,
    }),
    {}
  );

export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

/*
export const getItemPartsFromPath = (pathname) => {
  const match = matchPath(pathname, {
    path: "/browse/:sourceId/:tableName/:pk",
    exact: true,
    strict: false,
  });
  if (match !== null && "params" in match) {
    return match;
  }

  return null;
};

export const getCacheKey = (state, savedQuery) => {
  if (
    !!state &&
    state.router &&
    state.router.location &&
    state.router.location.pathname
  ) {
    const fromPath = getSourceFromPath(state.router.location.pathname);
    if (fromPath) {
      const {
        params: { sourceId, tableName },
      } = fromPath;
      return `${sourceId}/${tableName}`;
    }
  } else if (!!savedQuery) {
    const sourceId = savedQuery.source_id;
    const tableName = savedQuery.table_name;
    const fromPath = getSourceFromPath(`/browse/${sourceId}/${tableName}`);
    if (fromPath) {
      const {
        params: { sourceId, tableName },
      } = fromPath;
      return `${sourceId}/${tableName}`;
    }
  }
  return null;
};

export const createCacheKeyFromParts = (sourceId, tableName) => {
  return `${sourceId}/${tableName}`;
};
*/

export const QueryContext = React.createContext({});
QueryContext.displayName = "QueryContext";
