import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import { invoke } from "@tauri-apps/api/core";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

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
    <div class="max-w-screen-md">
      <Heading size="3xl">Welcome to dwata</Heading>
      <div class="mb-4" />

      <p
        class="mb-4 text-2xl font-thin"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        dwata is a desktop app to chat with multiple AI (large language) models
        using their API. All chats are stored on your computer.
      </p>

      <p
        class="mb-4 italic text-lg"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        Note: dwata is free to use (for single person usage), but you will be
        charged by AI provider for AI usage in chats or other features.
      </p>

      <p style={{ color: getColors().colors["editor.foreground"] }}>
        To get started, please{" "}
        <Button
          href="/settings/ai-integration/add"
          size="sm"
          label="add an AI provider"
        />
      </p>

      <p style={{ color: getColors().colors["editor.foreground"] }}>
        <Button
          onClick={handleRefetchGoogleAccessToken}
          size="sm"
          label="Refetch"
        />{" "}
        Google access tokens{" "}
        <Button
          onClick={handleCreateCollection}
          size="sm"
          label="Create Collection"
        />
        {"  for emails "}
        <Button
          onClick={handleFetchEmails}
          size="sm"
          label="Fetch emails"
        />{" "}
        <Button onClick={handleIndexEmails} size="sm" label="Index emails" />
      </p>
    </div>
  );
};

export default Home;
