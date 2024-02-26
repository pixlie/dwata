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

interface IProviderPropTypes {
  children: JSX.Element;
}

export type {
  ILabel as IChatRoom,
  TRowValue,
  IDatabaseFormData,
  IProviderPropTypes,
};
