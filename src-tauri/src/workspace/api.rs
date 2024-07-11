use super::crud::ModuleDataCreateUpdate;
use crate::content::form::{FormButton, FormButtonType, FormField};
use crate::error::DwataError;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Configuration {
    pub title: String,
    pub description: String,
    pub fields: Vec<FormField>,
    pub buttons: Vec<FormButton>,
    // Needed in forms with steps that need external browser or other action
    // while the form can be submitted (backend waits)
    pub submit_implicitly: bool,
}

impl Configuration {
    pub fn new(title: &str, description: &str, fields: Vec<FormField>) -> Self {
        Configuration {
            title: title.to_string(),
            description: description.to_string(),
            fields,
            buttons: vec![FormButton {
                button_type: FormButtonType::Submit,
                label: "Save".to_string(),
            }],
            submit_implicitly: false,
        }
    }
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export)]
pub enum NextStep {
    // This is the start of the state machine
    Initiate(Configuration),
    // This is when we need to update the configuration for form/API
    AlterConfiguration(Configuration),
    // This is when there is nothing to say given the current data/context
    Continue(Configuration),
}

pub trait Writable {
    fn initiate() -> Result<NextStep, DwataError>;

    async fn next_step(_data: ModuleDataCreateUpdate) -> Result<NextStep, DwataError> {
        return Self::initiate();
    }

    // async fn validate(_data: ModuleDataCreateUpdate) -> Result<Vec<(String, String)>, DwataError> {
    //     return Ok(vec![]);
    // }

    // async fn before_save() {}
}
