import { Component } from "solid-js";

interface IPropTypes {
  type: "text" | "email" | "password";
  label?: string;
  placeholder?: string;
  value?: string | number;
  isRequired?: boolean;
  onInput?: (newValue: string | number) => void;
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
          class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 outline-none placeholder:text-gray-400 hover:bg-yellow-100 focus:bg-yellow-100"
          placeholder={props.placeholder}
          value={props.value || ""}
          onInput={(e) => props.onInput?.(e.currentTarget.value)}
        />
      </div>
    </>
  );
};

export default TextInput;
