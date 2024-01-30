interface IDataSource {
  id: number;
  label: string;
  path: string;
}

interface IChatRoom {
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

interface ISort {
  column: string;
  direction: "asc" | "desc";
}

export type { IDataSource, IChatRoom, IColumn, ISort };
