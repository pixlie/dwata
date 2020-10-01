import React, { useEffect } from "react";

import * as globalConstants from "services/global/constants";
import { QueryContext } from "utils";
import { useQuerySpecification, useQueryContext } from "services/store";
import { Hx, Button } from "components/LayoutHelpers";
import Grid from "components/Grid";

export default () => {
  const key = "data-sources";
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);

  useEffect(() => {
    initiateQuerySpecification(key, {
      sourceLabel: "dwata_meta",
      select: [
        {
          label: "dwata_meta_data_sources.*",
          tableName: "dwata_meta_data_sources",
          columnName: "*",
        },
      ],
      fetchNeeded: true,
    });
  }, []);

  const handleCreateClick = () => {
    toggleDetailItem({
      sourceLabel: "dwata_meta",
      tableName: "dwata_meta_data_sources",
      operation: globalConstants.OBJECT_CREATE,
    });
  };

  return (
    <div>
      <Hx x="3">Data sources</Hx>

      <QueryContext.Provider value={{ key }}>
        <Grid showPaginator={false} />
      </QueryContext.Provider>

      <Button attributes={{ onClick: handleCreateClick }}>
        Add a data source
      </Button>
    </div>
  );
};
