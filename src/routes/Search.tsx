import { Component, For, createResource, createSignal } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import TextInput from "../widgets/interactable/TextInput";
import { invoke } from "@tauri-apps/api/core";
import { IFormFieldValue } from "../utils/types";
import { Email } from "../api_types/Email";
import { TypesenseSearchResult } from "../api_types/TypesenseSearchResult";

const SearchResultItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="text-lg font-normal border border-b-0 p-1"
      style={{
        color: getColors().colors["editor.foreground"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      {props.subject}
    </div>
  );
};

const Search: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const [formData, setFormData] = createSignal<{
    [key: string]: IFormFieldValue;
  }>({});
  const [results, { mutate: _m, refetch: search }] =
    createResource<TypesenseSearchResult>(async () => {
      if (!!formData().query && (formData()!.query! as string).length >= 1) {
        return await invoke("search_emails", {
          pk: 1,
          query: formData().query,
        });
      }
      return {
        found: 0,
        hits: [],
      } as TypesenseSearchResult;
    });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));

    search();
  };

  const handleRefetchGoogleAccessToken = async () => {
    await invoke("refetch_google_access_token", { pk: 1 });
  };

  const handleFetchEmails = async () => {
    await invoke("fetch_emails", {
      pk: 1,
    });
  };

  const handleCreateCollection = async () => {
    await invoke("create_collection_in_typesense", {
      pk: 1,
    });
  };

  const handleIndexEmails = async () => {
    await invoke("index_emails", {
      pk: 1,
    });
  };

  return (
    <div class="flex flex-row gap-4">
      <div class="grow max-w-screen-md">
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

        <div class="mt-8">
          <For each={results()?.hits}>
            {(result) => <SearchResultItem {...result.document} />}
          </For>
        </div>
      </div>

      <div
        class="max-w-96"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        <Button
          onClick={handleRefetchGoogleAccessToken}
          size="sm"
          label="Refetch"
        />{" "}
        Google access tokens
        <div class="my-2" />
        <Button
          onClick={handleCreateCollection}
          size="sm"
          label="Create search index"
        />
        {"  for emails"}
        <div class="my-2" />
        <Button onClick={handleFetchEmails} size="sm" label="Fetch emails" />
        <div class="my-2" />
        <Button onClick={handleIndexEmails} size="sm" label="Index emails" />
      </div>
    </div>
  );
};

export default Search;
