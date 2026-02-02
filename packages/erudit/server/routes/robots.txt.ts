export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain');
  const robots = `
User-agent: *
Allow: /
    `.trim();

  return robots;
});
