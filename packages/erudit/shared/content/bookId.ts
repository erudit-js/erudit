export function detectContentBookId(contentId: string, bookIds: string[]) {
    let bestMatch: string | undefined = undefined;
    for (const bookId of bookIds) {
        if (contentId.startsWith(bookId)) {
            if (!bestMatch || bookId.length > bestMatch.length) {
                bestMatch = bookId;
            }
        }
    }
    return bestMatch;
}
