import { Component } from "solid-js";
import Loader from "../widgets/directory/Loader";
import { DirectoryProvider } from "../stores/directory";
import FileList from "../widgets/directory/FileList";

const FolderBrowser: Component = () => {
  return (
    <DirectoryProvider>
      <Loader />

      <div class="flex flex-row w-full overflow-hidden">
        <FileList />
      </div>
    </DirectoryProvider>
  );
};

export default FolderBrowser;
