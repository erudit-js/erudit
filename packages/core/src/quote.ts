export type QuoteType = 'cameo' | 'sponsor';

interface BaseQuote {
    type: QuoteType;
    name: string;
    link?: string;
}

export interface CameoQuote extends BaseQuote {
    type: 'cameo';
    icon: string;
    messages: string[];
    avatarUrl: string;
    color: string;
}

export interface SponsorQuote extends BaseQuote {
    type: 'sponsor';
    icon?: string;
    messages?: string[];
    avatarUrl?: string;
    color?: string;
}

export type Quote = CameoQuote | SponsorQuote;

export type QuoteIds = Partial<Record<QuoteType, string[]>>;

//
//
//

export function createQuoteId(type: QuoteType, id: string) {
    return `${type}-${id}`;
}

export function parseQuoteId(quoteId: string): { type: QuoteType; id: string } {
    const parts = quoteId.split('-');
    const type = parts.shift();
    const id = parts.join('-');

    switch (type) {
        case 'cameo':
            return { type: 'cameo', id };
        case 'sponsor':
            return { type: 'sponsor', id };
        default:
            throw new Error(`Unknown quote type of "${quoteId}"!`);
    }
}
