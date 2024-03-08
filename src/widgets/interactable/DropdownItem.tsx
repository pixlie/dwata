import { Component } from "solid-js";

interface IDropdownItemProps {
  label: string;
  path?: string;
}

const DropdownItem: Component<IDropdownItemProps> = (props) => {
  return (
    <a
      href={props.path || "#"}
      class="block px-4 py-2 text-sm text-gray-700"
      role="menuitem"
      tabindex="-1"
      id="user-menu-item-0"
    >
      {props.label}
    </a>
  );
};

export default DropdownItem;
