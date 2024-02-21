export type SourceType = "database" | "service";

export interface ISource {
  type: SourceType;
  label: string;
  provider: string;
}

export interface ISchemaProperties {
  related_tables: string[];
}

export interface ISchemaColumn {
  [key: string]: string | number | boolean;
}

export interface ISchema {
  table_name: string;
  properties: ISchemaProperties;
  columns: ISchemaColumn[];
}

export interface IQuerySpecification {
  sourceLabel: string;
  tableName?: string; // Used to retrieve single row of data from a table
  pk?: number | string; // Used to retrieve single row of data from a table
  select: IDatabaseTable[];
  columns?: string[];
  embeddedColumns?: string[];

  filterBy?: {
    [key: string]: string;
  };
  orderBy?: {
    [key: string]: string;
  };
  count?: number;
  limit?: number;
  offset?: number;

  isSavedQuery?: boolean;
  fetchNeeded?: boolean;
}

export interface IDatabaseTable {
  label: string;
  tableName: string;
}
