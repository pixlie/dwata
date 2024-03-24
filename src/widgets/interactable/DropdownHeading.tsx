import { Component } from "solid-js";
import { darkTheme } from "../../utils/themes";

interface IDropdownHeadingProps {
  label: string;
}

const DropdownHeading: Component<IDropdownHeadingProps> = (props) => {
  const classes = `block w-full text-left px-2 py-1 text-sm font-bold cursor-default ${darkTheme.inactiveWidgetBackgroundAndText}`;

  return (
    <span class={classes} role="menuitem" tabindex="-1">
      {props.label}
    </span>
  );
};

export default DropdownHeading;
