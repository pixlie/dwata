import { Component, createSignal, onMount } from "solid-js";
import Grid from "../widgets/grid/Grid";
import Loader from "../widgets/browser/Loader";
import { QueryResultProvider } from "../stores/queryResult";
import TableBrowser from "../widgets/browser/TableBrowser";

const QueryBrowser: Component = () => {
  let queryBrowserRef;
  const [boxDimensions, setDimensions] = createSignal<{
    width: number;
    height: number;
  }>({
    width: 96,
    height: 96,
  });

  onMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(queryBrowserRef);
  });

  return (
    <QueryResultProvider>
      <Loader />

      <div class="relative h-full" ref={queryBrowserRef}>
        <TableBrowser />
        <Grid />

        {/* <div class="mt-2 px-3">
          <span class="cursor-default select-none font-bold text-white">
            Ask AI
          </span>
          <textarea class="mt-2 h-24 w-full grow-0 rounded-md border border-gray-500 bg-zinc-800 p-3 text-gray-50"></textarea>
        </div> */}
      </div>
    </QueryResultProvider>
  );
};

export default QueryBrowser;
