import { Component, JSX } from "solid-js";

interface IPropTypes {
  size: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  children: JSX.Element | string;
}

const Heading: Component<IPropTypes> = (props): JSX.Element => {
  // We need this function in order to tell Tailwind CSS exact and full size classes, so it will include all of these.
  // Otherwise, Tailwind will not include them in the final CSS file.
  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "2xl":
        return "text-2xl";
      case "3xl":
        return "text-3xl";
      case "4xl":
        return "text-4xl";
      case "5xl":
        return "text-5xl";
      case "6xl":
        return "text-6xl";
      default:
        return "text-base";
    }
  };
  const headingClasses = `${getSizeClass(
    props.size
  )} block font-bold text-zinc-300 select-none cursor-default`;

  return <span class={headingClasses}>{props.children}</span>;
};

export default Heading;
