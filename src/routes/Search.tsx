import { Component, createResource, createSignal } from "solid-js";
import Heading from "../widgets/typography/Heading";
// import { useUserInterface } from "../stores/userInterface";
// import Button from "../widgets/interactable/Button";
import TextInput from "../widgets/interactable/TextInput";
import { invoke } from "@tauri-apps/api/core";
import { IFormFieldValue } from "../utils/types";

const Search: Component = () => {
  // const [_, { getColors }] = useUserInterface();
  const [formData, setFormData] = createSignal<{
    [key: string]: IFormFieldValue;
  }>({});
  const [results, { mutate: _m, refetch: search }] = createResource(
    async () => {
      if (!!formData().query && (formData()!.query! as string).length >= 1) {
        await invoke("search_emails", {
          pk: 1,
          query: formData().query,
        });
      }
    },
  );

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));

    search();
  };

  return (
    <div class="max-w-screen-md">
      <Heading size="3xl">Search</Heading>
      <div class="mb-4" />
      <TextInput
        name="query"
        contentType="Text"
        contentSpec={{}}
        isEditable
        onChange={handleChange}
        value={"query" in formData() ? formData().query : undefined}
      />
    </div>
  );
};

export default Search;
