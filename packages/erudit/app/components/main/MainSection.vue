<template>
    <section :class="[$style.section, 'bg-bg-main transition-[background]']">
        <!-- Section Header -->
        <div
            :class="[
                $style.header,
                'border-border relative border-b-2 transition-[border]',
            ]"
        >
            <!-- Header Shade -->
            <div class="absolute bottom-0 h-[70px] w-full">
                <!-- Light mode gradient -->
                <div
                    class="absolute inset-0 bg-linear-to-t from-[#f7f7f7]
                        to-transparent opacity-100 transition-opacity
                        dark:opacity-0"
                ></div>
                <!-- Dark mode gradient -->
                <div
                    class="absolute inset-0 bg-linear-to-t from-[#1b1b1b]
                        to-transparent opacity-0 transition-opacity
                        dark:opacity-100"
                ></div>
            </div>

            <!-- Header Content -->
            <div :class="[$style.headerContent, 'relative z-1']">
                <slot name="header"></slot>
            </div>
        </div>

        <!-- Section Body -->
        <div class="relative z-1">
            <slot></slot>
        </div>
    </section>
</template>

<style module>
.section:nth-child(1 of .section) {
    .header {
        display: none;
    }
}

.section:not(:nth-child(1 of .section)) {
    position: relative;
}

.section:nth-child(odd of .section) {
    .header {
        transform: scaleY(-1);
    }

    .headerContent {
        transform: scaleY(-1);
    }
}
</style>
