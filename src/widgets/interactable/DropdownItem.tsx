import { Component } from "solid-js";

interface IDropdownItemProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

const DropdownItem: Component<IDropdownItemProps> = (props) => {
  const classes = "block px-4 py-2 text-sm text-gray-700";
  if (!!props.onClick) {
    return (
      <button
        class={classes}
        role="menuitem"
        tabindex="-1"
        onClick={props.onClick}
      >
        {props.label}
      </button>
    );
  } else {
    return (
      <a href={props.href || "#"} class={classes} role="menuitem" tabindex="-1">
        {props.label}
      </a>
    );
  }
};

export default DropdownItem;
