import * as partLibrary from '$lib/partLibrary.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const { slug } = params;
    console.log("page-slug:", slug);
    console.log("whole-library:", partLibrary);
    const pageData = partLibrary.default[slug];
    console.log("page-data: ", pageData);

    if (!pageData) {
        throw new Error('Page not found');
    }

    return{
    title: pageData.title,
    desc_short: pageData.desc_short,
    desc_long: pageData.desc_long,
    parts: pageData.parts,
    connecting: pageData.connecting,
    tags: pageData.tags,
  };
}
