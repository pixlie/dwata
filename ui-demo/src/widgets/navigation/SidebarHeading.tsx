import { Component } from "solid-js";

interface IPropTypes {
  label: string;
  icon: string;
}

const SidebarHeading: Component<IPropTypes> = (props) => {
  return (
    <div class="mt-4 block cursor-default select-none px-3 text-lg text-gray-500">
      <i class={`${props.icon} mr-1.5 text-gray-500`} />
      {props.label}
    </div>
  );
};

export default SidebarHeading;
