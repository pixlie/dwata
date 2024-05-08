import { Component, For, createMemo } from "solid-js";
import { useDirectory } from "../../stores/directory";

const Paragraph: Component = (props) => {
  return (
    <p class="border border-gray-700 mb-1 rounded-sm px-2 text-gray-200">
      {props.children}
    </p>
  );
};

const FileContents: Component = () => {
  // We return a list of all the components that are headings or paragraphs
  const [store] = useDirectory();

  const getContents = createMemo(() => {
    return store.contents;
  });

  return (
    <For each={getContents()}>
      {([index, content]) => {
        if ("Paragraph" in content) {
          return <Paragraph>{content.Paragraph}</Paragraph>;
        }
      }}
    </For>
  );
};

export default FileContents;
