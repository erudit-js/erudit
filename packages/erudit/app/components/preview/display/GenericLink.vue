<script lang="ts" setup>
import type { PreviewDataGenericLink } from '@app/scripts/preview/data/genericLink';
import type { PreviewDisplayProps } from '@app/scripts/preview/display';
import type { PreviewFooter } from '@app/scripts/preview/footer';

const { data } = defineProps<PreviewDisplayProps<PreviewDataGenericLink>>();

const phrase = await usePhrases(
    'external_link',
    'external_link_warn',
    'internal_link',
    'internal_link_warn',
);

const footer: PreviewFooter = {
    iconName: data.external ? 'link-external' : 'link',
    href: data.href,
    primary: data.external ? phrase.external_link : phrase.internal_link,
};

const warnMessage = data.external
    ? phrase.external_link_warn
    : phrase.internal_link_warn;
</script>

<template>
    <PreviewDisplay :footer>
        <div :class="$style.wrapper">
            <div :class="$style.warn">{{ warnMessage }}</div>
            <pre>{{ data.href }}</pre>
        </div>
    </PreviewDisplay>
</template>

<style lang="scss" module>
.wrapper {
    padding: var(--gapBig);

    pre {
        font-family: monospace;
    }
}

.warn {
    color: var(--textMuted);
    margin-bottom: var(--gap);
}
</style>
