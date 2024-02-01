import { Component } from "solid-js";

interface IPropTypes {
  label: string;
  icon: string;
  path?: string;
}

const SidebarItem: Component<IPropTypes> = (props) => {
  return (
    <a
      href={props.path ? props.path : "#"}
      class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700"
    >
      <i class={`${props.icon} mr-1.5 text-sm text-gray-500`} />
      {props.label}
    </a>
  );
};

export default SidebarItem;
