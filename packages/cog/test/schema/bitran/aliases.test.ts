import {
    NO_ALIASES,
    tryReplaceAlias,
} from '../../../src/schema/bitran/aliases';

it('Should return empty object when no aliases are defined', async () => {
    expect(NO_ALIASES()).toEqual({});
});

describe('tryReplaceAlias', () => {
    const aliases = {
        a1: 'foo',
        a2: 'bar',
        a3: 'baz',
    };

    const replaceTargets = ['~a1', '~a2', '~a3'];

    const noTouchTargets = [
        'foo|bar|baz',
        'https://www.google.com',
        '~',
        ' ~a1',
        '~ a1',
        '~a1 ',
        '~a1 a2',
    ];

    const throwTargets = ['~a4'];

    for (const target of replaceTargets) {
        // @ts-ignore
        const replaceValue = aliases[target.substring(1)];

        it(`should replace target "${target}" with "${replaceValue}"`, () => {
            expect(tryReplaceAlias(target, aliases)).toBe(replaceValue);
        });
    }

    it.each(noTouchTargets)('should not change target "%s"', (target) => {
        expect(tryReplaceAlias(target, aliases)).toBe(target);
    });

    it.each(throwTargets)('should throw on target "%s"', (target) => {
        expect(() => tryReplaceAlias(target, aliases)).toThrow();
    });
});
