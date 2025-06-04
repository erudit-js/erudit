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

<style lang="scss" module>
.mainSection {
    .hr {
        position: relative;
        border-bottom: 2px solid var(--border);
        margin: var(--_pMainY) 0;

        .shade {
            position: absolute;
            z-index: 0;
            bottom: 0;
            left: 0;
            height: 50px;
            width: 100%;
            background: linear-gradient(to bottom, transparent, var(--bgAside));
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
