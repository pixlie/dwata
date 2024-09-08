import { Component } from "solid-js";
import Home from "../assets/icons/Home";
import Inbox from "../assets/icons/Inbox";
import AddressBook from "../assets/icons/AddressBook";
import Folder from "../assets/icons/Folder";
import Insight from "../assets/icons/Insight";

interface IPropTypes {
  iconName: string;
  size?: "sm" | "lg";
}

const GetIcon: Component<IPropTypes> = (props) => {
  const classes = "inline-block w-7 shrink-0";

  switch (props.iconName) {
    case "address-book":
      return <AddressBook class={classes} />;
    case "inbox":
      return <Inbox class={classes} />;
    case "folder":
      return <Folder class={classes} />;
    case "insight":
      return <Insight class={classes} />;
    case "home":
    default:
      return <Home class={classes} />;
  }
};

export default GetIcon;
