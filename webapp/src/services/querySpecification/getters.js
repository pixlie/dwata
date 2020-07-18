export const getColumnSchema = (schema, column) => {
  const [tableName, columnName] = column.split(".");
  for (const schemaTable of schema) {
    if (schemaTable.table_name === tableName) {
      for (const schemaColumn of schemaTable.columns) {
        if (schemaColumn.name === columnName) {
          return schemaColumn;
        }
      }
    }
  }
};
