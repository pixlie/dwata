import React, { useEffect } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";
import Grid from "components/Grid";

const AdminTables = () => {
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
  }, [initiateQuerySpecification]);

  return (
    <div>
      <Hx x="3">Tables</Hx>

      <QueryContext.Provider value={{ key }}>
        {/* <GridNav size={"sm"} showRelated={false} /> */}
        <div className="my-2" />
        <Grid showPaginator={false} />
      </QueryContext.Provider>
    </div>
  );
};

export default AdminTables;
