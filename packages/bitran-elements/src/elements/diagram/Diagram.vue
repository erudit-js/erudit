<script lang="ts" setup>
import {
    onMounted,
    onUnmounted,
    useTemplateRef,
    type Ref,
    ref,
    useId,
} from 'vue';
import {
    useElementParseData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type DiagramSchema } from './shared';
import FigureWrapper from '../../figure/FigureWrapper.vue';
import { usePhotoSwipe } from '../../composables/photoswipe';

defineProps<ElementProps<DiagramSchema>>();

const parseData = useElementParseData<DiagramSchema>();
const diagramRaw = parseData.content;
const diagramElement = useTemplateRef('diagram') as Ref<HTMLElement>;
const diagramResolved = ref(diagramRaw);
const { lightbox, initLightbox, registerCaption } = usePhotoSwipe();
const captionElement = ref<HTMLElement | null>(null);
const isInViewport = ref(false);
const errorMessage = ref<string | null>(null);
const hasError = ref(false);

const diagramId = '__mermaid__' + useId();

const latexRegex = {
    display: /\$\$(.*?)\$\$/gs,
    inline: /\$(?!\$)(.*?)(?<!\$)\$/gs,
};

function hasLatex(content: string): boolean {
    return latexRegex.display.test(content) || latexRegex.inline.test(content);
}

async function processLatexContent(content: string): Promise<string> {
    if (!hasLatex(content)) return content;

    await import('katex/dist/katex.min.css');
    const katex = await import('katex');

    const renderMathWithKatex = (
        text: string,
        regex: RegExp,
        displayMode: boolean,
    ): string => {
        return text.replace(regex, (match, latexContent) => {
            return katex.default.renderToString(latexContent, {
                displayMode,
            });
        });
    };

    let processed = content;
    processed = renderMathWithKatex(processed, latexRegex.display, true);
    processed = renderMathWithKatex(processed, latexRegex.inline, false);
    return processed;
}

function copyCSSVariables(sourceEl: HTMLElement, targetEl: HTMLElement) {
    const vars = [
        '--text',
        '--textLabel',
        '--bgNode',
        '--bgLabel',
        '--border',
        '--filled',
        '--link',
    ];
    const computed = getComputedStyle(sourceEl);
    let inlineStyle = '';
    vars.forEach((v) => {
        const value = computed.getPropertyValue(v).trim();
        if (value) {
            inlineStyle += `${v}: ${value}; `;
        }
    });
    targetEl.setAttribute('style', inlineStyle);
}

function setupLightbox(svgElement: SVGElement) {
    const width = Math.min(1000, 0.9 * window.innerWidth);
    const scaleHeightFactor = svgElement.clientHeight / svgElement.clientWidth;

    const slide = svgElement.cloneNode(true) as HTMLElement;
    slide.removeAttribute('width');
    copyCSSVariables(svgElement as any as HTMLElement, slide);

    initLightbox({
        dataSource: [
            {
                html: slide.outerHTML,
                width,
                height: width * scaleHeightFactor,
            },
        ],
    });

    if (captionElement.value) {
        registerCaption(lightbox.value!, captionElement.value);
    }
}

function diagramClick() {
    if (!lightbox.value) {
        const svgElement = diagramElement.value.querySelector('svg')!;
        setupLightbox(svgElement);
    }

    lightbox.value!.loadAndOpen(0);
}

async function renderDiagram() {
    if (!diagramElement.value) return;

    try {
        // Reset error state
        hasError.value = false;
        errorMessage.value = null;

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

        diagramResolved.value = await processLatexContent(diagramRaw);

        await mermaid.parse(diagramResolved.value, { suppressErrors: false });

        const { svg } = await mermaid.render(
            diagramId,
            diagramResolved.value,
            diagramElement.value,
        );

        diagramElement.value.innerHTML = svg;

        const svgElement = diagramElement.value.querySelector('svg');
        svgElement?.addEventListener('click', diagramClick);
    } catch (error) {
        hasError.value = true;
        errorMessage.value =
            error instanceof Error ? error.message : String(error);
    }
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]!;
            if (entry.isIntersecting) {
                isInViewport.value = true;
                renderDiagram();
                observer?.disconnect();
                observer = null;
            }
        },
        { threshold: 0.1 },
    );

    if (diagramElement.value) {
        observer.observe(diagramElement.value);
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
});
</script>

<template>
    <FigureWrapper
        :caption="parseData.caption"
        @captionMounted="(element) => (captionElement = element)"
    >
        <div v-if="hasError" :class="$style.error">
            <div :class="$style.errorMessage">
                <span>Diagram Error:</span> {{ errorMessage }}
            </div>
        </div>
        <div
            v-else
            ref="diagram"
            :class="[$style.diagram, !isInViewport && $style.placeholder]"
        >
            <Loading />
        </div>
    </FigureWrapper>
</template>

<style lang="scss">
@use '../../styles/photoswipe';

[id^='__mermaid__'] {
    --text: color-mix(
        in srgb,
        var(--bitran_text),
        var(--bitran_colorBrand) 15%
    );
    --textLabel: var(--bitran_textMuted);
    --bgNode: color-mix(in srgb, var(--bgMain), var(--bitran_colorBrand) 15%);
    --bgLabel: var(--bgMain);
    --border: color-mix(
        in srgb,
        var(--bitran_colorBorder),
        var(--bitran_colorBrand) 40%
    );
    --filled: color-mix(
        in srgb,
        var(--bitran_colorBorder),
        var(--bitran_colorBrand) 70%
    );
    --link: color-mix(in srgb, var(--text), var(--bgMain) 30%);

    [data-erudit-accent] & {
        --text: color-mix(
            in srgb,
            var(--accentColor_text),
            var(--bitran_text) 30%
        );
        --bgLabel: var(--accentColor_background);
        --border: color-mix(
            in srgb,
            var(--accentColor_border),
            var(--accentColor_text) 15%
        );
        --bgNode: color-mix(
            in srgb,
            var(--accentColor_background),
            var(--accentColor_text) 15%
        );
        --filled: color-mix(
            in srgb,
            var(--accentColor_text),
            var(--bgMain) 20%
        );
    }

    //
    //
    //

    .label {
        font-family: 'Noto Sans', sans-serif !important;
        font-size: 0.9em;
    }

    .katex-display {
        margin: 0 !important;
    }

    .label text,
    .label span {
        fill: var(--text) !important;
        color: var(--text) !important;
    }

    .node rect,
    .node circle,
    .node ellipse,
    .node polygon,
    .node path {
        fill: var(--bgNode) !important;
        stroke: var(--border) !important;
    }

    .flowchart-link {
        stroke: var(--link) !important;
    }

    .edgeLabels .edgeLabel,
    .nodeLabel {
        &,
        * {
            white-space: nowrap !important;
            word-break: keep-all !important;
            overflow-wrap: normal !important;
            hyphens: none !important;
        }
    }

    .edge-thickness-normal {
        stroke-width: 2px !important;
    }

    .edge-pattern-dotted {
        stroke-width: 2px !important;
        stroke-dasharray: 3 2.2 !important;
    }

    .marker {
        fill: var(--link) !important;
        stroke: var(--link) !important;
    }

    .edgeLabel p {
        background-color: var(--bgLabel) !important;
        color: var(--textLabel) !important;
    }

    .label .edgeLabel span {
        color: var(--textLabel) !important;
    }

    .labelBkg {
        background-color: transparent !important;
    }

    strong {
        color: var(--text) !important;
    }

    .fill {
        rect {
            fill: var(--filled) !important;
            stroke: var(--filled) !important;
        }

        .label text,
        .label span,
        .label strong {
            color: white !important;
        }
    }
}
</style>

<style lang="scss" module>
.diagram > svg {
    margin: 0 auto;
    max-width: 100%;
    cursor: pointer;
}

.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    background-color: var(--bgAside);
    border-radius: 4px;
    margin: 16px 0;
    width: 100%;
    border: 1px solid var(--border);

    [my-icon] {
        font-size: 40px;
    }

    [data-erudit-accent] & {
        background-color: color-mix(
            in srgb,
            var(--accentColor_text),
            var(--accentColor_background) 80%
        );
        border: 1px solid var(--accentColor_border);

        [my-icon] {
            color: var(--accentColor_text);
        }
    }
}

.error {
    padding: 16px;
    color: var(--bitran_colorError);
    background-color: rgba(255, 51, 51, 0.1);
    border-radius: 4px;
    border: 1px solid var(--bitran_colorError);
    margin: 16px 0;
    width: 100%;
    text-align: center;
}

.errorMessage {
    font-family: monospace;
    word-break: break-word;

    span {
        font-weight: bold;
    }
}
</style>
