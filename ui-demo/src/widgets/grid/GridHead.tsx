import { Component, JSX } from "solid-js";
import { IColumn, ISort } from "../../utils/types";

interface IPropTypes {
  columns: Array<IColumn>;
  visible?: Array<string>;
  sorting?: Array<ISort>;
  areRowsSelectable?: boolean;
}

const GridHead: Component<IPropTypes> = (props) => {
  const headList: Array<JSX.Element> = [];
  if (!!props.areRowsSelectable) {
    headList.push(<th class="border border-gray-300 px-2 text-left" />);
  }

  for (const [i, column] of props.columns.entries()) {
    if (column.isPrimaryKey) {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">{column.label}</th>
      );
      headList.push(<th class="border border-gray-300 px-2 text-left"></th>);
    } else {
      headList.push(
        <th class="border border-gray-300 px-2 text-left">{column.label}</th>
      );
    }
  }

  return <tr class="h-10 bg-gray-100">{headList}</tr>;
};

export default GridHead;
