// TODO: Push this shit into <SiteAside /> or make composable or make something...

export enum AsideType {
    Major = 'major',
    Minor = 'minor',
}

export const switchVisible = ref<boolean>(true);
export const forcedAside = ref<AsideType>();

export const clickTargets: {
    major: HTMLElement[];
    minor: HTMLElement[];
} = {
    major: [],
    minor: [],
};

if (import.meta.client) {
    //
    // Switch visibility logic
    //

    let lastY = window.scrollY;
    let sumDelta = 0;
    let scrollTimeout: any;

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        sumDelta += delta;

        switchVisible.value = sumDelta <= -1;

        lastY = currentY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            sumDelta = 0;
        }, 200);
    });

    //
    // Unpin forced asides when click outside logic
    //

    window.addEventListener('click', (e) => {
        if (forcedAside.value) {
            const toIgnoreTargets = clickTargets[forcedAside.value]; // Ignore currently pinned aside elements

            for (const target of toIgnoreTargets)
                if (target.contains(e.target as Element)) return;

            forcedAside.value = undefined;
            switchVisible.value = true;
        }
    });
}
