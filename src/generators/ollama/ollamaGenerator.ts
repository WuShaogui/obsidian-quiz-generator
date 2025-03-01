import { Ollama } from "ollama/dist/browser.mjs";
import Generator from "../generator";
import { QuizSettings } from "../../settings/config";
import { cosineSimilarity } from "../../utils/helpers";
import {cleanUpNoteContents2} from "../../utils/markdownCleaner"
import { Notice } from "obsidian";
import { string } from "cohere-ai/core/schemas";

export default class OllamaGenerator extends Generator {
	private readonly ollama: Ollama;

	constructor(settings: QuizSettings) {
		super(settings);
		this.ollama = new Ollama({ host: this.settings.ollamaBaseURL });
	}

	public async splitTextByHead(text: string): Promise<string[]> {
		// 使用正则表达式匹配 1-5 个 # 号开头的文本
		const regex = /^#{1,5}\s+[^#\n]+/gm;
		
		// 使用正则匹配提取所有符合条件的文本片段
		const matches = text.match(regex);
		
		// 如果没有匹配到任何内容,返回空数组
		if (!matches) {
		return [];
		}
		
		// 返回匹配到的文本数组
		return matches.map(match => match.trim());
	}

	public async extractMarkdownSections(markdownText: string): Promise<string[]> {
		const pattern = /^(#{1,6})\s+(.+?)\n((?:[\s\S]*?))(?=\n#{1,6}\s|$(?![\s\S]))/gm;
		const matches = [...markdownText.matchAll(pattern)];
		const HeadContents: string[] = [];

		// 使用 for 循环代替 map
		for (const match of matches) {
			const [_, levelMark, title, rawContent] = match;
			
			// 内容清理逻辑保持不变
			const content = rawContent
			.replace(/^\n+|\n+$/g, '')
			.replace(/^#{1,6}.*/gm, '')
			.trim();

			HeadContents.push(levelMark+" "+title+"\n"+content);
		}		

		return HeadContents;
	  }
	  

	// public async generateQuiz(contents: string[]): Promise<string> {
	// 	try {
	// 		const response = await this.ollama.generate({
	// 			model: this.settings.ollamaTextGenModel,
	// 			system: this.systemPrompt(),
	// 			prompt: this.userPrompt(contents),
	// 			format: "json",
	// 			stream: false,
	// 		});

	// 		// Parse response JSON
	// 		const parsed = JSON.parse(response.response);
	// 		parsed.questions = parsed.questions.map((question: any) => ({
	// 		...question,
	// 		source: contents[0]
	// 		}));
	// 		return JSON.stringify(parsed);

	// 	} catch (error) {
	// 		throw new Error((error as Error).message);
	// 	}
	// }

	public async generateQuiz(contents: string[]): Promise<string> {
		
		  // 对每个content进行分割
		  const allSegments: string[] = [];
		  for (const content of contents) {
			const segments = await this.extractMarkdownSections(content);
			console.log(segments);
			if (segments.length > 0) {
			  allSegments.push(...segments);
			} else {
			  allSegments.push(content);
			}
		  }

		  const allResponses = [];
		  
			// 对每个分段进行生成
			const totalItems = allSegments.length;
			let processed = 0;
			const notice = new Notice(`Processing: 0/${totalItems}`, 0);
			for (const segment of allSegments) {
				var airesult,filterContent;
				try {
					filterContent=cleanUpNoteContents2(segment,false);
					airesult = await this.ollama.generate({
					model: this.settings.ollamaTextGenModel,
					system: this.systemPrompt(),
					prompt: this.userPrompt([filterContent]),
					format: "json", 
					stream: false,
					});
				} catch (error) {
					// throw new Error((error as Error).message);
					new Notice('error in'+filterContent+"\n->pass" )
				}
				allResponses.push(airesult);
				processed++;
				notice.setMessage(`Processing: ${processed}/${totalItems}`);
			}
			notice.hide();
	  
		  // 合并所有响应
		  const mergedQuestions: any[] = [];
		  try {
			allResponses.forEach((response, index) => {
			  const parsed = JSON.parse(response?.response || '{"questions":[]}');
			  parsed.questions.forEach((question: any) => {
				mergedQuestions.push({
				  ...question,
				  source: allSegments[index]
				});
			  });
			});
		  } catch (error) {
			console.log("passing:"+(error as Error).message);
		  }

		  return JSON.stringify({ questions: mergedQuestions });
	  }



	public async shortOrLongAnswerSimilarity(userAnswer: string, answer: string): Promise<number> {
		try {
			const embedding = await this.ollama.embed({
				model: this.settings.ollamaEmbeddingModel,
				input: [userAnswer, answer],
			});

			return cosineSimilarity(embedding.embeddings[0], embedding.embeddings[1]);
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}
}
