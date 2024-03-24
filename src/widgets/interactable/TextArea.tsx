import { Component } from "solid-js";
import { darkTheme } from "../../utils/themes";

interface IPropTypes {
  label?: string;
  placeholder?: string;
  value?: string;
  isRequired?: boolean;
  onInput?: (newValue: string) => void;
}

const TextArea: Component<IPropTypes> = (props) => {
  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100">
          {props.label}
        </label>
      )}
      <div class="mt-2">
        <textarea
          required={props.isRequired}
          class={`block w-full rounded-md px-2 py-1.5 ${darkTheme.interactibleWidgetBackgroundAndText} ${darkTheme.interactableWidgetBorder}`}
          placeholder={props.placeholder}
          value={props.value || ""}
          onInput={(e) => props.onInput?.(e.currentTarget.value)}
        />
      </div>
    </>
  );
};

export default TextArea;
