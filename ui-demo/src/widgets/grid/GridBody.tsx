import { Component, createMemo } from "solid-js";
import createGridRow from "./GridRow";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridBody: Component = () => {
  const [_, { getColumnListForColumnPathList }] = useSchema();
  const [queryResult] = useQueryResult();

  const cellList = createMemo(() =>
    createGridRow(getColumnListForColumnPathList(queryResult.query!.select))
  );

  const rowList = createMemo(() =>
    queryResult.isReady ? queryResult.result?.data.rows : []
  );

  return (
    <tbody>
      {rowList()?.map((row) => (
        <tr class="text-white">
          {cellList().map((Cell, index) => (
            <Cell data={row[index]} />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default GridBody;
