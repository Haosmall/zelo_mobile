import { REACTIONS } from "../constants";

const commonFuc = {
	getBase64: (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	},

	totalNumberUnread: (conversations) => {
		if (conversations) {
			return conversations.reduce((n, { numberUnread }) => n + numberUnread, 0);
		}
		return 0;
	},

	getAcronym: (name) => {
		const acronym = name
			.split(/\s/)
			.reduce((response, word) => (response += word.slice(0, 1)), "")
			.toUpperCase();

		return acronym;
	},

	getUniqueListBy: (arr, key) => {
		return [...new Map(arr.map((item) => [item[key], item])).values()];
	},

	getReactionVisibleInfo: (reacts) => {
		const unduplicateReactionTypes = reacts
			.filter(
				(element, index, self) =>
					index === self.findIndex((t) => t.type === element.type)
			)
			.map(({ type }) => type);

		const firstThreeElements = unduplicateReactionTypes.slice(0, 3);

		const reactionVisibleInfo = firstThreeElements
			.map((type) => REACTIONS[type - 1])
			.join("");
		return reactionVisibleInfo;
	},
};

export default commonFuc;
