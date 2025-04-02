import * as partLibrary from '$lib/partLibrary.json';
import type { LayoutLoad } from './$types';

export const load : LayoutLoad = () =>  {
	const names = Object.keys(partLibrary.default) 
	return { 
		"pageNames": names
	};
}
