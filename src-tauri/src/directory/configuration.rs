use super::Directory;
use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::workspace::configuration::{Configurable, Configuration};

impl Configurable for Directory {
    fn get_schema() -> Configuration {
        Configuration::new(
            "Directory",
            "Directory containing files which match specified types",
            vec![
                FormField::new(
                    "path",
                    "Path to Directory",
                    Some(
                        "The directory from which you want to read files matching specified types",
                    ),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "label",
                    "Label",
                    Some("An easy to remember label for this directory"),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "includePatters",
                    "Include patterns",
                    Some("File glob patterns to include (like in .gitignore file)"),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
            ],
        )
    }
}
