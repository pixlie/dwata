import { Component } from "solid-js";
import { gitHubDark } from "../../utils/colors";

interface IDropdownHeadingProps {
  label: string;
}

const DropdownHeading: Component<IDropdownHeadingProps> = (props) => {
  const classes = `block w-full text-left px-2 py-1 text-sm font-bold cursor-default ${gitHubDark.inactiveWidgetBackgroundAndText}`;

  return (
    <span class={classes} role="menuitem" tabindex="-1">
      {props.label}
    </span>
  );
};

export default DropdownHeading;
