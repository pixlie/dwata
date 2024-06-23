import { Component, JSX, createMemo } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  label: string;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  href?: string;
}

const Button: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const getSizeClass = createMemo(() => {
    switch (props.size) {
      case "sm":
        return "px-2.5 py-1.5 text-sm font-thin";
      case "lg":
        return "px-6 py-3 text-xl font-bold";
      case "base":
      default:
        return "px-4 py-2 text-base font-normal";
    }
  });

  const buttonClasses =
    getSizeClass() +
    " rounded-md select-none cursor-pointer hover:shadow-lg " +
    `${props.isBlock ? "w-full" : ""}`;
  const styles = {
    color: getColors().colors["button.foreground"],
    "background-color": getColors().colors["button.background"],
  };

  if (!!props.href) {
    return (
      <a class={buttonClasses} href={props.href} style={styles}>
        {props.label}
      </a>
    );
  } else if (!!props.onClick) {
    return (
      <button class={buttonClasses} style={styles} onClick={props.onClick}>
        {props.label}
      </button>
    );
  } else {
    return (
      <button class={buttonClasses} style={styles}>
        {props.label}
      </button>
    );
  }
};

export default Button;
