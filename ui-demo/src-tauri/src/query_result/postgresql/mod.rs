use crate::query_result::{ColumnPath, ColumnWiseData, DwataQuery};
use sqlx::postgres::PgRow;
use sqlx::{Column, Row, TypeInfo};
use sqlx_postgres::PgTypeInfo;
use std::collections::HashMap;

pub struct PostgreSQLQueryBuilder {
    data_source_id: String,
    select: HashMap<String, Vec<String>>, // {[table_name]: Vec<column_name>}
    columns: Vec<ColumnPath>,             // To track which column_paths we are getting results for
}

impl PostgreSQLQueryBuilder {
    pub fn new(query: &DwataQuery, data_source_id: String) -> Self {
        let mut builder = PostgreSQLQueryBuilder {
            data_source_id: data_source_id.clone(),
            select: HashMap::new(),
            columns: vec![],
        };
        // Find all columns (and tables) that are in this data source
        for column_path in &query.select {
            if column_path.dsi == data_source_id {
                builder
                    .select
                    .entry(column_path.tn.clone())
                    .and_modify(|columns| columns.push(column_path.cn.clone()))
                    .or_insert(vec![column_path.cn.clone()]);
                builder.columns.push(column_path.clone());
            }
        }
        builder
    }

    pub fn get_select(&self) -> String {
        let mut sql: String = "SELECT ".to_string();
        for (table, columns) in &self.select {
            sql += format!("{} FROM {}", columns.join(", "), table).as_str();
        }
        sql
    }

    pub async fn get_data(&self, connection: &sqlx::PgPool) -> ColumnWiseData {
        let data: ColumnWiseData = ColumnWiseData {
            data_source_id: self.data_source_id.clone(),
            columns: self.columns.clone(),
            data: HashMap::new(),
        };
        let select = self.get_select().clone();
        // let mut column_casts: Vec<String> = vec![];
        // sqlx::query(&select)
        //     .map(|row: PgRow| {
        //         for column_path in self.columns.iter() {
        //             let column_type = row.try_column(column_path.cn.as_str()).unwrap();
        //             match column_type.type_info().name() {
        //                 "INT4" => column_casts.push("INT4".to_string()),
        //                 _ => {}
        //             }
        //         }
        //     })
        //     .fetch_one(connection)
        //     .await
        //     .unwrap();

        sqlx::query(&select)
            .map(|row: PgRow| {
                let data: Vec<String> = vec![];
                for (index, column_path) in self.columns.iter().enumerate() {
                    // match column_casts.get(index).unwrap().as_str() {
                    let type_name = row
                        .try_column(column_path.cn.as_str())
                        .unwrap()
                        .type_info()
                        .name();
                    match type_name {
                        "INT4" => println!(
                            "{:?}",
                            row.try_get::<Option<i32>, &str>(column_path.cn.as_str())
                                .unwrap()
                        ),
                        "TEXT" => println!(
                            "{:?}",
                            row.try_get::<Option<&str>, &str>(column_path.cn.as_str())
                                .unwrap()
                        ),
                        _ => println!("{:?}", type_name),
                    }
                }
                println!("{:?}", data);
            })
            .fetch_all(connection)
            .await
            .unwrap_or_else(|_| vec![]);
        data
    }
}
