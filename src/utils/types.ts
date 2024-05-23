import { JSX } from "solid-js";
import { FormField } from "../api_types/FormField";
import { Directory } from "../api_types/Directory";

interface ILabel {
  id: number;
  label: string;
  path: string;
}

type TRowValue = any;

interface IProviderPropTypes {
  children: JSX.Element;
}

interface APIGridData {
  source: string;
  schema: string | null;
  table: string | null;
  rows: Array<Array<any>>;
}

type IFormFieldValue = string | number | Array<string> | undefined;
type IFormData = {[key: string]: IFormFieldValue};

interface IFormField extends FormField {
  value?: IFormFieldValue;
  onInput?: (name: string, value: IFormFieldValue) => void;
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
  IProviderPropTypes,
  APIGridData,
  IFormFieldValue,
  IFormData,
  IFormField,
  IWorkspace,
  uiThemes,
};
