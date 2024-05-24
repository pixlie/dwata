#[derive(Deserialize, Serialize)]
pub(crate) enum ToolParameterType {
    String,
    Number,
    Boolean,
    Enum(Vec<String>),
}

impl Display for ToolParameterType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ToolParameterType::String => write!(f, "string"),
            ToolParameterType::Number => write!(f, "number"),
            ToolParameterType::Boolean => write!(f, "boolean"),
            ToolParameterType::Enum(e) => write!(f, "string"),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub(crate) struct ToolParameter {
    name: String,
    parameter_type: ToolParameterType,
    description: String,
}

impl ToolParameter {
    pub fn new(name: String, parameter_type: ToolParameterType, description: String) -> Self {
        Self {
            name,
            parameter_type,
            description,
        }
    }
}

#[derive(Deserialize, Serialize)]
pub(crate) struct Tool {
    name: String,
    description: String,
    parameters: Vec<ToolParameter>,
    required: Vec<String>,
}

impl Tool {
    pub fn new(
        name: String,
        description: String,
        parameters: Vec<ToolParameter>,
        required: Vec<String>,
    ) -> Self {
        Self {
            name,
            description,
            parameters,
            required,
        }
    }
}

pub(crate) trait AITools {
    fn get_self_tool_list(&self) -> Vec<Tool>;
}
