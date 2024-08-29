import { Component, createSignal } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import Heading from "../typography/Heading";
import Button from "../interactable/Button";

interface IHelpState {
  openSection?:
    | "googleOAuth2"
    | "googleOAuth2Project"
    | "googleOAuth2ConsentScreen"
    | "googleOAuth2Credentials"
    | "gmail"
    | "protonMail"
    | "yahooMail";
}

const SetupEmail: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const [helpState, setHelpState] = createSignal<IHelpState>({});

  const handleOpenHelpSection = (
    sectionName:
      | "googleOAuth2"
      | "googleOAuth2Project"
      | "googleOAuth2ConsentScreen"
      | "googleOAuth2Credentials"
      | "gmail"
      | "protonMail"
      | "yahooMail",
  ) => {
    setHelpState({ openSection: sectionName });
  };

  return (
    <div class="flex flex-col gap-y-4">
      <div
        style={{
          color: getColors().colors["editor.foreground"],
        }}
      >
        <Heading size={4}>Instructions</Heading>
        <div class="font-thin">
          Click any section to see how you can connect with dwata.
        </div>
      </div>

      <div
        class="rounded-md p-4 mx-auto drop-shadow-md w-full"
        style={{
          "background-color": getColors().colors["editorWidget.background"],
          color: getColors().colors["editor.foreground"],
        }}
      >
        <div onClick={() => handleOpenHelpSection("googleOAuth2")}>
          <Heading size={4}>Google OAuth</Heading>
          <div class="text-sm font-thin">
            One app can be used for multiple personal and Workspace Gmail
            accounts
          </div>
        </div>

        {helpState().openSection?.includes("googleOAuth2") && (
          <div class="flex flex-col gap-y-2">
            <div
              class="text-xl cursor-pointer"
              onClick={() => handleOpenHelpSection("googleOAuth2Project")}
            >
              Google Cloud project
            </div>

            {helpState().openSection === "googleOAuth2Project" && (
              <div class="list-decimal flex flex-col font-thin gap-y-1">
                <li>
                  Setup a new or login to{" "}
                  <a
                    href="https://console.cloud.google.com"
                    rel="noopener"
                    target="_blank"
                    class="underline text-blue-500"
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
                    class="underline text-blue-500"
                  >
                    new Project
                  </a>{" "}
                  named <strong class="font-bold">dwata</strong>
                </li>
                <li>
                  Check that project <strong class="font-bold">dwata</strong> is
                  selected (dropdown beside top left logo)
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

            <div
              class="text-xl cursor-pointer"
              onClick={() => handleOpenHelpSection("googleOAuth2ConsentScreen")}
            >
              Google OAuth consent screen
            </div>
            <span class="text-sm font-thin">
              After you have setup Google Cloud project
            </span>
            {helpState().openSection === "googleOAuth2ConsentScreen" && (
              <div class="list-decimal flex flex-col font-thin">
                <li>
                  Go to Menu (left of Google Cloud logo) &gt;{" "}
                  <strong class="font-bold">APIs &amp; Services</strong> &gt;{" "}
                  <strong class="font-bold">OAuth consent screen</strong>
                </li>
                <li>
                  In <strong class="font-bold">OAuth consent screen</strong>{" "}
                  form, select <strong class="font-bold">External</strong> and
                  click <strong class="font-bold uppercase">Create</strong>
                </li>
                <li>
                  In next form, under{" "}
                  <strong class="font-bold">App information</strong> use{" "}
                  <strong class="font-bold">dwata</strong> as app name, select
                  your email as User support email
                </li>
                <li>
                  Use same email address under{" "}
                  <strong class="font-bold">
                    Developer contact information
                  </strong>{" "}
                  and click{" "}
                  <strong class="font-bold uppercase">Save and continue</strong>
                </li>
                <li>
                  Click{" "}
                  <strong class="font-bold uppercase">
                    + Create Credentials
                  </strong>{" "}
                  (below search box)
                </li>
                <li>
                  On next screen, click{" "}
                  <strong class="font-bold">Add or remove scopes</strong>
                </li>
                <li>
                  On the overlay, (beside{" "}
                  <strong class="font-bold">Filter</strong>) search for{" "}
                  <strong class="font-bold">gmail</strong>, then select all
                  Gmail related APIs
                </li>
                <li>
                  Click <strong class="font-bold uppercase">Update</strong> at
                  the bottom, then click{" "}
                  <strong class="font-bold uppercase">Save and continue</strong>
                </li>
                <li>
                  In the next screen, click{" "}
                  <strong class="font-bold uppercase">+ Add users</strong>
                </li>
                <li>
                  In the overlay form, add all email addresses (Gmail personal
                  or Workspace) in the text box (press Enter after each address)
                </li>
                <li>
                  Click <strong class="font-bold uppercase">Add</strong> in
                  overlay and click{" "}
                  <strong class="font-bold uppercase">Save and continue</strong>
                </li>
              </div>
            )}

            <div
              class="text-xl cursor-pointer"
              onClick={() => handleOpenHelpSection("googleOAuth2Credentials")}
            >
              Google OAuth credentials
            </div>
            <span class="text-sm font-thin">
              After you have setup Google OAuth consent screen
            </span>
            {helpState().openSection === "googleOAuth2Credentials" && (
              <div class="list-decimal flex flex-col font-thin">
                <li>
                  Go to Menu (left of Google Cloud logo) &gt;{" "}
                  <strong class="font-bold">APIs &amp; Services</strong> &gt;{" "}
                  <strong class="font-bold">Credentials</strong>
                </li>
                <li>
                  Click{" "}
                  <strong class="font-bold uppercase">
                    + Create credentials
                  </strong>{" "}
                  (below search box)
                </li>
                <li>
                  Select <strong class="font-bold">OAuth client ID</strong>
                </li>
                <li>
                  In <strong class="font-bold">Application type</strong> select{" "}
                  <strong class="font-bold">Desktop app</strong> and use{" "}
                  <strong class="font-bold">dwata</strong> as name
                </li>
                <li>
                  You may now{" "}
                  <Button
                    label="add OAuth2 app"
                    href="/settings/oauth2-app/add"
                    size="sm"
                  />{" "}
                  in dwata using the{" "}
                  <strong class="font-bold">Client ID</strong> and{" "}
                  <strong class="font-bold">Client secret</strong>
                </li>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        class="rounded-md p-4 mx-auto drop-shadow-md w-full"
        style={{
          "background-color": getColors().colors["editorWidget.background"],
          color: getColors().colors["editor.foreground"],
        }}
      >
        <div onClick={() => handleOpenHelpSection("gmail")}>
          <Heading size={4}>Gmail account</Heading>
          <span class="text-sm font-thin">
            After you have completed Google OAuth section above
          </span>
        </div>

        {helpState().openSection?.includes("gmail") && (
          <div class="list-decimal flex flex-col font-thin gap-y-1">
            <li>
              Add an email account, select{" "}
              <strong class="font-bold">Gmail</strong> as the Provider
            </li>
            <li>
              Click <strong class="font-bold">Save</strong> and you will be
              shown a URL on the next screen
            </li>
            <li>Click the URL and authorize your Gmail account with the app</li>
          </div>
        )}
      </div>

      <div
        class="rounded-md p-4 mx-auto drop-shadow-md w-full"
        style={{
          "background-color": getColors().colors["editorWidget.background"],
          color: getColors().colors["editor.foreground"],
        }}
      >
        <div onClick={() => handleOpenHelpSection("protonMail")}>
          <Heading size={4}>Proton Mail account</Heading>
          <span class="text-sm font-thin">
            Needs a{" "}
            <a
              href="https://proton.me/support/imap-smtp-and-pop3-setup"
              rel="noopener"
              target="_blank"
              class="underline text-blue-500"
            >
              paid Proton Mail
            </a>{" "}
            account and{" "}
            <a
              href="https://proton.me/mail/bridge"
              rel="noopener"
              target="_blank"
              class="underline text-blue-500"
            >
              Proton Mail Bridge
            </a>{" "}
            installed on your computer
          </span>
        </div>

        {helpState().openSection?.includes("protonMail") && (
          <div class="list-decimal flex flex-col font-thin gap-y-1">
            Instructions coming soon
          </div>
        )}
      </div>

      <div
        class="rounded-md p-4 mx-auto drop-shadow-md w-full"
        style={{
          "background-color": getColors().colors["editorWidget.background"],
          color: getColors().colors["editor.foreground"],
        }}
      >
        <div onClick={() => handleOpenHelpSection("yahooMail")}>
          <Heading size={4}>Yahoo! Mail account</Heading>
          <span class="text-sm font-thin">
            You will have to create an app password{" "}
            <a
              href="https://help.yahoo.com/kb/generate-manage-rd-party-passwords-sln15241.html"
              rel="noopener"
              target="_blank"
              class="underline text-blue-500"
            >
              as documented here
            </a>
          </span>
        </div>

        {helpState().openSection?.includes("yahooMail") && (
          <div class="list-decimal flex flex-col font-thin gap-y-1">
            Instructions coming soon
          </div>
        )}
      </div>

      <div class="flex gap-x-2 my-8">
        <div class="w-24 pt-1">
          <img
            class="rounded-lg"
            src="https://avatars.githubusercontent.com/u/350106?v=4"
            alt="Sumit Datta, founder of dwata"
          />
        </div>

        <div
          class="rounded-md p-3 grow font-thin"
          style={{
            "background-color": getColors().colors["editorWidget.background"],
            color: getColors().colors["editor.foreground"],
          }}
        >
          Feeling overwhelmed? I would be happy to help you onboard. Please feel
          free to{" "}
          <a
            class="font-bold"
            href="https://calendly.com/sumitdatta/quick-chat"
            rel="noopener"
            target="_blank"
          >
            set a call
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default SetupEmail;
