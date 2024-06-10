pub async fn get_embedding_from_ai_provider(
    ai_integration: &AIIntegration,
    ai_model: String,
    text_to_embed: String,
) -> Result<Vec<f32>, DwataError> {
    let request = ai_integration.build_embedding_https_request(ai_model, text_to_embed);

    let response = request.send().await;
    match response {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<CreateEmbeddingResponse>().await {
                    Ok(response) => Ok(response.data[0]
                        .embedding
                        .iter()
                        .map(|n| n.clone() as f32)
                        .collect()),
                    Err(err) => {
                        println!("{:?}", err);
                        Err(DwataError::CouldNotConnectToAIProvider)
                    }
                }
            } else {
                println!(
                    "Error: {}\n{}",
                    response.status(),
                    response.text().await.unwrap()
                );
                Err(DwataError::CouldNotConnectToAIProvider)
            }
        }
        Err(_) => Err(DwataError::CouldNotConnectToAIProvider),
    }
}
