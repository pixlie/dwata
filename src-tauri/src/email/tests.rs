use super::helpers::clean_email_body_text;

#[cfg(test)]
mod tests {
    use crate::email::helpers::clean_email_body_text;

    // use super::*;
    #[test]
    fn check_consecutive_end_of_lines_removed() {
        let body_text = "\n\n\n\n\n\n\n".to_string();
        let cleaned = clean_email_body_text(&body_text);
        assert_eq!(cleaned, "\n");
    }

    #[test]
    fn check_consecutive_spaces_removed() {
        let body_text = "             ".to_string();
        let cleaned = clean_email_body_text(&body_text);
        assert_eq!(cleaned, " ");
    }

    #[test]
    fn check_consecutive_underscores_removed() {
        let body_text = "_______________________________________".to_string();
        let cleaned = clean_email_body_text(&body_text);
        assert_eq!(cleaned, "");
    }

    #[test]
    fn check_consecutive_dashes_removed() {
        let body_text = "---------------------------------".to_string();
        let cleaned = clean_email_body_text(&body_text);
        assert_eq!(cleaned, "");
    }
}
