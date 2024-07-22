import {
  Component,
  For,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import TextInput from "../widgets/interactable/TextInput";
import { invoke } from "@tauri-apps/api/core";
import { IFormFieldValue } from "../utils/types";
import { useSearchParams } from "@solidjs/router";
import { useWorkspace } from "../stores/workspace";
import { SearchResult } from "../api_types/SearchResult";
import { SearchableEmail } from "../api_types/SearchableEmail";
import { EmailAccount } from "../api_types/EmailAccount";

const SearchResultItem: Component<SearchableEmail> = (props) => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="text-lg font-normal border border-b-0 p-1"
      style={{
        color: getColors().colors["editor.foreground"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      {props.id}: {props.subject}
    </div>
  );
};

const EmailAccountBox: Component<EmailAccount> = (props) => {
  const [searchParams] = useSearchParams();

  const handleRefetchGoogleAccessToken = async () => {
    if (!!searchParams.emailAccountId) {
      await invoke("refetch_google_access_token", {
        pk: parseInt(searchParams.emailAccountId),
      });
    }
  };

  const handleFetchEmails = async () => {
    if (!!searchParams.emailAccountId) {
      await invoke("fetch_emails", {
        pk: parseInt(searchParams.emailAccountId),
      });
    }
  };

  const handleCreateCollection = async () => {
    if (!!searchParams.emailAccountId) {
      await invoke("create_collection_in_typesense", {
        pk: parseInt(searchParams.emailAccountId),
      });
    }
  };

  const handleIndexEmails = async () => {
    if (!!searchParams.emailAccountId) {
      await invoke("index_emails", {
        pk: parseInt(searchParams.emailAccountId),
      });
    }
  };

  const handleStoreEmailsInDb = async () => {
    if (!!searchParams.emailAccountId) {
      await invoke("store_emails_in_db", {
        pk: parseInt(searchParams.emailAccountId),
      });
    }
  };

  return (
    <>
      <Heading size="xl">Searching {props.emailAddress}</Heading>
      {props.provider === "gmail" ? (
        <Button
          onClick={handleRefetchGoogleAccessToken}
          size="sm"
          label="Refresh access tokens"
        />
      ) : null}
      <div class="my-2" />
      <Button onClick={handleFetchEmails} size="sm" label="Fetch emails" />
      <div class="my-2" />
      <Button
        onClick={handleCreateCollection}
        size="sm"
        label="Create search index"
      />
      {"  for emails"}
      <div class="my-2" />
      <Button onClick={handleIndexEmails} size="sm" label="Index emails" />
      <div class="my-2" />
      <Button
        onClick={handleStoreEmailsInDb}
        size="sm"
        label="Store emails in DB"
      />
    </>
  );
};

const Search: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const [searchParams] = useSearchParams();
  const [workspace, { readModuleList }] = useWorkspace();
  const [_data, { refetch }] = createResource(async () => {
    await readModuleList("EmailAccount");
  });

  onMount(() => {
    refetch();
  });

  const [formData, setFormData] = createSignal<{
    [key: string]: IFormFieldValue;
  }>({});
  const [results, { mutate: _m, refetch: search }] =
    createResource<SearchResult>(async () => {
      let results: SearchResult = {
        found: 0,
        hits: [],
      };
      if (!!formData().query && (formData()!.query! as string).length >= 1) {
        const pkList = !!searchParams.emailAccountId
          ? [parseInt(searchParams.emailAccountId)]
          : workspace.EmailAccount.map((x) => x.id);
        results = await invoke<SearchResult>("search_emails", {
          pkList,
          query: formData().query,
        });
      }
      return results;
    });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));

    search();
  };

  return (
    <div class="flex flex-row gap-4">
      <div class="grow max-w-screen-md">
        <Heading size="3xl">Search emails</Heading>
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
            {(result) => (
              <div class="my-4">
                <Heading size="xl">{result.collectionName}</Heading>
                <For each={result.hits}>
                  {(item) => <SearchResultItem {...item.document} />}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>

      <div
        class="max-w-96"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        {!!searchParams.emailAccountId ? (
          <EmailAccountBox
            {...workspace.EmailAccount.filter(
              (x) => x.id === parseInt(searchParams.emailAccountId!),
            )[0]}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Search;
