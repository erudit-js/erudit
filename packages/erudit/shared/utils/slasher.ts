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

    // Collapse runs of slashes
    if (opts.dedupe) {
        s = s.replace(/\/{2,}/g, '/');
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
