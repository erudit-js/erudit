<template>
  <section :class="[$style.section]">
    <!-- Section Header -->
    <div :class="[$style.header, 'border-border relative border-b-2']">
      <!-- Header Shade -->
      <div
        class="absolute bottom-0 h-[70px] w-full bg-linear-to-t from-[#f7f7f7]
          to-transparent dark:from-[#1b1b1b]"
      ></div>

      <!-- Header Content -->
      <div :class="[$style.headerContent, 'relative z-1']">
        <slot name="header"></slot>
      </div>
    </div>

    <!-- Section Body -->
    <div :class="[$style.body, 'bg-bg-main relative z-1']">
      <slot></slot>
    </div>
  </section>
</template>

<style module>
.section:nth-child(1 of .section) {
  .header {
    display: none;
  }
  .body {
    background: transparent;
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
