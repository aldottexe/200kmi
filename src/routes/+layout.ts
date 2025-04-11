import * as partLibrary from '$lib/partLibrary.json';
import * as articleLibrary from '$lib/articleLibrary.json';
import type { LayoutLoad } from './$types';

export const load : LayoutLoad = () =>  {
	const pl = partLibrary.default;

	let categories: Map<string, Set<string>> = new Map();

	Object.entries(pl).forEach(p => {
		p[1].tags?.forEach(tagName => {

			if(!categories.has(tagName))
				categories.set(tagName, new Set())

				categories.get(tagName)?.add(p[0])
	});
	});

	const al = articleLibrary.default;
	const articles = Object.keys(al).map(key => ({"title": al[key].title, "id": key}));
	

	return { 
		"pageNames": Object.keys(pl),
		"pageNamesTagged": categories,
		"articles": articles,
	};
}
