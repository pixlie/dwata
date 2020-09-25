import React, { useEffect } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";
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
          label: "dwata_meta_data_sources",
          tableName: "dwata_meta_data_sources",
        },
      ],
      fetchNeeded: true,
    });
  }, []);

  return (
    <div>
      <Hx x="3">Data sources</Hx>

      <QueryContext.Provider value={{ key }}>
        <Grid />
      </QueryContext.Provider>
    </div>
  );
};
