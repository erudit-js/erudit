<script lang="ts" setup>
import {
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    shallowRef,
    useCssModule,
    useId,
    useTemplateRef,
} from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { diagramSchema } from './core.js';
import { usePhotoSwipe } from '../../app/shared/photoswipe/composable.js';
import { useProseContext } from '../../app/composables/context.js';
import Caption from '../caption/Caption.vue';
import Block from '../../app/shared/block/Block.vue';

const { element } = defineProps<{
    element: ProseElement<typeof diagramSchema>;
}>();

const style = useCssModule();
const { EruditIcon, loadingSvg } = useProseContext();
const loading = ref(true);
const diagramRendering = ref(false);
const dummyMathHtml = ref('');
const diagramContent = ref(element.children[0].data);
const diagramSvgContent = ref('');
const diagramElement = useTemplateRef('diagram');
const diagramSvgElement = useTemplateRef('diagramSvg');
const diagramUid = useId();
const captionElement = shallowRef<HTMLElement>();
const { lightbox, initLightbox } = usePhotoSwipe();
const latexRegex = {
    display: /\$\$(.*?)\$\$/gs,
    inline: /\$(?!\$)(.*?)(?<!\$)\$/gs,
};

let observer: IntersectionObserver;

onMounted(async () => {
    if (hasLatex(diagramContent.value)) {
        await prepareMathDiagram();
    }

    observer = new IntersectionObserver(diagramIntersectHit, {
        root: null,
        threshold: 0.01,
    });
    observer.observe(diagramElement.value!);
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});

function diagramClick() {
    if (!lightbox.value) {
        const svgElement = diagramSvgElement.value!.querySelector('svg')!;

        const slideSvg = svgElement.cloneNode(true) as SVGSVGElement;
        slideSvg.removeAttribute('width');
        slideSvg.removeAttribute('style');
        slideSvg.classList.add(style.diagram);

        let slideRoot: HTMLElement | SVGSVGElement = slideSvg;
        const accentAncestor = diagramElement.value!.closest(
            '[data-prose-accent]',
        );
        if (accentAncestor) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('data-prose-accent', '');
            const computed = getComputedStyle(accentAncestor as Element);
            for (const prop of computed) {
                if (prop.startsWith('--accent')) {
                    const val = computed.getPropertyValue(prop).trim();
                    if (val) {
                        wrapper.style.setProperty(prop, val);
                    }
                }
            }
            wrapper.appendChild(slideSvg);
            slideRoot = wrapper;
        }

        const width = Math.min(1000, 0.9 * window.innerWidth);
        const scaleHeightFactor =
            svgElement.clientHeight / svgElement.clientWidth;

        const html = `
            <div class="pswp__img-overlay-wrapper" style="position: relative">
                <div class="pswp__img" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"></div>
                ${slideRoot.outerHTML}
            </div>
        `;
        initLightbox(
            {
                dataSource: [
                    {
                        html,
                        width: width,
                        height: width * scaleHeightFactor,
                    },
                ],
            },
            captionElement.value,
        );
    }
    lightbox.value!.loadAndOpen(0);
}

//
//
//

function hasLatex(content: string): boolean {
    return latexRegex.display.test(content) || latexRegex.inline.test(content);
}

async function prepareMathDiagram() {
    await import('katex/dist/katex.min.css');
    const katex = await import('katex');

    const globalCode = '__ERUDIT_DIAGRAM_MATH_DUMMY__';

    if (!(window as any)[globalCode]) {
        dummyMathHtml.value = katex.renderToString(
            '\\sum_{i=1}^n i^2 = \\frac{n(n+1)(2n+1)}{6}',
            {
                displayMode: true,
            },
        );
        (window as any)[globalCode] = true;
    }

    const renderMathWithKatex = (
        text: string,
        regex: RegExp,
        displayMode: boolean,
    ): string => {
        return text.replace(regex, (_, latexContent) => {
            return katex.renderToString(latexContent, {
                displayMode,
            });
        });
    };

    diagramContent.value = renderMathWithKatex(
        diagramContent.value,
        latexRegex.display,
        true,
    );

    diagramContent.value = renderMathWithKatex(
        diagramContent.value,
        latexRegex.inline,
        false,
    );

    await nextTick();
    await new Promise(requestAnimationFrame);
}

async function diagramIntersectHit(entries: IntersectionObserverEntry[]) {
    if (!entries.some((e) => e.isIntersecting)) return;
    if (!loading.value || diagramRendering.value) return;

    diagramRendering.value = true;
    await renderDiagram();
    diagramRendering.value = false;
    loading.value = false;

    observer.disconnect();

    await nextTick();
    const svg = diagramSvgElement.value?.querySelector('svg');
    if (svg) {
        svg.addEventListener('click', diagramClick);
    }
}

async function renderDiagram() {
    const mermaid = (await import('mermaid')).default;

    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        markdownAutoWrap: false,
        flowchart: {
            useMaxWidth: true,
            padding: 10,
            wrappingWidth: 400,
        },
        theme: 'base',
    });

    const { svg } = await mermaid.render(diagramUid, diagramContent.value);

    diagramSvgContent.value = svg;
}
</script>

<template>
    <Block :element>
        <div
            class="fixed -top-[9999px] -left-[9999px]"
            v-html="dummyMathHtml"
        ></div>
        <div ref="diagram">
            <div v-if="loading" class="p-normal text-center">
                <EruditIcon
                    :name="loadingSvg"
                    class="text-text-dimmed inline text-[60px]"
                />
            </div>
            <div
                v-else
                ref="diagramSvg"
                v-html="diagramSvgContent"
                :class="$style.diagram"
            ></div>
        </div>
        <Caption
            v-if="element.children[1]"
            :caption="element.children[1]"
            @captionMounted="(element) => (captionElement = element)"
        />
    </Block>
</template>

<style module>
.diagram {
    > svg {
        margin: auto;
        cursor: pointer;
    }

    /* Text color */

    :global(.edgeLabel) {
        *:not(.katex *):not(.katex) {
            color: var(--color-text-muted) !important;
        }
    }

    :global(.nodeLabel) {
        *:not(.katex *):not(.katex) {
            color: var(--color-text) !important;
        }
    }

    /* Arrows */

    --arrowColor: var(--color-text-dimmed);

    :global(.flowchart-link) {
        stroke: var(--arrowColor) !important;
    }

    :global(.edge-thickness-normal) {
        stroke-width: 2px !important;
    }

    :global(.edge-pattern-dotted) {
        stroke-width: 2px !important;
        stroke-dasharray: 3 2.2 !important;
    }

    :global(.marker) {
        fill: var(--arrowColor) !important;
        stroke: var(--arrowColor) !important;
    }

    :global(.edgeLabel) * {
        background: var(--color-bg-main) !important;
    }

    [data-prose-accent] & {
        --arrowColor: color-mix(
            in hsl,
            var(--accentText) 45%,
            var(--accentBackground)
        );

        :global(.edgeLabel) * {
            background: var(--accentBackground) !important;
        }
    }

    /* Nodes */

    :global(.node) rect,
    :global(.node) path,
    :global(.node) polygon,
    :global(.node) circle,
    :global(.node) ellipse {
        fill: color-mix(in hsl, var(--color-brand) 20%, transparent) !important;
        stroke: color-mix(
            in hsl,
            var(--color-brand) 35%,
            transparent
        ) !important;
    }

    [data-prose-accent] & {
        :global(.node) rect,
        :global(.node) path,
        :global(.node) polygon,
        :global(.node) circle,
        :global(.node) ellipse {
            fill: color-mix(
                in hsl,
                var(--accentText) 30%,
                var(--accentBackground)
            ) !important;
            stroke: color-mix(
                in hsl,
                var(--accentText) 45%,
                var(--accentBackground)
            ) !important;
        }
    }

    /* "fill" node modificator */

    :global(.fill) {
        *:not(.katex *):not(.katex) {
            color: white !important;
        }

        rect,
        path,
        polygon,
        circle,
        ellipse {
            fill: color-mix(
                in hsl,
                var(--color-brand) 75%,
                transparent
            ) !important;
            stroke: transparent !important;
        }

        [data-prose-accent] & {
            rect,
            path,
            polygon,
            circle,
            ellipse {
                fill: color-mix(
                    in hsl,
                    var(--accentText) 70%,
                    var(--color-border)
                ) !important;
                stroke: transparent !important;
            }
        }
    }
}
</style>
