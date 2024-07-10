import { JSX } from "solid-js";
import { FormField } from "../api_types/FormField";
import { ContentType } from "../api_types/ContentType";
import { ContentSpec } from "../api_types/ContentSpec";
import { Content } from "../api_types/Content";
import { DirectorySource } from "../api_types/DirectorySource";
import { DatabaseSource } from "../api_types/DatabaseSource";
import { AIIntegration } from "../api_types/AIIntegration";
import { OAuth2 } from "../api_types/OAuth2";
import { EmailAccount } from "../api_types/EmailAccount";

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
type IFormData = { [key: string]: IFormFieldValue };

export interface IChoicesWithHeading {
  name: string;
  choices: Array<[string, string]>;
}

interface IFormField extends FormField {
  size?: "xs" | "sm" | "base" | "lg";
  displayBlock?: boolean;
  value?: IFormFieldValue;
  onChange?: (name: string, value: IFormFieldValue) => void;
  onFocus?: () => void;
}

interface IWorkspace {
  directoryList: Array<DirectorySource>;
  databaseList: Array<DatabaseSource>;
  aiIntegrationList: Array<AIIntegration>;
  oAuth2List: Array<OAuth2>;
  emailAccountList: Array<EmailAccount>;

  isReady: boolean;
  isFetching: boolean;
}

interface INextTask {
  name: string;
  arguments?: Array<[string, ContentType, Content]>;
}

type IHeterogenousContent = [ContentType, ContentSpec, Content];

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
  INextTask,
  IHeterogenousContent,
  uiThemes,
};
