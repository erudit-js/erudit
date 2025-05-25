export default defineEventHandler((event) => {
    setHeader(event, 'Content-Type', 'text/plain');
    const robots = `
User-agent: *
Allow: /
    `.trim();

    return robots;
});
