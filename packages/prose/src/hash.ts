export function hash(text: string, length: number): string {
    //
    // I don't know what is going on here.
    // But ChatGPT 5 said it is fast, non-cryptographic, stable and has good distribution.
    // Who am I to argue with that?
    //

    text = text.toString();

    if (length <= 0) return '';
    // Clamp to a sane upper bound; callers can still request large but we avoid runaway loops.
    if (length > 256) length = 256; // defensive; adjust if you need longer ids.

    const ALPHABET =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 62

    // 64-bit FNV offset basis & prime
    let h1 = 0xcbf29ce484222325n; // FNV offset
    const FNV_PRIME = 0x100000001b3n;
    // Second state uses a different initialization (arbitrary odd constants)
    let h2 = 0x9e3779b97f4a7c15n; // 2^64 * golden ratio

    for (let i = 0; i < text.length; i++) {
        const code = BigInt(text.charCodeAt(i));
        // FNV-1a on h1
        h1 ^= code;
        h1 = (h1 * FNV_PRIME) & 0xffffffffffffffffn;
        // Mix into h2 with different pattern (add, rotate, xor)
        h2 += code * 0x9e3779b97f4a7c15n;
        h2 &= 0xffffffffffffffffn;
        // Rotate left 27 (simulate via shifts)
        h2 = ((h2 << 27n) | (h2 >> 37n)) & 0xffffffffffffffffn;
        h2 ^= 0xa0761d6478bd642fn; // avalanching constant
    }

    // Final mixing (similar to MurmurHash3 fmix64 steps) to diffuse bits
    function fmix64(x: bigint): bigint {
        x ^= x >> 33n;
        x = (x * 0xff51afd7ed558ccdn) & 0xffffffffffffffffn;
        x ^= x >> 33n;
        x = (x * 0xc4ceb9fe1a85ec53n) & 0xffffffffffffffffn;
        x ^= x >> 33n;
        return x & 0xffffffffffffffffn;
    }

    let state = fmix64(h1 ^ (h2 << 1n));
    let extra = fmix64(h2 ^ (h1 << 1n));
    // Combine to enlarge entropy pool
    state ^= extra;
    state &= 0xffffffffffffffffn;

    // Base62 encode helper (no leading zeros trimming issues since we always need chars)
    function emitBase62(n: bigint): string {
        let out = '';
        // Ensure at least 1 digit
        do {
            out = ALPHABET[Number(n % 62n)] + out;
            n /= 62n;
        } while (n > 0n);
        return out;
    }

    let out = '';
    while (out.length < length) {
        // Encode current state
        out += emitBase62(state);
        if (out.length >= length) break;
        // Xorshift* style evolution for next chunk (constants from wyhash/xxhash style domain)
        state ^= state << 17n;
        state &= 0xffffffffffffffffn;
        state ^= state >> 31n;
        state ^= state << 8n;
        state &= 0xffffffffffffffffn;
        state =
            (state * 0x9e3779b97f4a7c15n + 0x632be59bd9b4e019n + extra) &
            0xffffffffffffffffn;
        // Slightly perturb extra too to avoid cycles when input tiny
        extra ^= state + 0x94d049bb133111ebn;
        extra &= 0xffffffffffffffffn;
    }

    if (out.length > length) out = out.slice(0, length);
    return out;
}
