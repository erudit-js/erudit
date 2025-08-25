import type { Encoder } from 'flexsearch';

export type EncoderAugments = Partial<
    Record<LanguageCode, (encoder: Encoder) => Encoder>
>;

export const encoderAugments: EncoderAugments = {
    ru: ruEncoder,
};

export function ruEncoder(encoder: Encoder): Encoder {
    encoder.addMatcher('ё', 'е');
    encoder.addMatcher('ться', 'тся');
    encoder.addMatcher('жы', 'жи');
    encoder.addMatcher('шы', 'ши');
    encoder.addMatcher('чя', 'ча');
    encoder.addMatcher('бо', 'бы');
    encoder.addMatcher('рос', 'рас');
    return encoder;
}
