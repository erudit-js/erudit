<script lang="ts" setup>
import { previewVisible } from '@app/scripts/preview/state';
import {
    AsideType,
    clickTargets,
    forcedAside,
    switchVisible,
} from '@app/scripts/aside';

const props = defineProps<{
    type: AsideType;
}>();

const $style = useCssModule();

const switchElement = useTemplateRef('switchElement');
const asideElement = useTemplateRef('asideElement');

const mounted = ref(false);

const canShowSwitch = computed(
    () =>
        mounted.value &&
        switchVisible.value &&
        !forcedAside.value &&
        !previewVisible.value,
);

const asideForceVisible = computed(
    () => props.type === forcedAside.value && !previewVisible.value,
);

const typeClass = props.type === AsideType.Major ? $style.major : $style.minor;

onMounted(() => {
    mounted.value = true;

    clickTargets[props.type].push(
        ...[switchElement.value!, asideElement.value!],
    );
});

function switchClick() {
    forcedAside.value = props.type;
}
</script>

<template>
    <div
        ref="switchElement"
        @click="switchClick"
        :class="[
            $style.asideSwitch,
            typeClass,
            canShowSwitch ? $style.visible : '',
        ]"
    >
        <MyIcon name="aside-open" />
    </div>

    <aside
        ref="asideElement"
        :class="[
            $style.aside,
            typeClass,
            asideForceVisible ? $style.forceVisible : '',
        ]"
    >
        <slot></slot>
        <div :class="$style.innerShadow"></div>
    </aside>
</template>

<style lang="scss" module>
@use '$/def/bp';
@use '$/def/z';
@use '$/def/size';

// !!
// !!
// !! Rewrite the whole logic based on coords relative to main content. It will be 1000% easier. See how <Preview> is implemented!
// !!
// !!

@function maxLayoutEdge() {
    @return calc(
        50% - min(var(--wMainMax), calc(100% - 2 * var(--wAside))) / 2
    );
}

@mixin ___asidePositionLogic {
    /* For God's sake, don't ever touch this code */

    --_pos: var(--_posHidden); // Start with hidden position (mobile first)

    --_posHidden: calc(-1 * var(--wAside));
    --_posVisible: var(--_posVisibleCorner);

    --_posVisibleCorner: 0;
    --_posVisibleMax: calc(#{maxLayoutEdge()} - var(--wAside));

    &.major.forceVisible,
    &.minor.forceVisible {
        --_pos: var(--_posVisible); // Always visible when forced
    }

    &.major {
        left: var(--_pos);

        @include bp.above('aside1') {
            --_posVisible: var(--_posVisibleCorner);
            --_pos: var(--_posVisible);
        }

        @include bp.above('aside2') {
            --_posVisible: var(--_posVisibleMax);
        }
    }

    &.minor {
        right: var(--_pos);

        @include bp.above('aside2') {
            --_posVisible: var(--_posVisibleMax);
            --_pos: var(--_posVisible);
        }
    }
}

.aside {
    //
    // Global
    //

    position: fixed;
    z-index: z.$aside;
    top: 0;

    width: var(--wAside);
    height: 100dvh;

    background: var(--bgAside);
    backdrop-filter: initial;

    --shadowColor: #{rgba(black, 0.065)};

    @include transition(left, right, background, backdrop-filter, box-shadow);

    @include dark {
        --shadowColor: #{rgba(white, 0.075)};
    }

    //

    @include ___asidePositionLogic;

    //
    // Global States
    //

    @mixin asideVisible {
    }

    @mixin asideHidden {
    }

    @mixin asideModal {
        background: color-mix(
            in srgb,
            color-mix(in srgb, var(--bgAside), black 0%),
            transparent 22%
        );
        backdrop-filter: blur(10px);

        box-shadow:
            0px 0px 15px 15px rgba(0, 0, 0, 0.1),
            0px 0px 8px 0px rgba(0, 0, 0, 0.1);

        @include dark {
            background: color-mix(in srgb, var(--bgAside), transparent 10%);

            box-shadow:
                0px 0px 15px 15px rgba(255, 255, 255, 0.025),
                0px 0px 8px 0px rgba(255, 255, 255, 0.03);
        }
    }

    &.major {
        //
        // Major Aside
        //

        box-shadow: -1px 0px 2px 0px var(--shadowColor);

        @include bp.above('aside1') {
            //
            // Major Visible
            //

            @include asideVisible;
        }

        @include bp.below('aside1') {
            //
            // Major Hidden
            //

            @include asideHidden;

            &.forceVisible {
                //
                // Major Modal
                //

                @include asideModal;
            }
        }
    }

    &.minor {
        //
        // Minor Aside
        //

        box-shadow: 1px 0px 2px 0px var(--shadowColor);

        @include bp.above('aside2') {
            //
            // Minor Visible
            //

            @include asideVisible;
        }

        @include bp.below('aside2') {
            //
            // Minor Hidden
            //

            @include asideHidden;

            &.forceVisible {
                //
                // Minor Modal
                //

                @include asideModal;
            }
        }
    }
}

//
//
//

@mixin ___switchPositionLogic {
    /* For God's sake, don't ever touch this code */

    --_switchSize: calc(var(--iconSize) + 2 * var(--p) + var(--m));

    --_pos: var(--_posHidden);

    --_posVisible: calc(var(--_posHidden) + var(--_switchSize));
    --_posHidden: var(--_posBehindCorner);

    --_posBehindCorner: calc(-1 * var(--_switchSize));
    --_posBehindMajorAside: calc(var(--wAside) - var(--_switchSize));
    --_posBehindFullLayout: calc(#{maxLayoutEdge()} - var(--_switchSize));

    &.visible {
        --_pos: var(--_posVisible);
    }

    &.major {
        left: var(--_pos);

        @include bp.above('aside1') {
            --_posHidden: var(--_posBehindMajorAside);
            --_posVisible: var(--_posHidden);
        }
    }

    &.minor {
        right: var(--_pos);

        @include bp.above('aside2') {
            --_posVisible: var(--_posHidden);
        }
    }

    &.major,
    &.minor {
        @include bp.above('aside2') {
            --_posHidden: var(--_posBehindFullLayout);
        }
    }
}

.asideSwitch {
    --iconSize: 36px;
    --p: 12px;
    --m: var(--gapBig);

    //

    position: fixed;
    z-index: z.$asideSwitch;
    bottom: 0;

    font-size: var(--iconSize);
    padding: var(--p);
    margin: var(--gapBig);

    background: #8c8c8c;
    color: var(--bgMain);
    box-shadow: 0px 0px 20px 20px var(--bgMain);
    opacity: 0.95;

    cursor: pointer;

    @include transition(left, right, opacity, box-shadow);

    @include dark {
        background: #8c8c8c;
    }

    &:hover {
        opacity: 1;
    }

    &.minor {
        svg {
            transform: scaleX(-1);
        }
    }

    @mixin invisible {
        box-shadow: none; /* TODO: Fix missing fade-out transition! */
    }

    //

    @include ___switchPositionLogic;

    &:not(.visible) {
        @include invisible;
    }
    &.major {
        @include bp.above('aside1') {
            @include invisible;
        }
    }
    @include bp.above('aside2') {
        @include invisible;
    }
}

//
//
//

.innerShadow {
    position: absolute;
    z-index: 9999;
    top: 0;
    width: 30px;
    height: 100%;
    pointer-events: none;
    touch-action: none;
    box-shadow: -1px 0px 2px 0px
        color-mix(in srgb, var(--invert), transparent 93%) inset;

    @include transition(box-shadow);

    .major & {
        right: 0;

        @include bp.below('aside1') {
            box-shadow: none;
        }
    }

    .minor & {
        left: 0;
        transform: scaleX(-1);

        @include bp.below('aside2') {
            box-shadow: none;
        }
    }
}
</style>
