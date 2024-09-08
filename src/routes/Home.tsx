import { Component } from "solid-js";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import Heading from "../widgets/typography/Heading";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div class="max-w-screen-md mx-auto select-none cursor-default flex flex-col h-full">
      <Heading size={2}>Insights that work.</Heading>
      <Heading size={4}>
        From your emails, files, calendars, Slack and more.
      </Heading>

      <div
        class="mb-4 text-md font-thin p-4 rounded-md opacity-70"
        style={{
          color: getColors().colors["banner.foreground"],
          "background-color": getColors().colors["banner.background"],
        }}
      >
        dwata is in beta! Ready-only access to email accounts and search are
        available.
      </div>

      <div class="grow">
        <div
          class="mb-4 text-xl font-thin"
          style={{ color: getColors().colors["editor.foreground"] }}
        >
          Add your email accounts in app{" "}
          <Button href="/settings" label="Settings" size="sm" />.
        </div>
      </div>

      <div class="flex gap-x-4 my-8">
        <div class="w-24 pt-1">
          <img
            class="rounded-lg"
            src="https://avatars.githubusercontent.com/u/350106?v=4"
            alt="Sumit Datta, founder of dwata"
          />
        </div>

        <div
          class="font-thin"
          style={{ color: getColors().colors["editor.foreground"] }}
        >
          Hello, I am Sumit and I am building dwata. I would love to know how
          dwata can help in your daily workflow. Feel free to{" "}
          <a
            class="font-bold"
            href="https://calendly.com/sumitdatta/quick-chat"
            rel="noopener"
            target="_blank"
          >
            set a call
          </a>{" "}
          if you need help or want to talk.
        </div>
      </div>
    </div>
  );
};

export default Home;
