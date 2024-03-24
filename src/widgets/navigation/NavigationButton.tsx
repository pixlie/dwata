import { Component, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";

interface INavigationButtonProps {
  label: string;
  href: string;
  onClick?: () => void;
}

const NavigationButtom: Component<INavigationButtonProps> = (props) => {
  const location = useLocation();
  const currentPath = createMemo(() => location.pathname);

  const classes = createMemo(
    () =>
      `${
        currentPath() === props.href ? "font-bold" : "font-medium"
      } bg-gray-900 hover:bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm`
  );

  return (
    <a href={props.href} class={classes()}>
      {props.label}
    </a>
  );
};

export default NavigationButtom;
