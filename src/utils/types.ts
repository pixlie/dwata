import { JSX, Setter } from "solid-js";
import { FormField } from "../api_types/FormField";
import { FormFieldData } from "../api_types/FormFieldData";

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
  value?: FormFieldData;
  onInput?: Setter<IFormData>;
  onFocus?: () => void;
}

type IFormData = {[key: string]: FormFieldData};

type uiThemes = "gitHubDark" | "gitHubLight";

export type {
  ILabel as IChatRoom,
  TRowValue,
  IDatabaseSourceFormData,
  IFolderSourceFormData,
  IProviderPropTypes,
  APIGridData,
  IFormField,
  IFormData,
  uiThemes,
};
