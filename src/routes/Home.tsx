import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

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
        To get started, please do the following:
      </p>

      <ul
        class="mb-4 list-decimal"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        <li class="ml-8">
          <a href="/user" class="underline text-blue-600">
            Create your account
          </a>{" "}
          (stored on your computer)
        </li>
        <li class="ml-8">
          <a href="/settings/ai-provider/add" class="underline text-blue-600">
            Add an AI provider
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Home;
