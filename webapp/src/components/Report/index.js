import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Section, Hx } from "components/LayoutHelpers";
import Grid from "components/Grid";
import NoteEditor from "./NoteEditor";

const SavedQueryContainer = ({ pk }) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );

  const context = {
    key: `report-new-saved-query-${pk}`,
  };
  initiateQuerySpecification(context.key, {
    sourceLabel: "dwata_meta",
    tableName: "dwata_meta_saved_query",
    pk,
    isSavedQuery: true,
    fetchNeeded: true,
  });

  return (
    <QueryContext.Provider value={context}>
      <Grid />
    </QueryContext.Provider>
  );
};

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );

  return (
    <Section>
      <Hx x="2">Monthly Report</Hx>

      <div className="columns">
        <div className="column is-10">
          <NoteEditor showNotesFor="report/12" />
          <SavedQueryContainer pk={2} />
          <NoteEditor showNotesFor="report/12" />
          <SavedQueryContainer pk={1} />
        </div>

        <div className="column is-2">
          <button className="button is-light">Add data</button>
          <button className="button is-light">Add a Note</button>
          <hr />
          <button className="button is-success">Save Report</button>
        </div>
      </div>
    </Section>
  );
};
