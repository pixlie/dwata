use chrono::{serde::ts_milliseconds, DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Json;
use sqlx::FromRow;
use ts_rs::TS;

pub mod actionable;

#[derive(Debug, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Workflow {
    pub id: i64,
    pub title: Option<String>,
    pub summary: Option<String>,
    pub system_prompt: Option<String>,

    // Default AI integration and model for this workflow
    // This can be overridden for different actions in this workflow
    pub ai_model_id: Option<i64>,
    #[ts(type = "Vec<Objective>")]
    pub objective_list: Json<Vec<Objective>>,
    #[sqlx(skip)]
    pub step_list: Vec<Step>,

    #[serde(with = "ts_milliseconds")]
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Objective {
    pub id: i64,
    pub item: String,
    pub is_complete: bool,
    pub order: i64,
}

impl Objective {
    pub fn from_raw_item<T: Into<String>>(item: T) -> Self {
        Self {
            id: 0,
            item: item.into(),
            is_complete: false,
            order: 0,
        }
    }
}

/// A Step in a workflow is how the user interacts with Dwata or AI models
/// to achieve the stated objectives.
///
/// Steps can be prompts to be sent to AI models and then some action to be performed on the output.
/// Or they can be direct UI action for the user.
#[derive(Debug, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Step {
    pub id: i64,

    pub workflow_id: i64,
    pub item: String,
    pub order: i64,
}

impl Step {
    pub fn from_raw_item<T: Into<String>>(item: T) -> Self {
        Self {
            id: 0,
            workflow_id: 0,
            item: item.into(),
            order: 0,
        }
    }
}

pub enum ActionType {
    Prompt(String),
}

pub struct PromptTemplate {
    id: i64,

    prompt: String,
}

pub fn create_workflow() -> Workflow {
    let w = Workflow {
        id: 0,
        title: Some("I have a software project that is built with Python and JavaScript.
            I want to download all the available open source documentation of all the
            libraries and dependencies in this project. How can I find out the list of all libraries in this project?"
                .to_string(),
        ),
        summary: None,
        system_prompt: Some("You are an experienced software engineer and mentor.
            You help the user achieve their objectives by utilizing the available tools on their desktop computer.
            You may request access to directories and files, data from databases, websites, etc.
            Please use the tools when tools are mentioned.".to_string()),
        ai_model_id: None,
        created_at: Utc::now(),
        objective_list: Json(vec![
            Objective::from_raw_item(
            "Scan my software project to find all dependencies",
            ),
            Objective::from_raw_item("Download all the available open source documentation for the dependencies"),
            Objective::from_raw_item("Enable semantic and keyword search across all the stored documentation")
        ]),
        step_list: vec![
            Step::from_raw_item("Add my software project in Dwata"),
            Step::from_raw_item("List the important programming languages used in my project"),
            Step::from_raw_item(
                "Find out which files specify the dependencies in my project",
            ),
            Step::from_raw_item("Read the contents of the files which contain software dependencies and generate the list of all dependencies in my project"),
        ],
    };
    w
}
