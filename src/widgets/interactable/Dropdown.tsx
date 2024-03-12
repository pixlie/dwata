import { Component } from "solid-js";

interface IPropTypes {
  label: string;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onSelect?: () => void;
}

const Dropdown: Component<IPropTypes> = (props) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2.5 py-1.5 text-sm font-normal";
      case "lg":
        return "px-6 py-3 text-xl font-bold";
      case "base":
      default:
        return "px-4 py-2 text-base font-normal";
    }
  };

  const buttonClasses = `${getSizeClass(
    props.size || "base"
  )} text-white bg-green-600 hover:bg-green-700 rounded-md select-none cursor-pointer ${
    props.isBlock ? "w-full" : ""
  }`;

  const handlClick = () => {};

  return (
    <button class={buttonClasses} onClick={handlClick}>
      {props.label} <i class="fa-solid fa-chevron-down" />
    </button>
  );
};

export default Dropdown;
