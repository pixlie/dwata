import { Component, createMemo } from "solid-js";
import createGridRow from "./GridRow";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridBody: Component = () => {
  const [_, { getSchemaForGrid }] = useSchema();
  const [queryResult] = useQueryResult();

  const cellList = createMemo(() =>
    createGridRow(
      queryResult.query.map((x) =>
        getSchemaForGrid(x.source, x.schema, x.table)
      )
    )
  );

  const gridList = createMemo(() =>
    queryResult.isReady ? queryResult.data : []
  );

  return (
    <tbody class="">
      {gridList().length >= 1 &&
        gridList()[0].rows.map((_, rowIndex) => (
          <tr class="text-white">
            {cellList().map((Cell, cellIndex) => (
              <Cell
                data={
                  gridList().flatMap((grid) => grid.rows[rowIndex])[cellIndex]
                }
              />
            ))}
          </tr>
        ))}
    </tbody>
  );
};

export default GridBody;
