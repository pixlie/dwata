import { Component, For, createMemo } from "solid-js";
import { useDirectory } from "../../stores/directory";
import FileItem from "./FileItem";

const FileList: Component = () => {
  const [store] = useDirectory();

  const getFileList = createMemo(() => store.fileList);

  return <For each={getFileList()}>{(file) => <FileItem {...file} />}</For>;
};

export default FileList;
