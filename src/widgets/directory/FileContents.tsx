import { Component, For, createMemo } from "solid-js";
import { useDirectory } from "../../stores/directory";
import Heading from "../typography/Heading";

interface IParagraphPropTypes {
  text: string;
}

const Paragraph: Component<IParagraphPropTypes> = (props) => {
  return (
    <p class="border border-gray-700 mb-1 rounded-sm px-2 text-gray-200">
      {props.text}
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
          return <Paragraph text={content.Paragraph}></Paragraph>;
        } else if ("Heading" in content) {
          return <Heading size="xl">{content.Heading}</Heading>;
        }
      }}
    </For>
  );
};

export default FileContents;
