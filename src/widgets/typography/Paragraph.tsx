import { Component } from "solid-js";

interface IPropTypes {
  size?: "sm" | "base" | "lg";
  children: string;
}

const Paragraph: Component<IPropTypes> = (props) => {
  const getSizeClass = (size?: string) => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };
  const paragraphClasses = `${getSizeClass(
    props.size
  )} text-gray-300 select-none cursor-default`;

  return <p class={paragraphClasses}>{props.children}</p>;
};

export default Paragraph;
