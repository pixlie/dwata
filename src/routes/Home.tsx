import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <>
      <div class="max-w-screen-sm">
        <Heading size="3xl">Welcome to Dwata</Heading>
        <div class="mb-4" />

        <p
          class="mb-4"
          style={{ color: getColors().colors["editor.foreground"] }}
        >
          Dwata is a desktop app to chat with multiple AI models. Dwata uses API
          access to AI models with your API credentials. All chats are stored on
          your computer.
        </p>

        <p
          class="mb-4 italic"
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
    </>
  );
};

export default Home;
