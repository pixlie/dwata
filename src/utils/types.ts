import { JSX } from "solid-js";

interface ILabel {
  id: number;
  label: string;
  path: string;
}

type TRowValue = any;

// Only required in Database form
interface IDatabaseFormData {
  id?: string;
  username: string;
  password?: string;
  host: string;
  port?: number;
  name: string;
  label?: string;
  // needsSsh: boolean;
}

interface IAiFormData {
  id?: string;
  aiProvider: string;
  apiKey: string;
  displayLabel?: string;
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

interface IFormField {
  name: string;
  fieldType:
    | "singleLineText"
    | "multiLineText"
    | "markdown"
    | "password"
    | "date"
    | "dateTime"
    | "singleChoice";
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
}

type uiThemes = "gitHubDark" | "gitHubLight";

export type {
  ILabel as IChatRoom,
  TRowValue,
  IDatabaseFormData,
  IAiFormData,
  IProviderPropTypes,
  APIGridData,
  IFormField,
  uiThemes,
};
