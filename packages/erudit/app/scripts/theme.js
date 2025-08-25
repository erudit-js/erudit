/**
 * Setup theme on client side as early as possible to prevent blinking.
 * Script is injected in html <head> via Nitro plugin.
 */
(() => {
    const w = window;
    const d = document;
    const s = localStorage;
    const key = 'theme';

    const getLocalTheme = () => {
        const _localTheme = s.getItem(key) || 'system';
        s.setItem(key, _localTheme);
        return _localTheme;
    };

    const getBinaryTheme = (theme) => {
        switch (theme) {
            case 'dark':
            case 'light':
                return theme;
            case 'system':
                return w.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
        }
    };

    d.documentElement.setAttribute(
        'data-theme',
        getBinaryTheme(getLocalTheme()),
    );
})();
