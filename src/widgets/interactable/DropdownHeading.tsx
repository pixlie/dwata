import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IDropdownHeadingProps {
  label: string;
}

const DropdownHeading: Component<IDropdownHeadingProps> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <span
      class="block w-full text-left px-2 py-1 text-sm font-bold cursor-default"
      style={{ color: getColors().colors["input.foreground"] }}
      role="menuitem"
      tabindex="-1"
    >
      {props.label}
    </span>
  );
};

export default DropdownHeading;
