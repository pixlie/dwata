import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import TextInput from "../widgets/interactable/TextInput";

const Search: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div class="max-w-screen-md">
      <Heading size="6xl">Search anything</Heading>
      <div class="mb-4" />
      <TextInput
        name="query"
        label="What are you looking for?"
        contentType="Text"
        contentSpec={{}}
      />

      <p style={{ color: getColors().colors["editor.foreground"] }}>
        To get started, please{" "}
        <Button
          href="/settings/ai-integration/add"
          size="sm"
          label="add an AI provider"
        />
      </p>
    </div>
  );
};

export default Search;
