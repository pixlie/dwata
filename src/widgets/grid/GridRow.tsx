import { Component } from "solid-js";
import { APIGridSchema } from "../../api_types/APIGridSchema";

interface ICellPropTypes {
  data: any;
}

const createGridRow = (
  grids: Array<APIGridSchema>
): Array<Component<ICellPropTypes>> => {
  const contentTextSizeClasses = "text-sm";
  const borderClasses = "border border-gray-700";
  const paddingClasses = "px-1 py-1";

  const DefaultCell: Component<ICellPropTypes> = (innerProps) => (
    <td class={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}>
      {innerProps.data}
    </td>
  );

  const PrimaryKeyCell: Component<ICellPropTypes> = (innerProps) => (
    <td
      class={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses} text-gray-600`}
    >
      {innerProps.data}
    </td>
  );

  const cellList: Array<Component<ICellPropTypes>> = [];
  for (const grid of grids) {
    for (const column of grid.columns) {
      if (!column) {
        // TODO: Remove this when columns no longer has `undefined` items
        cellList.push(() => null);
      } else if (column.isPrimaryKey) {
        cellList.push(PrimaryKeyCell);
      } else {
        cellList.push(DefaultCell);
      }
    }
  }

  return cellList;
};

export default createGridRow;
