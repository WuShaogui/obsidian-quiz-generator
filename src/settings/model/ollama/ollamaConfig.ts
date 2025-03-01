export interface OllamaConfig {
	ollamaBaseURL: string;
	ollamaTextGenModel: string;
	ollamaEmbeddingModel: string;
}

export const DEFAULT_OLLAMA_SETTINGS: OllamaConfig = {
	ollamaBaseURL: "http://192.168.3.165:11434",
	ollamaTextGenModel: "qwen2.5:latest",
	ollamaEmbeddingModel: "quentinz/bge-large-zh-v1.5:latest",
};
