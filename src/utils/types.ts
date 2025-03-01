export type Question = TrueFalse | MultipleChoice | SelectAllThatApply | FillInTheBlank | Matching | ShortOrLongAnswer;

export interface Quiz {
	questions: Question[];
}

export interface TrueFalse {
	question: string;
	answer: boolean;
	source: string;
}

export interface MultipleChoice {
	question: string;
	options: string[];
	answer: number;
	source: string;
}

export interface SelectAllThatApply {
	question: string;
	options: string[];
	answer: number[];
	source: string;
}

export interface FillInTheBlank {
	question: string;
	answer: string[];
	source: string;
}

export interface Matching {
	question: string;
	answer: {
		leftOption: string;
		rightOption: string;
	}[];
	source: string;
}

export interface ShortOrLongAnswer {
	question: string;
	answer: string;
	source: string;
}
