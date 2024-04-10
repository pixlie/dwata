import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  label?: string;
  placeholder?: string;
  value?: string;
  isRequired?: boolean;
  onInput?: (newValue: string) => void;
}

const TextArea: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100 mb-2">
          {props.label}
        </label>
      )}
      <textarea
        required={props.isRequired}
        class="block w-full rounded-md px-2 py-1.5 border"
        style={{
          "background-color": getColors().colors["input.background"],
          "border-color": getColors().colors["input.border"],
          color: getColors().colors["input.foreground"],
        }}
        placeholder={props.placeholder}
        value={props.value || ""}
        onInput={(e) => props.onInput?.(e.currentTarget.value)}
      />
    </>
  );
};

export default TextArea;
