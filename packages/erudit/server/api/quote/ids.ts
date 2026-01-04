export default defineEventHandler(async () => {
    return await ERUDIT.repository.quotes.ids();
});
