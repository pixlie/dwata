import { Component, JSX, createMemo } from "solid-js";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridHead: Component = () => {
  const [_, { getSpecListForColumnList: getColumns }] = useSchema();
  const [queryResult] = useQueryResult();
  const thClass = "px-2 py-1 cursor-pointer hover:bg-gray-800 font-semibold";

  const headList: Array<JSX.Element> = [];
  if (!!queryResult.areRowsSelectable) {
    headList.push(<th class={thClass} />);
  }

  if (!queryResult.query || !queryResult.query.select) {
    return (
      <tr>
        <td>Loading</td>
      </tr>
    );
  }

  const columnsSpec = createMemo(() => getColumns(queryResult.query!.select));

  for (const [_, columnSpec] of columnsSpec().entries()) {
    if (!columnSpec) {
      continue;
    }
    if (columnSpec.isPrimaryKey) {
      headList.push(<th class={thClass}>{columnSpec.name}</th>);
      headList.push(<th class={thClass}></th>);
    } else {
      headList.push(<th class={thClass}>{columnSpec.name}</th>);
    }
  }

  return <tr class="bg-gray-700 text-left text-gray-100">{headList}</tr>;
};

export default GridHead;
