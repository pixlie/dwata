import { Component, JSX } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { IFormField } from "../../utils/types";

const TextArea: Component<IFormField> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const handleChange: JSX.ChangeEventHandler<HTMLTextAreaElement, Event> = (
    event,
  ) => {
    if (!!props.onChange) {
      props.onChange(props.name, event.currentTarget.value);
    }
  };

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100 mb-2">
          {props.label}
        </label>
      )}
      <textarea
        required={props.isRequired !== null ? props.isRequired : false}
        class="block w-full rounded-md px-2 py-1.5 border text-lg"
        style={{
          "background-color": getColors().colors["input.background"],
          "border-color": getColors().colors["input.border"],
          color: getColors().colors["input.foreground"],
        }}
        placeholder={props.placeholder !== null ? props.placeholder : ""}
        value={props.value || ""}
        onChange={handleChange}
      />
    </>
  );
};

export default TextArea;
