<script lang="ts" setup>
const phrase = await usePhrases('ads_replacer');
</script>

<template>
    <div style="max-height: inherit; overflow: hidden">
        <div style="width: 100vw; height: 100vh"></div>
        <div :class="$style.darkMagicReplacer">
            <div :class="$style.replacer">
                <MyIcon name="pirate" />
                <div v-html="phrase.ads_replacer"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.darkMagicReplacer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    container: darkMagic / size;

    .replacer {
        width: 100%;
        height: 100%;

        font-size: 1.5rem;
        color: var(--textMuted);
        background: var(--bgAccent);

        box-shadow: inset 0px 0px 5px 0px
            light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.05));

        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--gapBig);

        [my-icon] {
            font-size: 65px;
        }

        strong {
            color: inherit;
        }

        @container (max-width: 500px) {
            flex-direction: column;
            gap: var(--gap);

            font-size: 1.2rem;
            text-align: center;

            [my-icon] {
                font-size: 55px;
            }
        }

        @container (max-width: 300px) {
            font-size: 1rem;
        }

        @container (max-height: 200px) {
            [my-icon] {
                display: none;
            }
        }
    }
}
</style>
