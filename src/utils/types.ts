import { JSX } from "solid-js";

interface ILabel {
  id: number;
  label: string;
  path: string;
}

type TRowValue = any;

interface IQueryResult {
  isReady: boolean;
  isFetching: boolean;

  areRowsSelectable?: boolean;
  visibleColumnIndices?: Array<number>; // index of columns in select array
}

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
