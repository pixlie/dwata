import { Component } from "solid-js";

interface IPropTypes {
  label: string;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onClick?: () => void;
}

const Button: Component<IPropTypes> = (props) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-xl";
      case "base":
      default:
        return "px-4 py-2 text-base";
    }
  };
  const buttonClasses = `${getSizeClass(
    props.size || "base"
  )} font-bold text-white bg-green-500 hover:bg-green-700 rounded-md select-none cursor-pointer ${
    props.isBlock ? "w-full" : ""
  }`;

  //bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto

  return (
    <button class={buttonClasses} onClick={props.onClick}>
      {props.label}
    </button>
  );
};

export default Button;
