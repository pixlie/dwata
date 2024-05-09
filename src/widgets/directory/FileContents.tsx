import { Component, For, createMemo } from "solid-js";
import { useDirectory } from "../../stores/directory";
import Heading from "../typography/Heading";
import Button from "../interactable/Button";
import { useParams, useSearchParams } from "@solidjs/router";

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
  const [store, { generateEmbeddings }] = useDirectory();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const getContents = createMemo(() => {
    return store.contents;
  });

  const handleGenerateEmdeddings = () => {
    generateEmbeddings(
      params.directoryId as string,
      searchParams.relativeFilePath as string,
    );
  };

  return (
    <>
      <div class="m-2">
        <Button
          onClick={handleGenerateEmdeddings}
          label="Generate emdeddings"
          size="sm"
        />
      </div>

      <For each={getContents()}>
        {([index, content]) => {
          if ("Paragraph" in content) {
            return <Paragraph text={content.Paragraph}></Paragraph>;
          } else if ("Heading" in content) {
            return <Heading size="xl">{content.Heading}</Heading>;
          }
        }}
      </For>
    </>
  );
};

export default FileContents;
