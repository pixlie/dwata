import { Component } from "solid-js";

interface IPropTypes {
  name: string;
  label?: string;
  path?: string;
}

const SidebarItem: Component<IPropTypes> = (props) => {
  const icon = "fa-solid fa-table";
  const label = props.label || props.name;

  if (!!props.path) {
    return (
      <a
        href={props.path}
        class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700"
      >
        <i class={`${icon} mr-1.5 text-sm text-gray-500`} />
        {label}
      </a>
    );
  }

  return (
    <div class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700">
      <i class={`${icon} mr-1.5 text-sm text-gray-500`} />
      {label}
    </div>
  );
};

export default SidebarItem;
