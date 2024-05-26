import { Component, For } from "solid-js";
import { IFormField } from "../../utils/types";
import TextInput from "./TextInput";
import { ContentType } from "../../api_types/ContentType";

const TextInputArray: Component<IFormField> = (props) => {
  if (
    props.contentType !== ("TextArray" as ContentType) ||
    !Array.isArray(props.value) ||
    props.value.length === 0
  ) {
    return null;
  }

  const handleInput = (name: string, value: string | number) => {
    if (Array.isArray(props.value) && !!props.onInput) {
      const index = parseInt(name.split("-")[1]);

      props.onInput(props.name, [
        ...props.value?.slice(0, index),
        value as string,
        ...props.value?.slice(index + 1),
      ]);
    }
  };

  return (
    <For each={props.value}>
      {(value, i) => (
        <TextInput
          {...props}
          contentType={"Text" as ContentType}
          onInput={handleInput}
          name={`${props.name}-${i()}`}
          value={value}
        />
      )}
    </For>
  );
};

export default TextInputArray;
