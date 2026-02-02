<template>
  <main
    class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) micro:text-[18px]
      relative px-0 text-[15px] transition-[padding]"
  >
    <div class="text-main" data-erudit-main>
      <Preview />
      <div class="bg-bg-main min-h-dvh dark:bg-[#212121]">
        <slot></slot>
      </div>
    </div>
  </main>
</template>
