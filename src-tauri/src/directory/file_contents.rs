use super::Directory;
use crate::content::containers::{HeterogeneousContentArray, HeterogenousContent};
use crate::content::content::{Content, ContentType};
use comrak::nodes::{AstNode, NodeValue};
use comrak::{parse_document, Arena, Options};
use std::collections::HashSet;
use std::path::PathBuf;

impl Directory {
    pub fn get_file_contents(file_path: &PathBuf) -> HeterogeneousContentArray {
        let file_contents = std::fs::read_to_string(file_path).unwrap();
        let arena = Arena::new();
        let root = parse_document(&arena, &file_contents, &Options::default());
        let mut contents: Vec<HeterogenousContent> = vec![];

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
                    contents.push((
                        ContentType::Text,
                        HashSet::new(),
                        Content::Text(accumulator.join(" ")),
                    ));
                }
                NodeValue::Paragraph => {
                    // We found a paragraph, we extract all the text children nodes and store as Content::Paragraph
                    let mut accumulator: Vec<String> = vec![];
                    extract_text(child, &mut accumulator);
                    match contents.last_mut() {
                        Some((content_type, _, data)) => match content_type {
                            ContentType::Text => {
                                // If the previous element is a Content::Text, we append to it
                                match data {
                                    Content::Text(content) => {
                                        *data = Content::Text(format!(
                                            "{} {}",
                                            content,
                                            accumulator.join(" ")
                                        ))
                                    }
                                    _ => {}
                                }
                            }
                            _ => {
                                contents.push((
                                    ContentType::Text,
                                    HashSet::new(),
                                    Content::Text(accumulator.join(" ")),
                                ));
                            }
                        },
                        _ => {
                            contents.push((
                                ContentType::Text,
                                HashSet::new(),
                                Content::Text(accumulator.join(" ")),
                            ));
                        }
                    }
                }
                _ => {}
            }
        }

        HeterogeneousContentArray { contents }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_get_file_contents() {
//         let result: HeterogeneousContentArray = Directory::get_file_contents(
//             &std::env::current_dir()
//                 .unwrap()
//                 .join("test_fixtures/fastapi_tutorial.md"),
//         );
//         assert_eq!(result.contents.len(), 8);
//     }
// }
