import { Component, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";

interface INavigationButtonProps {
  label: string;
  path: string;
  onClick?: () => void;
}

const NavigationButtom: Component<INavigationButtonProps> = (props) => {
  const location = useLocation();
  const currentPath = createMemo(() => location.pathname);

  const classes = createMemo(
    () =>
      `${
        currentPath() === props.path && "underline"
      } bg-gray-900 hover:bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm font-medium`
  );

  return (
    <a href={props.path} class={classes()}>
      {props.label}
    </a>
  );
};

export default NavigationButtom;
