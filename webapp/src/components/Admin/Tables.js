import React, { useEffect } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Hx, Button } from "components/LayoutHelpers";
import Grid from "components/Grid";

export default () => {
  const key = "data-sources";
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );

  useEffect(() => {
    initiateQuerySpecification(key, {
      sourceLabel: "dwata_meta",
      select: [
        {
          label: "dwata_meta_tables.*",
          tableName: "dwata_meta_tables",
          columnName: "*",
        },
      ],
      fetchNeeded: true,
    });
  }, []);

  return (
    <div>
      <Hx x="3">Tables</Hx>

      <QueryContext.Provider value={{ key }}>
        <Grid showPaginator={false} />
      </QueryContext.Provider>

      <div className="mt-4 flex justify-end">
        <Button margin="" size="sm">
          Refresh tables
        </Button>
      </div>
    </div>
  );
};
