use crate::directory::Content;
use comrak::nodes::{AstNode, NodeValue};
use comrak::{parse_document, Arena, Options};
use std::path::PathBuf;

pub fn get_file_contents(file_path: &PathBuf) -> Vec<(usize, Content)> {
    let arena = Arena::new();
    let file_contents = std::fs::read_to_string(file_path).unwrap();
    let root = parse_document(&arena, &file_contents, &Options::default());
    let mut result: Vec<(usize, Content)> = vec![];

    fn iter_nodes<'a, F>(
        node: &'a AstNode<'a>,
        node_handler: &F,
        accumulator: &mut Vec<(usize, Content)>,
    ) where
        F: Fn(&'a AstNode<'a>, &mut Vec<(usize, Content)>),
    {
        node_handler(node, accumulator);
        for c in node.children() {
            iter_nodes(c, node_handler, accumulator);
        }
    }

    iter_nodes(
        root,
        &|node, accumulator| match &node.data.borrow().value {
            &NodeValue::Text(ref text) => {
                accumulator.push((1, Content::Paragraph(text.to_string())))
            }
            _ => (),
        },
        &mut result,
    );

    result
}
