import * as partLibrary from '$lib/partLibrary.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const { slug } = params;

    const pageData = partLibrary.default[slug];

    if (!pageData) {
        throw new Error('Page not found');
    }

    return {
        title: pageData.title,
        desc_short: pageData.desc_short,
        desc_long: pageData.desc_long,
        parts: pageData.parts,
        connecting: pageData.connecting,
        tags: pageData.tags,
        res: pageData.res,
    };
}
