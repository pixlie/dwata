import { Component } from "solid-js";
import { IColumn, TColumnPath } from "../../utils/types";

interface IPropTypes {
  columnSpec: TColumnPath;
  column: IColumn;
  data: any;
}

const GridRow: Component<IPropTypes> = (props) => {
  const contentTextSizeClasses = "text-sm";
  const borderClasses = "border border-gray-300";
  const paddingClasses = "px-1 py-1";

  if (props.column.isPrimaryKey) {
    return <></>;
  }

  return (
    <td class={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}>
      {props.data}
    </td>
  );
};

const createGridRow = (columns: Array<IColumn>) => {};

export default GridRow;
