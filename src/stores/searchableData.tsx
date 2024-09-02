import { Component, createContext, createResource, useContext } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { IProviderPropTypes } from "../utils/types";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";
import { Module } from "../api_types/Module";
import { Email } from "../api_types/Email";
import { EmailAccount } from "../api_types/EmailAccount";
import { Mailbox } from "../api_types/Mailbox";
import { ModuleFilters } from "../api_types/ModuleFilters";
import { ModuleDataRead } from "../api_types/ModuleDataRead";

const makeStore = () => {
  const [emails, { mutate: _mutateEmails, refetch: refetchEmails }] =
    createResource<{
      data: Array<Email>;
    }>(async (_, { value, refetching }) => {
      let filters = {
        Email: {},
      } as ModuleFilters;

      if (!!refetching && typeof refetching === "object") {
        filters = {
          Email: {
            // We are fetching emails from a specific mailbox
            emailAccountIdList:
              "emailAccountIdList" in refetching
                ? refetching.emailAccountIdList
                : [],
            searchQuery:
              "searchQuery" in refetching ? refetching.searchQuery : undefined,
          },
        } as ModuleFilters;
      }
      const result = await invoke<ModuleDataReadList>("search_emails", {
        filters,
      });
      if (
        !!result &&
        "data" in result &&
        "type" in result["data"] &&
        result["data"]["type"] === "Email"
      ) {
        return { ...value, data: result["data"]["data"] as Array<Email> };
      }
      return { data: [] };
    });

  const [
    emailAccounts,
    { mutate: _mutateEmailAccounts, refetch: refetchEmailAccounts },
  ] = createResource<{ data: Array<EmailAccount> }>(
    async (_, { value: _value, refetching: _refetching }) => {
      const result = await invoke<ModuleDataReadList>(
        "read_row_list_for_module",
        {
          module: "EmailAccount" as Module,
        },
      );

      if (
        !!result &&
        "data" in result &&
        "type" in result["data"] &&
        result["data"]["type"] === "EmailAccount"
      ) {
        return {
          data: result["data"]["data"] as Array<EmailAccount>,
        };
      }
      return { data: [] };
    },
  );

  const [mailboxes, { mutate: _mutateMailboxes, refetch: refetchMailboxes }] =
    createResource<{ data: Array<Mailbox> }>(
      async (_, { value: _value, refetching: _refetching }) => {
        const result = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "Mailbox" as Module,
          },
        );
        if (
          !!result &&
          "data" in result &&
          "type" in result["data"] &&
          result["data"]["type"] === "Mailbox"
        ) {
          return {
            data: result["data"]["data"] as Array<Mailbox>,
          };
        }
        return { data: [] };
      },
    );

  const [
    selectedEmail,
    { mutate: _mutateSelectedEmail, refetch: refetchSelectedEmail },
  ] = createResource<Email | undefined>(
    async (_, { value: _value, refetching }) => {
      if (
        !refetching ||
        typeof refetching !== "object" ||
        !("emailId" in refetching)
      ) {
        return undefined;
      }
      const result = await invoke<ModuleDataRead>("read_module_item_by_pk", {
        module: "Email" as Module,
        pk: refetching.emailId,
      });
      if (!!result && "type" in result && result["type"] === "Email") {
        return result["data"];
      }
      return undefined;
    },
  );

  return [
    { emailAccounts, mailboxes, emails, selectedEmail },
    {
      fetchAllEmailAccounts: () => {
        refetchEmailAccounts();
      },

      fetchAllMailboxes: () => {
        refetchMailboxes();
      },

      fetchEmailsForAccounts: (
        emailAccountIdList: number[],
        searchQuery: string | undefined,
      ) => {
        if (!emailAccountIdList) return;
        refetchEmails({ emailAccountIdList, searchQuery });
      },

      fetchFullEmailByPk: (emailId: number) => {
        refetchSelectedEmail({ emailId });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
const searchableDataStore = makeStore();

const SearchableDataContext =
  createContext<TStoreAndFunctions>(searchableDataStore);

export const SearchableDataProvider: Component<IProviderPropTypes> = (
  props,
) => {
  return (
    <SearchableDataContext.Provider value={searchableDataStore}>
      {props.children}
    </SearchableDataContext.Provider>
  );
};

export const useSearchableData = () => useContext(SearchableDataContext);
