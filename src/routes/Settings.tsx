import { Component, createResource, createSignal, onMount } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseSourceForm from "../widgets/settings/DatabaseSourceForm";
import { Route, RouteSectionProps } from "@solidjs/router";
import Button from "../widgets/interactable/Button";
// import SettingsSourceList from "../widgets/settings/SettingsSourceList";
import AIIntegrationForm from "../widgets/settings/AIIntegrationForm";
import SettingsAIIntegrationList from "../widgets/settings/SettingsAIIntegrationList";
import DirectorySourceForm from "../widgets/settings/DirectorySourceForm";
import { useWorkspace } from "../stores/workspace";
import Oauth2AppForm from "../widgets/settings/OAuth2AppForm";
import EmailAccountForm from "../widgets/settings/EmailAccountForm";
import SettingsOAuth2AppList from "../widgets/settings/SettingsOAuth2AppList";
import SettingsEmailAccountList from "../widgets/settings/SettingsEmailAccountList";
import { useUserInterface } from "../stores/userInterface";

const SettingsIndex: Component = () => {
  const [_w, { readModuleList }] = useWorkspace();
  const [_data, { refetch }] = createResource(async () => {
    await readModuleList("AIIntegration");
    await readModuleList("OAuth2App");
    await readModuleList("EmailAccount");
  });

  onMount(() => {
    refetch();
  });

  return (
    <>
      {/* <Heading size="xl">Data Sources</Heading>
      <p
        class="p-4 text-white rounded-md border cursor-default select-none text-sm mb-2"
        style={{
          "background-color": getColors().colors["panel.background"],
          "border-color": getColors().colors["panel.border"],
        }}
      >
        Connect to databases like MySQL, PostgreSQL, SQLite, MongoDB, etc and
        Dwata can extract schema or data from them.
        <br />
        Import files like Markdown from directories.
      </p>
      <SettingsSourceList />
      <div class="mb-2" />
      <div class="flex flex-row gap-2">
        <Button
          label="Add a Database"
          href="/settings/database-source/add"
          size="sm"
        ></Button>
        <Button
          label="Add a Directory"
          href="/settings/directory-source/add"
          size="sm"
        ></Button>
      </div>
      <div class="mb-6" /> */}

      {/* <Heading size="xl">AI integrations</Heading>
      <SettingsAIIntegrationList />
      <div class="mb-2" />
      <Button
        label="Add AI provider"
        href="/settings/ai-integration/add"
        size="sm"
      ></Button>
      <div class="mb-6" /> */}

      <Heading size={5}>OAuth2 apps</Heading>
      <SettingsOAuth2AppList />
      <div class="mb-2" />
      <Button
        label="Add Oauth2 app"
        href="/settings/oauth2-app/add"
        size="sm"
      ></Button>
      <div class="mb-6" />

      <Heading size={5}>Email accounts</Heading>
      <SettingsEmailAccountList />
      <div class="mb-2" />
      <Button
        label="Add Email account"
        href="/settings/email-account/add"
        size="sm"
      ></Button>
      <div class="mb-6" />
    </>
  );
};

interface IHelpState {
  openSection?: "gmail" | "protonMail" | "yahooMail";
}

const SettingsWrapper: Component<RouteSectionProps> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [helpState, setHelpState] = createSignal<IHelpState>({});

  const handleOpenHelpSection = (
    sectionName: "gmail" | "protonMail" | "yahooMail",
  ) => {
    setHelpState({ openSection: sectionName });
  };

  return (
    <>
      <Heading size={3}>Settings</Heading>
      <div class="mb-4" />

      <div class="flex">
        <div class="grow">{props.children}</div>

        <div class="max-w-screen-sm">
          <div
            class="rounded-md p-4 mx-auto shadow-md"
            style={{
              "background-color": getColors().colors["editorWidget.background"],
              color: getColors().colors["editor.foreground"],
            }}
          >
            <Heading size={3}>Instructions</Heading>
            <div class="font-thin">
              Click any of the following to see how you can connect to that
              email provider.
            </div>

            <div class="flex flex-col gap-y-4">
              <div class="flex flex-col">
                <div
                  class="text-xl cursor-pointer"
                  onClick={() => handleOpenHelpSection("gmail")}
                >
                  Gmail account
                </div>
                <span class="text-sm font-thin">
                  Personal and Workspace accounts supported
                </span>

                {helpState().openSection === "gmail" && (
                  <div class="list-decimal flex flex-col font-thin">
                    <li>
                      Create a Google OAuth2 app if you do not have one (can
                      reuse for multiple Google accounts)
                    </li>
                  </div>
                )}
              </div>

              <div class="flex flex-col">
                <div class="text-xl cursor-pointer">Proton Mail account</div>
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
                <div class="text-xl cursor-pointer">Yahoo! Mail account</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SettingsRoutes: Component = () => {
  return (
    <>
      <Route path="/database-source/add" component={DatabaseSourceForm} />
      <Route path="/database-source/edit/:id" component={DatabaseSourceForm} />

      <Route path="/directory-source/add" component={DirectorySourceForm} />
      <Route
        path="/directory-source/edit/:id"
        component={DirectorySourceForm}
      />

      <Route path="/ai-integration/add" component={AIIntegrationForm} />
      <Route path="/ai-integration/edit/:id" component={AIIntegrationForm} />

      <Route path="/oauth2-app/add" component={Oauth2AppForm} />
      <Route path="/oauth2-app/edit/:id" component={Oauth2AppForm} />

      <Route path="/email-account/add" component={EmailAccountForm} />
      <Route path="/email-account/edit/:id" component={EmailAccountForm} />

      <Route path="/" component={SettingsIndex} />
    </>
  );
};

export { SettingsWrapper, SettingsRoutes };
