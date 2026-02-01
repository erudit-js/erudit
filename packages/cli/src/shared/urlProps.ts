import chalk from 'chalk';

import { cliError } from './cliError.js';

export interface UrlProps {
    siteUrl: string;
    basePath: string;
}

export function retrieveUrlProps(
    siteUrlArg?: string,
    basePathArg?: string,
): UrlProps {
    const finalProps: UrlProps = {
        siteUrl: 'http://localhost:3000',
        basePath: '/',
    };

    if (siteUrlArg) {
        finalProps.siteUrl = siteUrlArg;
    } else if (process.env.ERUDIT_SITE_URL) {
        finalProps.siteUrl = process.env.ERUDIT_SITE_URL;
    }

    if (basePathArg) {
        finalProps.basePath = basePathArg;
    } else if (process.env.ERUDIT_BASE_PATH) {
        finalProps.basePath = process.env.ERUDIT_BASE_PATH;
    }

    return finalProps;
}

export function normalizeUrlProps(urlProps: UrlProps): UrlProps {
    const rawSiteUrl = urlProps.siteUrl || 'http://localhost:3000';

    let url: URL;
    try {
        url = new URL(rawSiteUrl);
    } catch {
        throw cliError(`Invalid site URL: "${rawSiteUrl}"`);
    }

    if (!/^https?:$/.test(url.protocol)) {
        throw cliError(`Site URL must use http or https (got ${url.protocol})`);
    }

    if (url.search || url.hash) {
        throw cliError(`Site URL must not include query or hash`);
    }

    const inferredBasePath =
        url.pathname && url.pathname !== '/'
            ? normalizeBasePath(url.pathname)
            : '/';

    let finalBasePath: '/' | `/${string}/`;

    if (urlProps.basePath !== undefined && urlProps.basePath !== '/') {
        const normalizedProvided = normalizeBasePath(urlProps.basePath);

        if (
            inferredBasePath !== '/' &&
            normalizedProvided !== inferredBasePath
        ) {
            throw cliError(
                `Conflicting base paths:\n` +
                    `  Site URL implies base path "${inferredBasePath}"\n` +
                    `  Explicitly set base path "${normalizedProvided}"\n\n` +
                    `Remove one of them or make them match!`,
            );
        }

        finalBasePath = normalizedProvided;
    } else {
        finalBasePath = inferredBasePath;
    }

    const finalSiteUrl =
        finalBasePath === '/'
            ? `${url.protocol}//${url.host}/`
            : `${url.protocol}//${url.host}${finalBasePath}`;

    return {
        siteUrl: finalSiteUrl,
        basePath: finalBasePath,
    };
}

function normalizeBasePath(input: string): '/' | `/${string}/` {
    if (!input || input === '/') return '/';

    if (input.includes('?') || input.includes('#')) {
        throw cliError(`Base path must not contain ? or #`);
    }

    if (input.includes('://')) {
        throw cliError(`Base path must be a path, not a URL`);
    }

    const trimmed = input.replace(/^\/+|\/+$/g, '');

    return trimmed === '' ? '/' : `/${trimmed}/`;
}

export function logUrlProps(urlProps: UrlProps): void {
    console.log(`Site URL: ${chalk.bold.cyan(urlProps.siteUrl)}`);
    console.log(`Site base path: ${chalk.bold.cyan(urlProps.basePath)}`);
}
