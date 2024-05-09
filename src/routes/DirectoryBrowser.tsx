import { Component } from "solid-js";
import Loader from "../widgets/directory/Loader";
import { DirectoryProvider } from "../stores/directory";
import FileList from "../widgets/directory/FileList";
import FileContents from "../widgets/directory/FileContents";
import Heading from "../widgets/typography/Heading";

const DirectoryBrowser: Component = () => {
  return (
    <DirectoryProvider>
      <Loader />

      <div class="flex gap-4 h-full">
        <div class="w-1/5 pr-3 border-r border-gray-500 overflow-y-auto">
          <Heading size="xl">Files</Heading>
          <FileList />
        </div>

        <div class="w-4/5 px-2 overflow-y-auto">
          <FileContents />
        </div>
      </div>
    </DirectoryProvider>
  );
};

export default DirectoryBrowser;
