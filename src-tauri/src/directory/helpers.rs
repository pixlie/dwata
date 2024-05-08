use crate::directory::Content;
use comrak::nodes::{AstNode, NodeValue};
use comrak::{parse_document, Arena, Options};
use std::path::PathBuf;

pub fn get_file_contents(file_path: &PathBuf) -> Vec<(usize, Content)> {
    let file_contents = std::fs::read_to_string(file_path).unwrap();
    let arena = Arena::new();
    let root = parse_document(&arena, &file_contents, &Options::default());
    let mut result: Vec<(usize, Content)> = vec![];

    fn extract_text<'a>(node: &'a AstNode<'a>, accumulator: &mut Vec<String>) {
        for child in node.children() {
            match &child.data.borrow().value {
                NodeValue::Text(text) => {
                    accumulator.push(text.to_string());
                }
                _ => extract_text(child, accumulator),
            }
        }
    }

    for child in root.children() {
        match &child.data.borrow().value {
            NodeValue::Heading(_) => {
                // We found a heading, we extract all the text children nodes and store as Content::Heading
                let mut accumulator: Vec<String> = vec![];
                extract_text(child, &mut accumulator);
                result.push((0, Content::Heading(accumulator.join(" "))));
            }
            NodeValue::Paragraph => {
                // We found a paragraph, we extract all the text children nodes and store as Content::Paragraph
                let mut accumulator: Vec<String> = vec![];
                extract_text(child, &mut accumulator);
                match result.last_mut() {
                    Some(x) => match x {
                        (_, Content::Paragraph(p)) => {
                            // If the previous element is a Content::Paragraph, we append to it
                            x.1 = Content::Paragraph(format!("{} {}", p, accumulator.join(" ")));
                        }
                        _ => {
                            result.push((0, Content::Paragraph(accumulator.join(" "))));
                        }
                    },
                    _ => {
                        result.push((0, Content::Paragraph(accumulator.join(" "))));
                    }
                }
            }
            _ => {}
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_file_contents() {
        let result: Vec<(usize, Content)> = get_file_contents(
            &std::env::current_dir()
                .unwrap()
                .join("test_fixtures/fastapi_tutorial.md"),
        );
        assert_eq!(result.len(), 8);
    }
}
