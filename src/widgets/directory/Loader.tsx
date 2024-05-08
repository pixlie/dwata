import { Component, createComputed } from "solid-js";
import { useDirectory } from "../../stores/directory";
import { useParams, useSearchParams } from "@solidjs/router";

const Loader: Component = () => {
  const [, { fetchFileList, fetchContents }] = useDirectory();
  const params = useParams();
  const [searchParams] = useSearchParams();

  createComputed(async () => {
    if (!!params.directoryId && !!searchParams.relativeFilePath) {
      await fetchContents(
        params.directoryId as string,
        searchParams.relativeFilePath as string
      );
    } else if (!!params.directoryId) {
      await fetchFileList(params.directoryId as string);
    }
  });

  return <></>;
};

export default Loader;
