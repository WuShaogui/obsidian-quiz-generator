import { App, Component, MarkdownRenderer } from "obsidian";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShortOrLongAnswer } from "../../../utils/types";

interface ShortOrLongAnswerQuestionProps {
	app: App;
	question: ShortOrLongAnswer;
}

const ShortOrLongAnswerQuestion = ({ app, question }: ShortOrLongAnswerQuestionProps) => {
	const [showAnswer, setShowAnswer] = useState<boolean>(false);
	const component = useMemo<Component>(() => new Component(), []);
	const questionRef = useRef<HTMLDivElement>(null);
	const answerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (questionRef.current) {
			MarkdownRenderer.render(app, question.question, questionRef.current, "", component);
		}
	}, [app, question, component]);

	useEffect(() => {
		if (answerRef.current && showAnswer) {
			MarkdownRenderer.render(app, question.answer, answerRef.current, "", component);
		}
	}, [app, question, component, showAnswer]);

	return (
		<div className="question-container">
			<div className="question" ref={questionRef} />
			{showAnswer
				? <button className="show-answer-button" ref={answerRef} disabled={true} />
				: <button className="show-answer-button" onClick={() => setShowAnswer(true)}>Show answer</button>}
		</div>
	);
}

export default ShortOrLongAnswerQuestion;
