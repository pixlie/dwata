import { Component, onMount } from "solid-js";
import { useDirectory } from "../../stores/directory";
import { useSearchParams } from "@solidjs/router";

const Loader: Component = () => {
  const [, { fetchFileList }] = useDirectory();
  const [searchParams] = useSearchParams();

  // TODO: Fetch file list when folder changes
  onMount(async () => {
    if (!!searchParams.directoryId) {
      await fetchFileList(searchParams.directoryId as string);
    }
  });

  return <></>;
};

export default Loader;
