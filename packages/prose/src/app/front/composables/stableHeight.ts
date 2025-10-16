export function waitForStableHeight(stableMs = 100, maxWait = 1000) {
    return new Promise<void>((resolve) => {
        let lastChange = performance.now();
        const observer = new ResizeObserver(() => {
            lastChange = performance.now();
        });
        observer.observe(document.body);

        const check = () => {
            if (performance.now() - lastChange > stableMs) {
                observer.disconnect();
                resolve();
            } else if (performance.now() - lastChange < maxWait) {
                requestAnimationFrame(check);
            } else {
                observer.disconnect();
                resolve();
            }
        };
        check();
    });
}
