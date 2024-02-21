import { Component } from "solid-js";
import { open } from "@tauri-apps/api/dialog";

import Button from "./Button";

interface IPropTypes {
  label?: string;
  placeholder?: string;
  value?: string | number;
  isRequired?: boolean;
  onChange?: (newValue: string) => void;
}

const FolderInput: Component<IPropTypes> = (props) => {
  const handleOpenRequest = async () => {
    let selectedPath = await open({
      title: "Please select a folder",
      multiple: false,
      directory: true,
    });

    if (!!selectedPath) {
      if (typeof selectedPath === "object") {
        selectedPath = selectedPath[0] as string;
      }
      props.onChange?.(selectedPath);
    }
  };

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100">
          {props.label}
        </label>
      )}
      <div class="mt-2 flex">
        <Button label="Select a Folder" onClick={handleOpenRequest} />
        <span class="ml-6 text-gray-400 flex-grow py-1.5 text-sm">
          {props.value || "None selected"}
        </span>
      </div>
    </>
  );
};

export default FolderInput;
