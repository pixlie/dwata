import { Component, createSignal } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import Heading from "../typography/Heading";

interface IHelpState {
  openSection?: "googleOAauth2" | "gmail" | "protonMail" | "yahooMail";
}

const SetupEmail: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const [helpState, setHelpState] = createSignal<IHelpState>({});

  const handleOpenHelpSection = (
    sectionName: "googleOAauth2" | "gmail" | "protonMail" | "yahooMail",
  ) => {
    setHelpState({ openSection: sectionName });
  };

  return (
    <div
      class="rounded-md p-4 mx-auto shadow-md"
      style={{
        "background-color": getColors().colors["editorWidget.background"],
        color: getColors().colors["editor.foreground"],
      }}
    >
      <Heading size={3}>Instructions</Heading>
      <div class="font-thin">
        Click any of the following to see how you can connect to that email
        provider.
      </div>

      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col">
          <div
            class="text-xl cursor-pointer"
            onClick={() => handleOpenHelpSection("googleOAauth2")}
          >
            Google OAuth2 app
          </div>
          <span class="text-sm font-thin">
            One app can be used for multiple personal and Workspace Gmail
            accounts
          </span>

          {helpState().openSection === "googleOAauth2" && (
            <div class="list-decimal flex flex-col font-thin">
              <li>
                Setup a new or login to{" "}
                <a
                  href="https://console.cloud.google.com"
                  rel="noopener"
                  target="_blank"
                  class="underline"
                >
                  Google Cloud Console
                </a>{" "}
                account
              </li>
              <li>
                Create a{" "}
                <a
                  href="https://console.cloud.google.com/projectcreate"
                  rel="noopener"
                  target="_blank"
                  class="underline"
                >
                  new Project
                </a>{" "}
                (dropdown beside top left logo)
              </li>
              <li>
                Check that correct project is selected (dropdown beside top left
                logo)
              </li>
              <li>
                Go to Menu (left of Google Cloud logo) &gt;{" "}
                <strong class="font-bold">APIs &amp; Services</strong> &gt;{" "}
                <strong class="font-bold">Enabled APIs &amp; services</strong>
              </li>
              <li>
                Click{" "}
                <strong class="font-bold uppercase">
                  + Enable APIs and Services
                </strong>{" "}
                (below search box)
              </li>
              <li>On the next page, search "Gmail"</li>
              <li>
                Click the result titled{" "}
                <strong class="font-bold">Gmail API</strong>
              </li>
              <li>
                Click <strong class="font-bold uppercase">Enable</strong>
              </li>
            </div>
          )}
        </div>

        <div class="flex flex-col">
          <div
            class="text-xl cursor-pointer"
            onClick={() => handleOpenHelpSection("gmail")}
          >
            Gmail account
          </div>
          <span class="text-sm font-thin">
            Needs Google OAuth2 app (see above)
          </span>
        </div>

        <div class="flex flex-col">
          <div
            class="text-xl cursor-pointer"
            onClick={() => handleOpenHelpSection("protonMail")}
          >
            Proton Mail account
          </div>
          <span class="text-sm font-thin">
            Uses{" "}
            <a
              href="https://proton.me/mail/bridge"
              rel="noopener"
              target="_blank"
              class="underline"
            >
              Proton Mail Bridge
            </a>
            , needs{" "}
            <a
              href="https://proton.me/support/imap-smtp-and-pop3-setup"
              rel="noopener"
              target="_blank"
              class="underline"
            >
              paid Proton Mail
            </a>{" "}
            account
          </span>
        </div>

        <div class="flex flex-col">
          <div
            class="text-xl cursor-pointer"
            onClick={() => handleOpenHelpSection("yahooMail")}
          >
            Yahoo! Mail account
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupEmail;
