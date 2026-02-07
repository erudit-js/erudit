<script setup lang="ts">
import type { ContentExternals } from '@erudit-js/core/content/externals';
import ScrollPane from './ScrollPane.vue';

defineProps<{ externals: ContentExternals }>();

const phrase = await usePhrases('externals_own', 'externals_from');
</script>

<template>
  <ScrollPane class="max-h-[min(500px,30dvh)]">
    <div v-for="group of externals">
      <div
        :class="[
          `border-border gap-small pl-small py-small bg-bg-main relative sticky
          top-0 z-10 flex w-full items-center border-b border-dashed`,
          group.type === 'own'
            ? 'font-semibold text-amber-600 dark:text-amber-400'
            : 'text-text-muted',
        ]"
      >
        <div
          :class="[
            'absolute top-0 left-0 h-full w-full bg-linear-to-t to-transparent',
            group.type === 'own' ? 'from-amber-400/10' : 'from-bg-aside/50',
          ]"
        ></div>
        <MyIcon
          :name="group.type === 'own' ? 'arrow/left' : 'arrow/up-to-right'"
          :class="['relative', group.type === 'own' && '-scale-x-100']"
        />
        <span>
          {{
            group.type === 'own' ? phrase.externals_own : phrase.externals_from
          }}
        </span>
        <span v-if="group.type === 'parent'" class="relative font-semibold">
          {{ formatText(`"${group.title}"`) }}
        </span>
      </div>
      <div>
        <div v-for="external of group.items" class="gap-small py-normal flex">
          <MyIcon
            :name="external.type === 'physical' ? 'book' : 'globe'"
            class="relative top-1 shrink-0"
          />
          <div class="flex flex-col gap-0.5">
            <div>
              <template v-if="external.link">
                <EruditLink
                  external
                  target="_blank"
                  :to="external.link"
                  :class="[external.link && 'text-hover-underline']"
                >
                  {{ formatText(external.title) }}
                  <MyIcon
                    v-if="external.link"
                    name="arrow/outward"
                    class="text-text-disabled text-main-sm relative -top-1
                      inline"
                  />
                </EruditLink>
              </template>
              <template v-else>
                <span>{{ formatText(external.title) }}</span>
              </template>
            </div>
            <div v-if="external.info" class="text-text-muted text-main-sm">
              {{ formatText(external.info) }}
            </div>
            <div class="text-text-muted text-main-sm italic">
              {{ formatText(external.reason) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScrollPane>
</template>
