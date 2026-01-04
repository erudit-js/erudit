import { createQuoteId } from '@erudit-js/core/quote';

export default defineEventHandler(async () => {
    const routes: string[] = ['/api/quote/ids'];

    const { cameo, sponsor } = await ERUDIT.repository.quotes.ids();

    for (const cameoId of cameo ?? []) {
        routes.push(`/api/quote/data/${createQuoteId('cameo', cameoId)}`);
    }

    for (const sponsorId of sponsor ?? []) {
        routes.push(`/api/quote/data/${createQuoteId('sponsor', sponsorId)}`);
    }

    return routes;
});
