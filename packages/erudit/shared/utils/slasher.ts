interface SlasherOptions {
    leading?: boolean;
    trailing?: boolean;
    dedupe?: boolean;
    toForward?: boolean;
}

export function slasher(str: string, options: SlasherOptions = {}): string {
    const opts: Required<Pick<SlasherOptions, 'toForward' | 'dedupe'>> &
        SlasherOptions = {
        toForward: true,
        dedupe: true,
        ...options,
    };

    let s = str ?? '';

    // Normalize slashes direction
    if (opts.toForward) {
        s = s.replace(/\\/g, '/');
    }

    // Collapse runs of slashes, but preserve protocol double slashes (http://, https://, file://)
    if (opts.dedupe) {
        // Temporarily replace protocols to protect them
        const protocolPlaceholder = '\x00PROTOCOL\x00';
        const protocols: string[] = [];

        s = s.replace(/(https?|file):\/\//g, (match) => {
            protocols.push(match);
            return protocolPlaceholder;
        });

        // Now dedupe slashes
        s = s.replace(/\/{2,}/g, '/');

        // Restore protocols
        s = s.replace(
            new RegExp(
                protocolPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'g',
            ),
            () => protocols.shift()!,
        );
    }

    // Leading slash handling
    if (options?.leading === true) {
        s = s.replace(/^\/+/, '');
        s = '/' + s;
    } else if (options?.leading === false) {
        s = s.replace(/^\/+/, '');
    }

    // Trailing slash handling
    if (options?.trailing === true) {
        s = s.replace(/\/+$/, '');
        s = s + '/';
    } else if (options?.trailing === false) {
        s = s.replace(/\/+$/, '');
    }

    return s;
}
