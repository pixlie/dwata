interface IDataSource {
  id: number;
  label: string;
  path: string;
}

interface ILabel {
  id: number;
  label: string;
  path: string;
}

interface IColumn {
  label: string;
  name: string;
  tableName: string;
  isPrimaryKey?: boolean;
  autoIncrement?: boolean;
}

type TDataSourceName = string;
type TTableName = string;
type TColumnName = string;
type TRowValue = any;
type TSort = "asc" | "desc";
type TColumnSpec = [TColumnName, TTableName, TDataSourceName];

interface IQuery {
  source: TDataSourceName;
  select: Array<TColumnSpec>;
  visibleColumnIndices?: Array<number>; // index of columns in select array
  sorting?: { [columnIndex: number]: TSort };
  areRowsSelectable?: boolean;
}

interface IQueryResult {
  isFetching: boolean;
  data: {
    columns: Array<TColumnSpec>;
    rows: Array<Array<TRowValue>>;
  };
  errors: Array<string>;
}

export type {
  IDataSource,
  ILabel as IChatRoom,
  IColumn,
  TDataSourceName,
  TTableName,
  TColumnName,
  TRowValue,
  IQuery,
  IQueryResult,
};
