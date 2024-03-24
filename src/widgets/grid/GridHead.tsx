import { Component, JSX, createMemo } from "solid-js";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridHead: Component = () => {
  const [_, { getSchemaForGrid }] = useSchema();
  const [queryResult] = useQueryResult();
  const thClass = "px-4 py-2 cursor-pointer hover:bg-gray-800 font-semibold";

  if (!queryResult.query || !queryResult.query) {
    return (
      <tr>
        <td>Loading</td>
      </tr>
    );
  }

  const getHeadList = createMemo(() => {
    const headList: Array<JSX.Element> = [];
    if (!!queryResult.areRowsSelectable) {
      headList.push(<th scope="col" class={thClass} />);
    }

    for (const gridQuery of queryResult.query) {
      try {
        const gridSchema = getSchemaForGrid(
          gridQuery.source,
          gridQuery.schema,
          gridQuery.table
        );

        for (const columnSpec of gridSchema.columns)
          if (columnSpec.isPrimaryKey) {
            headList.push(
              <th scope="col" class={thClass}>
                {columnSpec.name}
              </th>
            );
            headList.push(<th scope="col" class={thClass}></th>);
          } else {
            headList.push(
              <th scope="col" class={thClass}>
                {columnSpec.name}
              </th>
            );
          }
      } catch {
        continue;
      }
    }
    return headList;
  });

  return (
    <thead class="text-xs uppercase bg-gray-700 text-gray-400">
      <tr class="text-left text-gray-100">{getHeadList()}</tr>
    </thead>
  );
};

export default GridHead;
