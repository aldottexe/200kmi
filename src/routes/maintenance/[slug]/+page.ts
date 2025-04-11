import * as articleLibrary from '$lib/articleLibrary.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const { slug } = params;

    const pageData = articleLibrary.default[slug];

    if (!pageData) {
        throw new Error('Page not found');
    }

    return {
        title: pageData.title,
        intro: pageData.intro,
        steps: pageData.steps,
        outro: pageData.outro,
        res: pageData.res,
    };
}
