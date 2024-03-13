import { Component } from "solid-js";
import { darkTheme } from "../../utils/themes";

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
          class={`block w-full rounded-md px-2 py-1.5 ${darkTheme.interactibleWidgetBackgroundAndText} ${darkTheme.interactableWidgetBorder}`}
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
