import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import { File } from "../../api_types/File";

const FileItem: Component<File> = (props) => {
  const params = useParams();

  return (
    <a
      class="px-2 block rounded-md py-0.5 text-sm whitespace-nowrap overflow-hidden text-gray-200 hover:bg-zinc-700 cursor-pointer"
      href={`/directory/${params.directoryId}/?relativeFilePath=${props.relativePath}`}
    >
      <i
        class={`${props.isDirectory ? "fa-solid fa-folder" : "fa-solid fa-file"} mr-1.5 text-sm text-gray-500`}
      />
      {props.relativePath}
    </a>
  );
};

export default FileItem;
