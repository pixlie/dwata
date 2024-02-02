import { Component, JSX } from "solid-js";
import { useSchema } from "../../stores/schema";
import { useQueryResult } from "../../stores/queryResult";

const GridHead: Component = (props) => {
  const [_, { getColumn }] = useSchema();
  const [queryResult] = useQueryResult();

  const headList: Array<JSX.Element> = [];
  if (!!queryResult.areRowsSelectable) {
    headList.push(<th class="border border-gray-300 px-2 text-left" />);
  }

  if (!queryResult.query) {
    return (
      <tr class="h-10 bg-gray-100">
        <td></td>
      </tr>
    );
  }

  for (const [_, column] of queryResult.query.select.entries()) {
    const columnSpec = getColumn(...column);
    if (!columnSpec) {
      continue;
    }
    if (columnSpec.isPrimaryKey) {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">
          {columnSpec.label}
        </th>
      );
      headList.push(<th class="border border-gray-300 px-2 text-left"></th>);
    } else {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">
          {columnSpec.label}
        </th>
      );
    }
  }

  return <tr class="h-10 bg-gray-100">{headList}</tr>;
};

export default GridHead;
