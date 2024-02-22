import { Component, JSX, createMemo } from "solid-js";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridHead: Component = () => {
  const [_, { getColumnListForColumnPathList }] = useSchema();
  const [queryResult] = useQueryResult();
  const thClass =
    "px-2 py-1 cursor-pointer hover:bg-gray-800 font-semibold border border-gray-700";

  if (!queryResult.query || !queryResult.query.select) {
    return (
      <tr>
        <td>Loading</td>
      </tr>
    );
  }

  const getHeadList = createMemo(() => {
    const headList: Array<JSX.Element> = [];
    if (!!queryResult.areRowsSelectable) {
      headList.push(<th class={thClass} />);
    }

    for (const [_, columnSpec] of getColumnListForColumnPathList(
      queryResult.query!.select
    ).entries()) {
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
    return headList;
  });

  return <tr class="bg-gray-700 text-left text-gray-100">{getHeadList()}</tr>;
};

export default GridHead;
