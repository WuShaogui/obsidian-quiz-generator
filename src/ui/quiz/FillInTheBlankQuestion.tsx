import { App, Component, MarkdownRenderer, Notice } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { FillInTheBlank } from "../../utils/types";
import AnswerInput from "../components/AnswerInput";

interface FillInTheBlankQuestionProps {
	app: App;
	question: FillInTheBlank;
}

const FillInTheBlankQuestion = ({ app, question }: FillInTheBlankQuestionProps) => {
	const [filledBlanks, setFilledBlanks] = useState<string[]>(Array(question.answer.length).fill(""));
	const questionRef = useRef<HTMLDivElement>(null);
	const [showSource, setShowSource] = useState(false);
	const sourceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const generateQuestion = () => {
			let blankIndex = 0;
			return question.question.replace(/`_+`/g, match => {
				if (blankIndex < filledBlanks.length && filledBlanks[blankIndex] === question.answer[blankIndex]) {
					return filledBlanks[blankIndex++];
				}
				blankIndex++;
				return match;
			});
		};

		const component = new Component();
		if (questionRef.current) {
			questionRef.current.empty();
			generateQuestion().split("\\n").forEach(questionFragment => {
				if (questionRef.current) {
					MarkdownRenderer.render(app, questionFragment, questionRef.current, "", component);
				}
			});
		}

		// 显示答案
		if (showSource && sourceRef.current) {
			const formattedSource = question.source.replace(/\\n/g, '\n');
			MarkdownRenderer.render(app, formattedSource, sourceRef.current, "", component);
		}
	}, [app, question, filledBlanks,showSource]);

	const handleSubmit = (input: string) => {
		const normalizedInput = input.toLowerCase().trim();
		const blankIndex = question.answer.findIndex(
			(blank, index) => blank.toLowerCase() === normalizedInput && !filledBlanks[index]
		);

		if (blankIndex !== -1) {
			setFilledBlanks(prevFilledBlanks => {
				const newFilledBlanks = [...prevFilledBlanks];
				newFilledBlanks[blankIndex] = question.answer[blankIndex];
				return newFilledBlanks;
			});
		} else if (normalizedInput === "skip") {
			setFilledBlanks(question.answer);
		} else {
			new Notice("Incorrect，True result: "+question.answer);
		}

		setShowSource(true);
	};

	const getClass = () => {
		if(showSource){
			return "source-qg-border"; 
		}
		else{
			return "source-qg-no-border";
		}
	};

	return (
		<div className="question-container-qg">
			<div className="question-qg" ref={questionRef} />
			<div className="input-container-qg">
				<AnswerInput onSubmit={handleSubmit} disabled={filledBlanks.every(blank => blank.length > 0)} />
				<div className="instruction-footnote-qg">
					Press enter to submit your answer to a blank. Enter "skip" to reveal all answers.
				</div>
			</div>
			<div className={getClass()} ref={sourceRef} />
		</div>
	);
};

export default FillInTheBlankQuestion;
