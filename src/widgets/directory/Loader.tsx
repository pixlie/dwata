import { Component, createComputed } from "solid-js";
import { useDirectory } from "../../stores/directory";
import { useSearchParams } from "@solidjs/router";

const Loader: Component = () => {
  const [, { fetchFileList, fetchContents }] = useDirectory();
  const [searchParams] = useSearchParams();

  createComputed(async () => {
    if (!!searchParams.directoryId && !!searchParams.relativeFilePath) {
      await fetchContents(
        searchParams.directoryId as string,
        searchParams.relativeFilePath as string
      );
    } else if (!!searchParams.directoryId) {
      await fetchFileList(searchParams.directoryId as string);
    }
  });

  return <></>;
};

export default Loader;
