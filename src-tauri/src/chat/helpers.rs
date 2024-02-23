use sqlparser::dialect::GenericDialect;
use sqlparser::parser::Parser;

pub fn parse_sql() {
    // From mixtral
    let sql = r#"
    SELECT
        DATE_FORMAT(o.purchase_timestamp, '%Y-%m') AS month,
        p.id AS product_id,
        p.name AS product_name,
        SUM(ci.quantity) AS total_quantity_sold
    FROM
        orders o
            JOIN
        carts c ON o.cart_id = c.id
            JOIN
        cart_items ci ON c.id = ci.cart_id
            JOIN
        products p ON ci.product_id = p.id
    GROUP BY
        month,
        p.id,
        p.name
    ORDER BY
        month ASC,
        total_quantity_sold DESC;
    "#;
    let dialect = GenericDialect {};
    let parse_result = Parser::parse_sql(&dialect, sql);
    match parse_result {
        Ok(statements) => {
            println!(
                "Round-trip:\n'{}'",
                statements
                    .iter()
                    .map(std::string::ToString::to_string)
                    .collect::<Vec<_>>()
                    .join("\n")
            );

            if cfg!(feature = "json_example") {
                #[cfg(feature = "json_example")]
                {
                    let serialized = serde_json::to_string_pretty(&statements).unwrap();
                    println!("Serialized as JSON:\n{serialized}");
                }
            } else {
                println!("Parse results:\n{statements:#?}");
            }
        }
        Err(e) => {
            println!("Error during parsing: {e:?}");
        }
    }
}
