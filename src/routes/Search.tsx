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
      <Heading size={5}>{getEmailAccount()?.emailAddress}</Heading>
      <For each={getMailboxes()}>{(item) => <MailboxLabel {...item} />}</For>
    </>
  );
};

interface ISearchFormData {
  query: string;
}

const Search: Component = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const [emailAccounts, _mailboxes, emails, { fetchEmailsForAccounts }] =
    useSearchableData();
  const [formData, setFormData] = createSignal<ISearchFormData>({
    query: "",
  });
  // const [_r, { mutate: _m, refetch: refetchEmails }] = createResource(
  //   async () => {
  //     if (emailAccounts.state !== "ready") {
  //       return;
  //     }
  //     for (const emailAccount of emailAccounts()?.data) {
  //       await invoke("fetch_emails", {
  //         pk: emailAccount.id,
  //       });
  //     }
  //   },
  // );

  createComputed((isFetched) => {
    if (!isFetched && emailAccounts.state === "ready") {
      // refetchEmails();
      if (emailAccounts.state === "ready" && emailAccounts().data.length > 0) {
        let emailAccountIdList = emailAccounts().data.map((x) => x.id);
        fetchEmailsForAccounts(emailAccountIdList, undefined);
      }
      return true;
    }
  }, false);

  createComputed(() => {
    if (!formData() || !formData().query || !formData().query.length) {
      return;
    }
    const searchQuery = formData().query.trim();
    if (!!searchParams.emailAccountId) {
      // Load emails (recent or for search query) from this email account
      fetchEmailsForAccounts(
        [parseInt(searchParams.emailAccountId)],
        searchQuery,
      );
    } else {
      // Load emails (recent or for search query) from all email accounts
      if (emailAccounts.state === "ready" && emailAccounts().data.length > 0) {
        let emailAccountIdList = emailAccounts().data.map((x) => x.id);
        fetchEmailsForAccounts(emailAccountIdList, searchQuery);
      }
    }
  });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
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

      <div class="flex mt-2 h-full gap-x-4">
        <div class="h-full overflow-y-auto max-w-screen-sm pr-4">
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

          <Pagination />
        </div>

        <div class="h-full overflow-y-auto grow"></div>
      </div>
    </div>
  );
};

const SearchWrapper: Component = () => {
  return <Search />;
};

export default SearchWrapper;
