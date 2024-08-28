import { Component } from "solid-js";
import { useUserInterface } from "../stores/userInterface";
import Button from "../widgets/interactable/Button";
import Heading from "../widgets/typography/Heading";

const Home: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div class="max-w-screen-md mx-auto select-none cursor-default flex flex-col h-full">
      <Heading size={2}>
        Emails, calendars, contacts, files, Slack, blogs and much more.
      </Heading>

      <div
        class="mb-4 text-xl font-thin"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        dwata is in beta and many features are on the way. Right now you can add
        your email accounts. To get started:
      </div>

      <div class="grow">
        <div
          class="mb-4 text-xl font-thin"
          style={{ color: getColors().colors["editor.foreground"] }}
        >
          Add your email accounts (dwata needs IMAP access) by going to
          Settings.
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
