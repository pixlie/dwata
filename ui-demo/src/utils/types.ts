import { JSX } from "solid-js";

interface ILabel {
  id: number;
  label: string;
  path: string;
}

interface IColumn {
  name: string;
  label?: string;
  isPrimaryKey?: boolean;
  autoIncrement?: boolean;
}

type TDataSourceName = string;
type TTableName = string;
type TColumnName = string;
type TRowValue = any;
type TOrder = "asc" | "desc";
type TColumnPath = [TColumnName, TTableName, TDataSourceName];

interface IQuery {
  source: TDataSourceName;
  select: Array<TColumnPath>; // When we have a query like `SELECT *` we expand all columns
  ordering?: { [columnIndex: number]: TOrder };
  filtering?: { [columnIndex: number]: string };
}

interface IResult {
  isFetching: boolean;
  data: {
    columns: Array<TColumnPath>;
    rows: Array<Array<TRowValue>>;
  };
  errors: Array<string>;
}

interface IQueryResult {
  isReady: boolean;
  isFetching: boolean;
  query?: IQuery;
  result?: IResult;

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

interface IAPI {}

interface IFolder {}

interface IProviderPropTypes {
  children: JSX.Element;
}

export type {
  ILabel as IChatRoom,
  IColumn,
  TDataSourceName,
  TTableName,
  TColumnName,
  TColumnPath,
  TRowValue,
  IQuery,
  IResult,
  IQueryResult,
  IDatabaseFormData,
  IProviderPropTypes,
};
