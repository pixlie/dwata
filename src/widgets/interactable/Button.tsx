import { Component, createMemo } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  label: string;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onClick?: () => void;
  href?: string;
}

const Button: Component<IPropTypes> = (props) => {
  const getSizeClass = createMemo(() => {
    switch (props.size) {
      case "sm":
        return "px-2.5 py-1.5 text-sm font-normal";
      case "lg":
        return "px-6 py-3 text-xl font-bold";
      case "base":
      default:
        return "px-4 py-2 text-base font-normal";
    }
  });

  const [_, { getColors }] = useUserInterface();
  const buttonClasses =
    getSizeClass() +
    " rounded-md select-none cursor-pointer " +
    `${props.isBlock ? "w-full" : ""}`;
  const styles = {
    color: getColors().colors["button.foreground"],
    "background-color": getColors().colors["button.background"],
  };

  if (!!props.onClick) {
    return (
      <button class={buttonClasses} onClick={props.onClick} style={styles}>
        {props.label}
      </button>
    );
  } else if (!!props.href) {
    return (
      <a class={buttonClasses} href={props.href} style={styles}>
        {props.label}
      </a>
    );
  }
};

export default Button;
