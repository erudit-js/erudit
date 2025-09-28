<script lang="ts" setup>
const { previewState, setPreview, closePreview, setPreviousPreview } =
    usePreview();

onMounted(() => {
    setTimeout(() => {
        setPreview({
            type: PreviewType.DirectLink,
            href: 'aboba.net',
        });
        // currentRequest.value = {
        //     type: PreviewType.UnknownLink,
        //     href: 'aboba.net',
        // };
        // CurrentScreen.value = screenComponents['unknown-link'];
    }, 200);

    // setTimeout(() => {
    //     setPreview({
    //         type: PreviewType.Unique,
    //         uniqueId: 'ourUniqueId',
    //     });
    //     // currentRequest.value = {
    //     //     type: PreviewType.UnknownLink,
    //     //     href: 'aboba.net',
    //     // };
    //     // CurrentScreen.value = screenComponents['unknown-link'];
    // }, 5000);

    // setTimeout(() => {
    //     setPreview({
    //         type: PreviewType.Unique,
    //         uniqueId: 'ourUniqueId',
    //     });
    //     // currentRequest.value = {
    //     //     type: PreviewType.UnknownLink,
    //     //     href: 'aboba.net',
    //     // };
    //     // CurrentScreen.value = screenComponents['unknown-link'];
    // }, 7000);

    // setTimeout(() => {
    //     setPreviousPreview();
    //     // currentRequest.value = {
    //     //     type: PreviewType.UnknownLink,
    //     //     href: 'aboba.net',
    //     // };
    //     // CurrentScreen.value = screenComponents['unknown-link'];
    // }, 12000);
});
</script>

<template>
    <main
        class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) relative px-0 transition-[padding]"
    >
        <ClientOnly>
            <Preview />
        </ClientOnly>
        <div
            class="bg-bg-main py-small min-h-dvh transition-[background] dark:bg-[#212121]"
        >
            <button @click="previewState.opened = !previewState.opened">
                Aboba
            </button>
            <button @click="previewState.blink += 1">Blink</button>
            <button @click="closePreview">Close</button>

            <slot></slot>
            <AdsBannerBottom v-if="adsBottomAllowed()" />
        </div>
    </main>
</template>
