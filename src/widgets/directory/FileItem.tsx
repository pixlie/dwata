import { Component } from "solid-js";
import { APIFileNode } from "../../api_types/APIFileNode";

const FileItem: Component<APIFileNode> = (props) => {
  return (
    <div class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700 cursor-pointer">
      <i
        class={`${props.isFolder ? "fa-solid fa-folder" : "fa-solid fa-file"} mr-1.5 text-sm text-gray-500`}
      />
      {props.relativePath}
    </div>
  );
};

export default FileItem;
