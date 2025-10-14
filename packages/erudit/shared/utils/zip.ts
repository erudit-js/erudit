export async function zip(text: string): Promise<string> {
    const encoded = new TextEncoder().encode(text);
    const compressedStream = new Blob([encoded.buffer as ArrayBuffer])
        .stream()
        .pipeThrough(new CompressionStream('gzip'));
    const compressedBuffer = await new Response(compressedStream).arrayBuffer();

    return toBase64(new Uint8Array(compressedBuffer));
}

export async function unzip(input: string): Promise<string> {
    const gzBinary = fromBase64(input);
    const decompressedStream = new Blob([gzBinary.buffer as ArrayBuffer])
        .stream()
        .pipeThrough(new DecompressionStream('gzip'));
    const decompressedBuffer = await new Response(
        decompressedStream,
    ).arrayBuffer();

    return new TextDecoder().decode(decompressedBuffer);
}

/**
 * Convert Uint8Array to base64 safely in both browser and Node.
 */
function toBase64(bytes: Uint8Array): string {
    if (typeof Buffer !== 'undefined') {
        // Node environment
        return Buffer.from(bytes).toString('base64');
    }

    if (typeof btoa !== 'undefined') {
        // Browser environment
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    throw new Error('No base64 encoding function available.');
}

/**
 * Convert base64 string to Uint8Array safely in both browser and Node.
 */
function fromBase64(b64: string): Uint8Array {
    if (typeof Buffer !== 'undefined') {
        // Node environment
        return new Uint8Array(Buffer.from(b64, 'base64'));
    }

    if (typeof atob !== 'undefined') {
        // Browser environment
        const binary = atob(b64);
        const len = binary.length;
        const out = new Uint8Array(len);
        for (let i = 0; i < len; i++) out[i] = binary.charCodeAt(i);
        return out;
    }

    throw new Error('No base64 decoding function available.');
}
