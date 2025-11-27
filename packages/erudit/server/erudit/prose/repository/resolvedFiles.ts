export async function applyResolvedFiles(files: Set<string>) {
    for (const file of files) {
        await ERUDIT.db
            .insert(ERUDIT.db.schema.files)
            .values({
                path: file,
            })
            .onConflictDoNothing();
    }
}
