import type { EruditConfigDebug } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';

function useFakeUrl(
    fakeApiTarget: keyof EruditConfigDebug['fakeApi'],
): boolean {
    return eruditConfig.debug?.fakeApi?.[fakeApiTarget] ?? import.meta.dev;
}

function getPayload() {
    const nuxt = useNuxtApp();
    const payloadKey = 'external-api';
    const payload =
        (nuxt.static.data[payloadKey] ||=
        nuxt.payload.data[payloadKey] ||=
            {});

    return payload;
}

export async function useExternalApiLanguages() {
    const sharedUrl = eruditConfig.repository?.sharedUrl;
    if (!sharedUrl) return {};

    const payload = getPayload();
    const fake = useFakeUrl('languages');

    if (fake) {
        payload.languages ||= await $fetch('/api/fake/shared/languages');
    } else {
        payload.languages ||= await $fetch(
            `https://api.github.com/repos/${sharedUrl}/contents/languages.json`,
            {
                headers: { Accept: 'application/vnd.github.v3.raw' },
                responseType: 'json',
                //transform: (response: string) => JSON.parse(response),
            },
        );
    }

    return payload.languages;
}

export async function useExternalApiRepository() {
    const repositoryName = eruditConfig.repository?.name;
    const repositoryBranch = eruditConfig.repository?.branch;

    if (!repositoryName || !repositoryBranch) return undefined;

    const payload = getPayload();
    const fake = useFakeUrl('repository');

    if (fake) {
        payload.repository ||= await $fetch('/api/fake/content');
    } else {
        payload.repository ||= await $fetch(
            `https://api.github.com/repos/${repositoryName}/branches/${repositoryBranch}`,
        );
    }

    return payload.repository;
}
