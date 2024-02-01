import { Component, JSX } from "solid-js";
import { useSchema } from "../../stores/schema";

const GridHead: Component = (props) => {
  const [_, { getColumn }] = useSchema();
  const headList: Array<JSX.Element> = [];
  if (!!props.areRowsSelectable) {
    headList.push(<th class="border border-gray-300 px-2 text-left" />);
  }

  for (const [i, column] of props.columns.entries()) {
    const colSpec = getColumn(props.sourceName, props.tableName, column);
    if (!colSpec) {
      continue;
    }
    if (colSpec.isPrimaryKey) {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">{colSpec.label}</th>
      );
      headList.push(<th class="border border-gray-300 px-2 text-left"></th>);
    } else {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">{colSpec.label}</th>
      );
    }
  }

  return <tr class="h-10 bg-gray-100">{headList}</tr>;
};

export default GridHead;
