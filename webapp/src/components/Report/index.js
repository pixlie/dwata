import React from "react";

import { Section } from "components/BulmaHelpers";
import Grid from "components/Grid";
import NoteEditor from "./NoteEditor";

export default () => {
  return (
    <Section>
      <div className="columns">
        <div className="column is-10">
          <NoteEditor showNotesFor="report/12" />

          <Grid />
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
