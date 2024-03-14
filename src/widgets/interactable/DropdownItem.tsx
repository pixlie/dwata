import { Component, JSX } from "solid-js";
import { darkTheme } from "../../utils/themes";

interface IDropdownItemProps {
  label: string;
  href?: string;

  // key and onSelect can be used to set selected value
  key?: number | string;
  onSelect?: (selected: number | string) => void;

  // This is for traditional click handler
  onClick?: (event: MouseEvent) => void;
}

const DropdownItem: Component<IDropdownItemProps> = (props) => {
  const classes = `block w-full text-left px-4 py-0.5 text-sm ${darkTheme.interactibleWidgetBackgroundAndText}`;

  const handleClick = (event: MouseEvent) => {
    if (!!props.onSelect) {
      props.onSelect(props.key || props.label);
    } else if (!!props.onClick) {
      props.onClick(event);
    }
  };

  if (!!props.onClick || !!props.onSelect) {
    return (
      <button
        class={classes}
        role="menuitem"
        tabindex="-1"
        onClick={handleClick}
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
