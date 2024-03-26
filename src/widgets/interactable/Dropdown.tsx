import { Component, For, createMemo, createSignal } from "solid-js";
import DropdownItem from "./DropdownItem";
import DropdownHeading from "./DropdownHeading";
import { useUserInterface } from "../../stores/userInterface";

export interface IKeyedChoice {
  key: number | string;
  label: string;
}

export interface IChoicesWithHeading {
  name: string;
  choices: Array<IKeyedChoice>;
}

interface IPropTypes {
  label: string;
  choices?: Array<IKeyedChoice>;
  choicesWithHeadings?: Array<IChoicesWithHeading>;
  value?: string | number;
  isRequired?: boolean;
  size?: "sm" | "base" | "lg";
  isBlock?: boolean;
  onSelect?: (newValue: number | string) => void;
}

interface IWidgetState {
  isOpen: boolean;
}

const Dropdown: Component<IPropTypes> = (props) => {
  const [widgetState, setWidgetState] = createSignal<IWidgetState>({
    isOpen: false,
  });
  const [_, { getColors }] = useUserInterface();
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
  )} rounded-md select-none cursor-pointer border ${props.isBlock && "w-full"}`;

  const getLabel = createMemo(() => {
    if (!!props.value && !!props.choices) {
      return (
        props.label +
        ": " +
        props.choices?.find((x) => x.key === props.value)?.label
      );
    } else if (!!props.value && !!props.choicesWithHeadings) {
      const choiceHead = props.choicesWithHeadings.find((x) =>
        x.choices.find((y) => y.key === props.value)
      );
      const choice = choiceHead?.choices.find(
        (y) => y.key === props.value
      )?.label;
      return props.label + ": " + choiceHead?.name + " / " + choice;
    } else {
      return props.label;
    }
  });

  const handlClick = () => {
    setWidgetState({ isOpen: !widgetState().isOpen });
  };

  const handleChoiceSelect = (selected: number | string) => {
    setWidgetState({
      isOpen: false,
    });

    if (!!props.onSelect) {
      props.onSelect(selected);
    }
  };

  return (
    <div class="relative">
      <button
        class={buttonClasses}
        onClick={handlClick}
        style={{
          "background-color": getColors().colors["input.background"],
          "border-color": getColors().colors["input.border"],
          color: getColors().colors["input.foreground"],
        }}
      >
        {getLabel()} <i class="ml-1 fa-solid fa-chevron-down" />
      </button>
      {!!widgetState().isOpen && (
        <div
          class="absolute top-10 z-10 border"
          style={{
            "background-color": getColors().colors["input.background"],
            "border-color": getColors().colors["input.border"],
          }}
        >
          {!!props.choicesWithHeadings ? (
            <For each={props.choicesWithHeadings}>
              {(heading) => (
                <>
                  <DropdownHeading label={heading.name} />
                  <For each={heading.choices}>
                    {(choice) => (
                      <DropdownItem
                        key={choice.key}
                        label={choice.label}
                        onSelect={handleChoiceSelect}
                      />
                    )}
                  </For>
                </>
              )}
            </For>
          ) : (
            <For each={props.choices}>
              {(choice) => (
                <DropdownItem
                  key={choice.key}
                  label={choice.label}
                  onSelect={handleChoiceSelect}
                />
              )}
            </For>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
