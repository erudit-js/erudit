import {
    PUBLIC_CONTENT_ASSET,
    PUBLIC_CONTRIBUTOR_ASSET,
    PUBLIC_ERUDIT_ASSET,
    PUBLIC_USER_ASSET,
} from '@erudit/const';

export function eruditAsset(path: string) {
    return PUBLIC_ERUDIT_ASSET + path;
}

export function contributorAsset(path: string) {
    return PUBLIC_CONTRIBUTOR_ASSET + path;
}

export function contentAsset(path: string) {
    return PUBLIC_CONTENT_ASSET + path;
}

export function publicAsset(path: string) {
    return PUBLIC_USER_ASSET + path;
}
