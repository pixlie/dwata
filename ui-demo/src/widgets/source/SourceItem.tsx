import { Component } from "solid-js";

interface IPropTypes {
  label: string;
}

const SourceItem: Component<IPropTypes> = (props) => {
  return <div class="block px-3 py-0.5 text-sm text-white">{props.label}</div>;
};

export default SourceItem;
