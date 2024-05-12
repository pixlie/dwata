use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::PathBuf;

pub mod commands;
// pub mod fastembed;
pub mod storage;
// mod rust_bert;

pub(crate) enum ParagraphExtractMethods {
    // Join short sibling sentences, which are within the given length, into a paragraph
    JoinShortSiblings(usize),
    IgnoreHeadings,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct ParagraphId {
    pub file_path: PathBuf,
    pub index: usize,
    pub extract_methods: HashSet<ParagraphExtractMethods>,
}
