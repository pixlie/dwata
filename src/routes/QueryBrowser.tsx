import { Component } from "solid-js";
import Grid from "../widgets/grid/Grid";
import Loader from "../widgets/browser/Loader";
import { QueryResultProvider } from "../stores/queryResult";
import SourceBrowser from "../widgets/browser/SourceBrowser";

const QueryBrowser: Component = () => {
  return (
    <QueryResultProvider>
      <Loader />

      <div class="flex flex-col h-full relative">
        <SourceBrowser />
        <div class="grow">
          <Grid />
        </div>

        <div class="mt-2 px-3">
          <span class="cursor-default select-none font-bold text-white">
            Ask AI
          </span>
          <textarea class="mt-2 h-24 w-full grow-0 rounded-md border border-gray-500 bg-zinc-800 p-3 text-gray-50"></textarea>
        </div>
      </div>
    </QueryResultProvider>
  );
};

export default QueryBrowser;
