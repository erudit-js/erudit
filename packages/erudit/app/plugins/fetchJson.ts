export default defineNuxtPlugin(() => {
  const fetchJson = $fetch.create({
    responseType: 'json',
  });

  return {
    provide: {
      fetchJson,
    },
  };
});
