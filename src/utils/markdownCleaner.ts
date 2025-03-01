export const cleanUpNoteContents = (noteContents: string, hasFrontMatter: boolean): string => {
	let cleanedContents = noteContents;
	if (hasFrontMatter) {
		cleanedContents = removeFrontMatter(cleanedContents);
	}
	cleanedContents= removeHexoHead(cleanedContents); // 去掉hexo博客文章特有字符
	// cleanedContents = cleanUpLinks(cleanedContents);
	// cleanedContents = removeMarkdownHeadings(cleanedContents); // 标题不去掉
	// cleanedContents = removeMarkdownFormatting(cleanedContents);
	// return cleanUpWhiteSpace(cleanedContents);
	return cleanedContents;
};

export const cleanUpNoteContents2 = (noteContents: string, hasFrontMatter: boolean): string => {
	let cleanedContents = noteContents;
	if (hasFrontMatter) {
		cleanedContents = removeFrontMatter(cleanedContents);
	}
	cleanedContents= removeHexoHead(cleanedContents); // 去掉hexo博客文章特有字符
	cleanedContents = cleanUpLinks(cleanedContents);
	cleanedContents = removeMarkdownHeadings(cleanedContents); // 标题不去掉
	cleanedContents = removeMarkdownFormatting(cleanedContents);
	return cleanUpWhiteSpace(cleanedContents);
};


const removeHexoHead = (input: string): string => {
	const moreTag = "<!-- more -->";
	const moreIndex = input.indexOf(moreTag);

	if (moreIndex === -1) {
		return input; // 如果没找到标记，返回原文本
	  }
	  
	  // 返回标记之后的内容（不包含标记本身）
	  return input.substring(moreIndex + moreTag.length);
};


const removeFrontMatter = (input: string): string => {
	const yamlFrontMatterRegex = /---[\s\S]+?---\n/;
	return input.replace(yamlFrontMatterRegex, "");
};

const cleanUpLinks = (input: string): string => {
	const wikiLinkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))??]]/;
	const markdownLinkPattern = /\[([^\]]+)]\([^)]+\)/;

	const combinedRegex = new RegExp(`${wikiLinkPattern.source}|${markdownLinkPattern.source}`, "g");

	return input.replace(combinedRegex, (match, wikiLink, wikiDisplayText, markdownLink) => {
		return wikiDisplayText ?? wikiLink ?? markdownLink;
	});
};

const removeMarkdownHeadings = (input: string): string => {
	const headingRegex = /^(#+.*)$/gm;
	return input.replace(headingRegex, "");
};

const removeMarkdownFormatting = (input: string): string => {
	const markdownFormattingRegex = /([*_]{1,3}|~~|==|%%)(.*?)\1/g;
	return input.replace(markdownFormattingRegex, "$2");
};

const cleanUpWhiteSpace = (input: string): string => {
	const consecutiveSpacesRegex = /\s+/g;
	return input.replace(consecutiveSpacesRegex, " ").trim();
};
