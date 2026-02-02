export default defineEventHandler(async () => {
  const phraseRoutes = Object.keys(ERUDIT.language.phrases).map(
    (phraseKey) => `/api/language/phrase/${phraseKey}`,
  );

  return ['/api/language/functions', ...phraseRoutes];
});
