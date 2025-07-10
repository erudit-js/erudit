<script lang="ts" setup>
import type { QuickLinks } from '@shared/quickLink';

interface FrontQuickLink {
    label: string;
    link: string;
    elementTitle: string;
    elementIcon: string;
}

const props = defineProps<{ links: QuickLinks }>();
const pretty = useFormatText();

const frontQuickLinks: FrontQuickLink[] = [];
for (const link of props.links) {
    const elementIcon = await useBitranElementIcon(link.elementName);
    const elementLanguage = await useBitranElementLanguage(link.elementName);
    frontQuickLinks.push({
        label: link.label,
        link: link.link,
        elementTitle: elementLanguage('_element_title'),
        elementIcon: elementIcon,
    });
}
</script>

<template>
    <nav :class="$style.quickLinks">
        <ul>
            <li v-for="frontQuickLink of frontQuickLinks">
                <EruditLink
                    :to="frontQuickLink.link"
                    :title="frontQuickLink.elementTitle"
                    :class="$style.quickLink"
                >
                    <MyRuntimeIcon
                        name="quick-link-icon"
                        :svg="frontQuickLink.elementIcon"
                        :class="$style.quickLinkIcon"
                    />
                    <span :class="$style.quickLinkLabel">
                        {{ pretty(frontQuickLink.label) }}
                    </span>
                </EruditLink>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
@use '$/def/bp';

.quickLinks {
    --_erudit_quickLink_bg: var(--bgMain);

    > ul {
        list-style: none;
        padding: 0;
        margin: 0;

        display: flex;
        flex-wrap: wrap;
        gap: var(--gap);

        @include bp.below('mobile') {
            gap: var(--gapSmall);
        }

        .quickLink {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--textMuted);
            font-size: 0.85em;
            text-decoration: none;
            box-shadow: 0px 0px 0px 0px transparent;
            background: var(--_erudit_quickLink_bg);

            @include transition(color, border, box-shadow);

            border: 1px solid var(--border);
            border-radius: 5px;
            padding: 3px 7px;

            &:hover {
                color: var(--brand);
                border-color: var(--brand);
                box-shadow: 0px 0px 0px 2px
                    color-mix(in srgb, var(--brand), transparent 70%);
            }

            [my-icon] {
                flex-shrink: 0;
                font-size: 0.9em;
            }
        }
    }
}
</style>
