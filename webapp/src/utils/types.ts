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
