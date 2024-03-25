import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IDropdownItemProps {
  label: string;
  href?: string;

  // key and onSelect can be used to set selected value
  key?: number | string;
  onSelect?: (selected: number | string) => void;
}

const DropdownItem: Component<IDropdownItemProps> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const handleClick = () => {
    if (!!props.onSelect) {
      props.onSelect(props.key || props.label);
    }
  };

  return (
    <span
      class="block text-left px-4 py-1 text-sm cursor-pointer"
      style={{
        color: getColors().colors["input.foreground"],
      }}
      role="menuitem"
      tabindex="-1"
      onClick={handleClick}
    >
      {props.label}
    </span>
  );
};

export default DropdownItem;
