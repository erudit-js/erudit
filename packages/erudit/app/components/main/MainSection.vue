<template>
    <section :class="$style.mainSection">
        <div :class="$style.hr">
            <div :class="$style.shade"></div>
            <div v-if="$slots.header" :class="$style.header">
                <slot name="header"></slot>
            </div>
        </div>
        <div :class="$style.content">
            <slot></slot>
        </div>
    </section>
</template>

<style module>
.mainSection {
    .hr {
        position: relative;
        border-bottom: 2px solid var(--color-border);
        margin: var(--_pMainY) 0;
        transition: border var(--default-transition-duration)
            var(--default-transition-timing-function);

        .shade {
            position: absolute;
            z-index: 0;
            bottom: 0;
            left: 0;
            height: 50px;
            width: 100%;

            &::before {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--color-bg-aside);
                mask-image: linear-gradient(to bottom, transparent, black);
                transition: background var(--default-transition-duration)
                    var(--default-transition-timing-function);
            }
        }

        .header {
            position: relative;
            z-index: 1;
        }
    }

    &:nth-child(even of .mainSection) {
        .hr {
            transform: scaleY(-1);

            .header {
                transform: scaleY(-1);
            }
        }
    }

    .content {
        position: relative;
        z-index: 1;
    }
}

:not(.mainSection):has(+ .mainSection) {
    position: relative;
    z-index: 1;
}
</style>
