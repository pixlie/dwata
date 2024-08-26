import {
  Component,
  For,
  createComputed,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import Heading from "../widgets/typography/Heading";
import TextInput from "../widgets/interactable/TextInput";
import { IFormFieldValue } from "../utils/types";
import { useLocation, useParams, useSearchParams } from "@solidjs/router";
import { EmailAccount } from "../api_types/EmailAccount";
import { useSearchableData } from "../stores/searchableData";
import { Mailbox } from "../api_types/Mailbox";
import { invoke } from "@tauri-apps/api/core";
import { searchRoutes } from "./routeList";
import SearchResultEmailItem from "../widgets/search/SearchResultEmailItem";
import SearchResultFileItem from "../widgets/search/SearchResultFileItem";
import Pagination from "../widgets/navigation/Pagination";

const MailboxLabel: Component<Mailbox> = (props) => {
  return <div>{props.name}</div>;
};

const EmailAccountBox: Component = () => {
  const [emailAccounts, mailboxes] = useSearchableData();
  const [searchParams] = useSearchParams();

  const getEmailAccount = createMemo<EmailAccount | undefined>(() => {
    if (!!searchParams.emailAccountId && emailAccounts.state === "ready") {
      return emailAccounts().data.find(
        (x) => x.id === parseInt(searchParams.emailAccountId!),
      );
    }
    return undefined;
  });

  const getMailboxes = createMemo<Array<Mailbox>>(() => {
    if (!!searchParams.emailAccountId && mailboxes.state === "ready") {
      return mailboxes().data.filter(
        (x) => x.emailAccountId === parseInt(searchParams.emailAccountId!),
      );
    }
    return [];
  });

  if (
    !searchParams.emailAccountId ||
    emailAccounts.state !== "ready" ||
    mailboxes.state !== "ready"
  ) {
    return null;
  }

  return (
    <>
      <Heading size="xl">{getEmailAccount()?.emailAddress}</Heading>
      <For each={getMailboxes()}>{(item) => <MailboxLabel {...item} />}</For>
    </>
  );
};

const Search: Component = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const [emailAccounts, mailboxes, emails, { fetchEmailsForMailbox }] =
    useSearchableData();
  const [formData, setFormData] = createSignal<{
    [key: string]: IFormFieldValue;
  }>({});
  const [_r, { mutate: _m, refetch: refetchEmails }] = createResource(
    async () => {
      if (emailAccounts.state !== "ready") {
        return;
      }
      for (const emailAccount of emailAccounts()?.data) {
        await invoke("fetch_emails", {
          pk: emailAccount.id,
        });
      }
    },
  );

  createComputed((isFetched) => {
    if (!isFetched && emailAccounts.state === "ready") {
      refetchEmails();
      return true;
    }
  }, false);

  createComputed(() => {
    const searchQuery =
      !!formData().query && (formData()!.query! as string).length >= 1
        ? `${formData().query}`.trim()
        : undefined;
    if (!!searchParams.emailAccountId) {
      // Load emails (recent or for search query) from this email account
      if (mailboxes.state === "ready" && mailboxes().data.length > 0) {
        const mailbox = mailboxes().data.find(
          (x) =>
            x.name.toLowerCase() === "sent" &&
            x.emailAccountId === parseInt(searchParams.emailAccountId!),
        );
        if (mailbox) {
          fetchEmailsForMailbox(mailbox.id, searchQuery);
        }
      }
    } else {
      // Load emails (recent or for search query) from all email accounts
      if (mailboxes.state === "ready" && mailboxes().data.length > 0) {
        for (const mb of mailboxes().data) {
          fetchEmailsForMailbox(mb.id, searchQuery);
        }
      }
    }
  });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));

    // Load search results
    if (mailboxes.state === "ready" && mailboxes().data.length > 0) {
      const mailbox = mailboxes().data.find(
        (x) => x.name.toLowerCase() === "sent",
      );
      const searchQuery =
        !!formData().query && (formData()!.query! as string).length >= 1
          ? `${formData().query}`.trim()
          : undefined;
      if (mailbox) {
        fetchEmailsForMailbox(mailbox.id, searchQuery);
      }
    }
  };

  const getSearchTypeDisplay = createMemo(() => {
    if (!!location.pathname) {
      const matchedRoute = searchRoutes.find(
        (x) => x.href === location.pathname,
      );
      if (matchedRoute) {
        return " " + matchedRoute.label.toLowerCase();
      }
    }
    return " all emails";
  });

  return (
    <div class="flex flex-col h-full">
      {/* <div
        class="max-w-96"
        style={{ color: getColors().colors["editor.foreground"] }}
      >
        <EmailAccountBox />
      </div> */}

      <TextInput
        name="query"
        contentType="Text"
        contentSpec={{}}
        isEditable
        onChange={handleChange}
        value={"query" in formData() ? formData().query : undefined}
        placeholder={`Search${getSearchTypeDisplay()}`}
      />

      <div class="mt-2 overflow-y-auto">
        {!!params.searchType && params.searchType === "files" ? (
          <div class="grid grid-cols-5 gap-4">
            <For each={emails()?.data}>
              {(result) => <SearchResultFileItem {...result} />}
            </For>
          </div>
        ) : null}
        {!!params.searchType && params.searchType === "emails" ? (
          <For each={emails()?.data}>
            {(result) => <SearchResultEmailItem {...result} />}
          </For>
        ) : null}
      </div>

      <Pagination />
    </div>
  );
};

const SearchWrapper: Component = () => {
  return <Search />;
};

export default SearchWrapper;
