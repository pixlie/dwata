import { Component, For, createMemo, createSignal } from "solid-js";
import { darkTheme } from "../../utils/themes";
import DropdownItem from "./DropdownItem";

interface IPropTypes {
  label: string;
  choices: { [key: string]: string };
  value?: string | number;
  isRequired?: boolean;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onSelect?: (newValue: string) => void;
}

interface IWidgetState {
  isOpen: boolean;
  selected?: {
    key: string;
    value: string;
  };
}

const Dropdown: Component<IPropTypes> = (props) => {
  const [widgetState, setWidgetState] = createSignal<IWidgetState>({
    isOpen: false,
  });
  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2.5 py-1.5 text-sm font-normal";
      case "lg":
        return "px-6 py-3 text-xl font-bold";
      case "base":
      default:
        return "px-4 py-2 text-base font-normal";
    }
  };

  const buttonClasses = `${getSizeClass(
    props.size || "base"
  )} rounded-md select-none cursor-pointer ${darkTheme.interactibleWidgetBackgroundAndText} ${darkTheme.interactableWidgetBorder} ${
    props.isBlock ? "w-full" : ""
  }`;

  const getLabel = createMemo(() => {
    if (!!widgetState().selected) {
      return widgetState().selected!.value;
    } else {
      return props.label;
    }
  });

  const handlClick = () => {
    setWidgetState({ ...widgetState(), isOpen: !widgetState().isOpen });
  };

  const handleChoiceSelect = (selected: string) => {
    setWidgetState({
      ...widgetState(),
      isOpen: false,
      selected: {
        key: selected,
        value: props.choices[selected],
      },
    });
  };

  return (
    <div class="relative">
      <button class={buttonClasses} onClick={handlClick}>
        {getLabel()} <i class="ml-1 fa-solid fa-chevron-down" />
      </button>
      {!!widgetState().isOpen && (
        <div class="absolute top-10 z-10">
          <For each={Object.entries(props.choices)}>
            {([key, value]) => (
              <DropdownItem
                key={key}
                label={value}
                onSelect={handleChoiceSelect}
              />
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
