import { Component } from "solid-js";
import Loader from "../widgets/directory/Loader";
import { DirectoryProvider } from "../stores/directory";
import FileList from "../widgets/directory/FileList";
import FileContents from "../widgets/directory/FileContents";

const FolderBrowser: Component = () => {
  return (
    <DirectoryProvider>
      <Loader />

      <div class="flex flex-row w-full overflow-hidden">
        <div class="flex flex-col w-96 border-r-2 border-gray-500">
          <FileList />
        </div>

        <div class="flex flex-col w-full px-6">
          <FileContents />
        </div>
      </div>
    </DirectoryProvider>
  );
};

export default FolderBrowser;
