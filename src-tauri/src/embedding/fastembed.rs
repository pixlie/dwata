use crate::error::DwataError;
use fastembed::TextEmbedding;

pub fn get_embeddings_with_fastembed(paragraphs: Vec<String>) -> Result<Vec<Vec<f32>>, DwataError> {
    let model = TextEmbedding::try_new(Default::default()).unwrap();

    let documents: Vec<String> = paragraphs
        .into_iter()
        .map(|x| format!("passage: {}", x))
        .collect();

    match model.embed(documents, None) {
        Ok(result) => Ok(result),
        Err(_) => Err(DwataError::CouldNotGenerateEmbedding),
    }
}
