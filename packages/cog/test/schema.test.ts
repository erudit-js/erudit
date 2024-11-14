import {
    contentTypes,
    isContentType,
    isTopicPart,
    topicParts,
} from '../src/schema';

describe('isTopicPart', () => {
    it.each(topicParts)(
        'should return true for a topic part %p',
        (topicPart) => {
            expect(isTopicPart(topicPart)).toBe(true);
        },
    );

    it.each(['foo'])(
        'should return false for a non-topic part %p',
        (notTopicPart) => {
            expect(isTopicPart(notTopicPart)).toBe(false);
        },
    );
});

describe('isContentType', () => {
    it.each(contentTypes)(
        'should return true for a content type %p',
        (contentType) => {
            expect(isContentType(contentType)).toBe(true);
        },
    );

    it.each(topicParts)(
        'should return true for a topic part %p',
        (topicPart) => {
            expect(isContentType(topicPart)).toBe(true);
        },
    );

    it.each(['foo'])(
        'should return false for a non-content type %p',
        (notContentType) => {
            expect(isTopicPart(notContentType)).toBe(false);
        },
    );
});
