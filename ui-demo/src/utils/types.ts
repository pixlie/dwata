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

interface ISort {
  columnIndex: number; // index of columns in select array
  direction: "asc" | "desc";
}

interface IQuery {
  source: TDataSourceName;
  select: Array<[TColumnName, TTableName, TDataSourceName]>;
  visibleColumnIndices?: Array<number>; // index of columns in select array
  sorting?: Array<ISort>;
  areRowsSelectable?: boolean;
}

export type {
  IDataSource,
  ILabel as IChatRoom,
  IColumn,
  ISort,
  TDataSourceName,
  TTableName,
  TColumnName,
  TRowValue,
  IQuery,
};
