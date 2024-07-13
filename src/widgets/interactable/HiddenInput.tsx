import { Component } from "solid-js";
import { IFormField } from "../../utils/types";

const HiddenInput: Component<IFormField> = (props) => {
  return (
    <input
      type="hidden"
      name={props.name}
      value={!!props.value ? props.value : ""}
    />
  );
};

export default HiddenInput;
