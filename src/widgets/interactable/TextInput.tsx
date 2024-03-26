import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  type: "text" | "email" | "password";
  label?: string;
  placeholder?: string;
  value?: string | number;
  isRequired?: boolean;
  onInput?: (newValue: string | number) => void;
  onFocus?: () => void;
}

const TextInput: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100">
          {props.label}
        </label>
      )}
      <div class="mt-2">
        <input
          type={props.type || "text"}
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
          onFocus={props.onFocus}
        />
      </div>
    </>
  );
};

export default TextInput;
