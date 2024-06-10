/// An Actionable is any entity in Dwata that can either act directly or ask the user to act.
/// For example reading the files in a directory is an action and our Directory module
/// can implement this trait.
/// Similarly adding a directory needs user action and the UI module can implement this trait.
pub trait Actionable {}
