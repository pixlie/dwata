import { Component } from "solid-js";
import { IDataSource } from "../../api_types/IDataSource";

interface IPropTypes {
  item: IDataSource;
}

const SidebarItem: Component<IPropTypes> = (props) => {
  const icon = "fa-solid fa-table";
  const name = Object.values(props.item.source)[0].name;
  const label = props.item.label || name;
  const path = `/browse/select[${name}]`;

  return (
    <a
      href={path ? path : "#"}
      class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700"
    >
      <i class={`${icon} mr-1.5 text-sm text-gray-500`} />
      {label}
    </a>
  );
};

export default SidebarItem;
