import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
  infoTag?: string;
  size?: "sm" | "md" | "lg";
}

const NavigationLink: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  let sizeClasses = "mx-2 my-1 px-2 py-1.5";
  if (props.size === "sm") {
    sizeClasses = "mx-2 my-0.5 px-2 py-0.5 font-thin";
  } else if (props.size === "lg") {
    sizeClasses = "mx-2 my-1.5 px-3 py-2";
  }

  const Tag = () =>
    !!props.infoTag ? (
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2 font-normal">
          {props.infoTag}
        </span>
      </div>
    ) : null;

  if (!!props.href) {
    return (
      <a
        class={
          sizeClasses +
          " block select-none rounded hover:bg-zinc-700 " +
          (!!props.isActive ? "font-bold" : "")
        }
        style={{
          color: getColors().colors["sideBar.foreground"],
        }}
        href={props.href}
      >
        <i
          class={`${props.icon} w-6`}
          style={{ color: getColors().colors["sideBar.foreground"] }}
        />
        {props.label}
        <Tag />
      </a>
    );
  } else {
    return (
      <div class={sizeClasses + " select-none rounded"}>
        <i class={`${props.icon} w-6 text-gray-500`} />
        {props.label}
        <Tag />
      </div>
    );
  }
};

export default NavigationLink;
