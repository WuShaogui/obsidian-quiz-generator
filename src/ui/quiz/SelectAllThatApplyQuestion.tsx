import { App, Component, MarkdownRenderer } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { SelectAllThatApply } from "../../utils/types";

interface SelectAllThatApplyQuestionProps {
	app: App;
	question: SelectAllThatApply;
}

const SelectAllThatApplyQuestion = ({ app, question }: SelectAllThatApplyQuestionProps) => {
	const [userAnswer, setUserAnswer] = useState<number[]>([]);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const questionRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [showSource, setShowSource] = useState(false);
	const sourceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const component = new Component();

		if(!submitted)
		{
			question.question.split("\\n").forEach(questionFragment => {
				if (questionRef.current) {
					MarkdownRenderer.render(app, questionFragment, questionRef.current, "", component);
				}
			});	
		}

		buttonRefs.current = buttonRefs.current.slice(0, question.options.length);
		buttonRefs.current.forEach((button, index) => {
			if (button && !submitted) {
				MarkdownRenderer.render(app, question.options[index], button, "", component);
			}
		});

		// 显示答案
		if (showSource && sourceRef.current) {
			const formattedSource = question.source.replace(/\\n/g, '\n');
			MarkdownRenderer.render(app, formattedSource, sourceRef.current, "", component);
		}
	}, [app, question,showSource]);

	const toggleSelection = (buttonAnswer: number) => {
		setUserAnswer(prevUserAnswer => {
			if (prevUserAnswer.includes(buttonAnswer)) {
				return prevUserAnswer.filter(answer => answer !== buttonAnswer);
			} else {
				return [...prevUserAnswer, buttonAnswer];
			}
		});
	};

	const getButtonClass = (buttonAnswer: number) => {
		if (submitted) {
			const correct = question.answer.includes(buttonAnswer);
			const selected = userAnswer.includes(buttonAnswer);
			if (correct && selected) return "select-all-that-apply-button-qg correct-choice-qg";
			if (correct) return "select-all-that-apply-button-qg correct-choice-qg not-selected-qg";
			if (selected) return "select-all-that-apply-button-qg incorrect-choice-qg";
		} else if (userAnswer.includes(buttonAnswer)) {
			return "select-all-that-apply-button-qg selected-choice-qg";
		}
		return "select-all-that-apply-button-qg";
	};

	const getClass = () => {
		if(submitted){
			return "source-qg-border"; 
		}
		else{
			return "source-qg-no-border";
		}
	};

	return (
		<div className="question-container-qg">
			<div className="question-qg" ref={questionRef} />
			<div className="select-all-that-apply-container-qg">
				{question.options.map((_, index) => (
					<button
						key={index}
						ref={(el) => buttonRefs.current[index] = el}
						className={getButtonClass(index)}
						onClick={() => toggleSelection(index)}
						disabled={submitted}
					/>
				))}
			</div>
			<button
				className="submit-answer-qg"
				onClick={() => {
					setSubmitted(true);
					setShowSource(true);
				}}
				disabled={!userAnswer.length || submitted}
			>
				Submit
			</button>
			<div className={getClass()} ref={sourceRef} />
		</div>
	);
};

export default SelectAllThatApplyQuestion;
