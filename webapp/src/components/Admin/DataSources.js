import React, { useEffect } from "react";

import * as globalConstants from "services/global/constants";
import { refreshTables } from "services/apps/actions";
import { QueryContext } from "utils";
import { useQuerySpecification, useQueryContext } from "services/store";
import GridNav from "components/Navbar/GridNav";
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
      isRowSelectable: true,
      actions: [
        {
          label: "Refresh tables",
          isVisibleWhen: (qs) => qs.isRowSelectable,
          isEnabledWhen: ({ querySpecification, data, selected }) =>
            querySpecification.isRowSelectable &&
            selected.selectedList.length > 0,
          handler: ({ selected }) =>
            refreshTables({
              source_label_list: selected.selectedList.map((x) => x[2]),
            }),
        },
      ],
    });
  }, []);

  const handleCreateClick = () => {
    toggleDetailItem({
      sourceLabel: "dwata_meta",
      tableName: "dwata_meta_data_sources",
      operation: globalConstants.OBJECT_CREATE,
    });
  };

  const Actions = ({}) => {
    return (
      <Button margin="" size="sm" attributes={{ onClick: handleClickRefresh }}>
        Refresh tables
      </Button>
    );
  };

  const handleClickRefresh = async () => {
    await refreshTables({
      sourceLabel: "",
    });
  };

  return (
    <div>
      <Hx x="3">Data sources</Hx>

      <QueryContext.Provider value={{ key }}>
        <GridNav showRelated={false} size="sm" />
        <div className="my-2" />
        <Grid showPaginator={false} />
      </QueryContext.Provider>

      <div className="mt-4 flex justify-end">
        <Button margin="" size="sm" attributes={{ onClick: handleCreateClick }}>
          Add a data source
        </Button>
      </div>
    </div>
  );
};
