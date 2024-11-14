export function eruditAsset(path: string) {
    return '/_erudit-asset/' + path;
}

export function contributorAsset(path: string) {
    return '/_user-asset/contributor/' + path;
}

export function contentAsset(path: string) {
    return '/_user-asset/content/' + path;
}

export function publicAsset(path: string) {
    return '/_user-asset/public/' + path;
}
