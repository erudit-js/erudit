import { tryParseMathString } from '../../../src/elements/math/inline';

describe('tryParseMathString', () => {
    it('should tokenize simple expressions', () => {
        const result = tryParseMathString('a + b = c');
        expect(result).toEqual({
            type: 'string',
            tokens: [
                { type: 'word', value: 'a' },
                { type: 'other', value: ' + ' },
                { type: 'word', value: 'b' },
                { type: 'other', value: ' = ' },
                { type: 'word', value: 'c' },
            ],
        });
    });

    it('should tokenize expressions with numbers', () => {
        const result = tryParseMathString('2x + 3y = 10');
        expect(result).toEqual({
            type: 'string',
            tokens: [
                { type: 'other', value: '2' },
                { type: 'word', value: 'x' },
                { type: 'other', value: ' + 3' },
                { type: 'word', value: 'y' },
                { type: 'other', value: ' = 10' },
            ],
        });
    });

    it('should tokenize expressions with words', () => {
        const result = tryParseMathString('abc + (def) = ghi');
        expect(result).toEqual({
            type: 'string',
            tokens: [
                { type: 'word', value: 'abc' },
                { type: 'other', value: ' + (' },
                { type: 'word', value: 'def' },
                { type: 'other', value: ') = ' },
                { type: 'word', value: 'ghi' },
            ],
        });
    });

    it('should tokenize expressions with special math symbols', () => {
        const result = tryParseMathString('a * b / c - d');
        expect(result).toEqual({
            type: 'string',
            tokens: [
                { type: 'word', value: 'a' },
                { type: 'other', value: ' * ' },
                { type: 'word', value: 'b' },
                { type: 'other', value: ' / ' },
                { type: 'word', value: 'c' },
                { type: 'other', value: ' - ' },
                { type: 'word', value: 'd' },
            ],
        });
    });

    it('should return undefined for expressions with complex symbols: ^', () => {
        const result = tryParseMathString('a^2 + b^2 = c^2');
        expect(result).toBeUndefined();
    });

    it('should return undefined for expressions with complex symbols: {', () => {
        const result = tryParseMathString('{x');
        expect(result).toBeUndefined();
    });

    it('should return undefined for expressions with complex symbols: }', () => {
        const result = tryParseMathString('x}');
        expect(result).toBeUndefined();
    });

    it('should return undefined for expressions with complex symbols: _', () => {
        const result = tryParseMathString('a_1 + a_2');
        expect(result).toBeUndefined();
    });

    it('should return undefined for expressions with complex symbols: \\', () => {
        const result = tryParseMathString('\\alpha + \\beta');
        expect(result).toBeUndefined();
    });

    it('should tokenize expressions with unicode characters', () => {
        const result = tryParseMathString('α + β = γ');
        expect(result).toEqual({
            type: 'string',
            tokens: [
                { type: 'word', value: 'α' },
                { type: 'other', value: ' + ' },
                { type: 'word', value: 'β' },
                { type: 'other', value: ' = ' },
                { type: 'word', value: 'γ' },
            ],
        });
    });
});
