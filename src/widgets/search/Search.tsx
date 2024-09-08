import { Component, createComputed, createMemo, createSignal } from "solid-js";
import { IFormFieldValue } from "../../utils/types";
import { useLocation, useParams, useSearchParams } from "@solidjs/router";
import { useSearchableData } from "../../stores/searchableData";
import TextInput from "../interactable/TextInput";
import { routes } from "../../routes/routeList";

interface ISearchFormData {
  query: string;
}

const Search: Component = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // const params = useParams();
  const [{ emailAccounts, _emails }, { fetchEmailsForAccounts }] =
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
      const matchedRoute = routes.find((x) => x.href === location.pathname);
      if (matchedRoute) {
        return " " + matchedRoute.label.toLowerCase();
      }
    }
    return " all emails";
  });

  return (
    <form class="relative flex flex-1" action="#" method="get">
      <label for="search-field" class="sr-only">
        Search
      </label>
      <svg
        class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clip-rule="evenodd"
        />
      </svg>
      <TextInput
        name="query"
        contentType="Text"
        contentSpec={{}}
        isEditable
        onChange={handleChange}
        value={"query" in formData() ? formData().query : undefined}
        placeholder={`Search${getSearchTypeDisplay()}`}
      />
      {/* <input
        id="search-field"
        class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
        placeholder="Search..."
        type="search"
        name="search"
      /> */}
    </form>
  );
};

export default Search;
