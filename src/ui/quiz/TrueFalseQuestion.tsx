import { App, Component, MarkdownRenderer } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { TrueFalse } from "../../utils/types";

interface TrueFalseQuestionProps {
	app: App;
	question: TrueFalse;
}

const TrueFalseQuestion = ({ app, question }: TrueFalseQuestionProps) => {
	const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
	const questionRef = useRef<HTMLDivElement>(null);
	const [showSource, setShowSource] = useState(false);
	const sourceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const component = new Component();
		question.question.split("\\n").forEach(questionFragment => {
			if (!showSource && questionRef.current) {
				MarkdownRenderer.render(app, questionFragment, questionRef.current, "", component);
			}
		});
		
		if (showSource && sourceRef.current) {
			const formattedSource = question.source.replace(/\\n/g, '\n');
			MarkdownRenderer.render(app, formattedSource, sourceRef.current, "", component);
		}

	}, [app, question,showSource]);

	const handleAnswer = (answer: boolean) => {
		setUserAnswer(answer);
		setShowSource(true);
	};

	const getButtonClass = (buttonAnswer: boolean) => {
		if (userAnswer === null) return "true-false-button-qg";
		const correct = buttonAnswer === question.answer;
		const selected = buttonAnswer === userAnswer;
		if (correct && selected) return "true-false-button-qg correct-choice-qg";
		if (correct) return "true-false-button-qg correct-choice-qg not-selected-qg";
		if (selected) return "true-false-button-qg incorrect-choice-qg";
		return "true-false-button-qg";
	};

	const getClass = () => {
		if(userAnswer != null){
			return "source-qg-border"; 
		}
		else{
			return "source-qg-no-border";
		}
	};

	return (
		<div className="question-container-qg">
			<div className="question-qg" ref={questionRef} />
			<div className="true-false-container-qg">
				<button
					className={getButtonClass(true)}
					onClick={() => {handleAnswer(true);}}
					disabled={userAnswer !== null}
				>
					True
				</button>
				<button
					className={getButtonClass(false)}
					onClick={() => handleAnswer(false)}
					disabled={userAnswer !== null}
				>
					False
				</button>
			</div>
			<div className={getClass()} ref={sourceRef} />
		</div>
	);
};

export default TrueFalseQuestion;
