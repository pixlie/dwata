import { JSX, Setter } from "solid-js";
import { FormField } from "../api_types/FormField";
import { UserAccountCreateUpdate } from "../api_types/UserAccountCreateUpdate";
import { Directory } from "../api_types/Directory";

interface ILabel {
  id: number;
  label: string;
  path: string;
}

type TRowValue = any;

// Only required in Database form
interface IDatabaseSourceFormData {
  id?: string;
  username: string;
  password?: string;
  host: string;
  port?: number;
  name: string;
  label?: string;
  // needsSsh: boolean;
}

interface IFolderSourceFormData {
  id?: string;
  label?: string;
  path: string;
  includePatterns: Array<string>;
  excludePatterns: Array<string>;
}

interface IProviderPropTypes {
  children: JSX.Element;
}

interface APIGridData {
  source: string;
  schema: string | null;
  table: string | null;
  rows: Array<Array<any>>;
}

interface IFormField extends FormField {
  value?: string | number;
  onInput?: Setter<UserAccountCreateUpdate>;
  onFocus?: () => void;
}

interface IWorkspace {
  directoryList: Array<Directory>;

  isReady: boolean;
  isFetching: boolean;
}

type uiThemes = "gitHubDark" | "gitHubLight";

export type {
  ILabel as IChatRoom,
  TRowValue,
  IDatabaseSourceFormData,
  IFolderSourceFormData,
  IProviderPropTypes,
  APIGridData,
  IFormField,
  IWorkspace,
  uiThemes,
};
