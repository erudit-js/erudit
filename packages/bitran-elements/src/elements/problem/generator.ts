export type ProblemSeed = string | number;
export type ProblemGeneratorReturn = Record<string, string | number>;
export type ProblemGenerator = (
    random: Randomizer,
) => ProblemGeneratorReturn | Promise<ProblemGeneratorReturn>;
export interface ProblemGeneratorData {
    generator: ProblemGenerator;
    defaultSeed: ProblemSeed;
}

export function defineProblemGenerator(
    generator: ProblemGenerator,
    initialSeed: ProblemSeed = 'erudit-is-awesome',
): ProblemGeneratorData {
    return {
        generator,
        defaultSeed: initialSeed,
    };
}

//
// RNG
//

function normalizeSeed(seed: ProblemSeed) {
    if (typeof seed === 'number') return seed;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function splitmix32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x9e3779b9) | 0;
        let t = seed ^ (seed >>> 16);
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ (t >>> 15);
        t = Math.imul(t, 0x735a2d97);
        return (t = t ^ (t >>> 15)) >>> 0;
    };
}

export class Randomizer {
    private _rng: () => number;

    constructor(seed: ProblemSeed) {
        const normalizedSeed = normalizeSeed(seed);
        this._rng = splitmix32(normalizedSeed);
    }

    rng() {
        return this._rng();
    }

    boolean() {
        return this.rng() % 2 === 0;
    }

    integer(min: number, max: number) {
        const range = max - min + 1;
        return (this.rng() % range) + min;
    }

    float(min: number, max: number, decimals: number) {
        const range = max - min;
        const randomValue = (this.rng() / 0xffffffff) * range + min;
        return parseFloat(randomValue.toFixed(decimals));
    }

    shuffle<T>(arr: T[]) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.rng() % (i + 1);
            [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
        }
        return shuffled;
    }

    arrayElement<T>(arr: T[]) {
        if (arr.length === 0) return undefined;
        const index = this.rng() % arr.length;
        return arr[index];
    }

    arrayElements<T>(arr: T[], count: number, unique = true) {
        if (arr.length === 0) return [];

        const result: T[] = [];

        if (unique) {
            const shuffled = this.shuffle(arr);
            for (let i = 0; i < count && i < shuffled.length; i++) {
                result.push(shuffled[i]!);
            }
        } else {
            for (let i = 0; i < count; i++) {
                const index = this.rng() % arr.length;
                result.push(arr[index]!);
            }
        }

        return result;
    }
}
