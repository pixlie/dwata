import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import { invoke } from "@tauri-apps/api/core";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

  const handleGoogleAuth = async () => {
    await invoke("google_oauth2");
  };

  const handleReadEmail = async () => {
    await invoke("read_inbox");
  };

  return (
    <div class="max-w-screen-md">
      <Heading size="6xl">Welcome to dwata</Heading>
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
        Note: Dwata is free to use, but you will be charged by AI provider for
        the API usage.
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
        Text <Button onClick={handleGoogleAuth} size="sm" label="Google Auth" />
      </p>

      <p style={{ color: getColors().colors["editor.foreground"] }}>
        <Button onClick={handleReadEmail} size="sm" label="Read email" />
      </p>
    </div>
  );
};

export default Home;
