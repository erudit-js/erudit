<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { autoUpdate } from '@floating-ui/vue';

import generateIcon from '../assets/actions/generate.svg?raw';
import plusIcon from '../../../app/shared/assets/plus.svg?raw';
import { useProseContext } from '../../../app/composables/context.js';
import { useProblemPhrase } from '../composables/phrase.js';
import { DEFAULT_SEED, type ProblemSeed } from '../rng.js';
import ProblemButton from './ProblemButton.vue';

const emits = defineEmits<{ (e: 'generate', seed: ProblemSeed): void }>();

const { EruditTransition, EruditIcon, usePopup } = useProseContext();

const seed = ref<ProblemSeed>(DEFAULT_SEED);
const cogRotation = ref(0);
const usingCustomSeed = ref(false);

function generate() {
  cogRotation.value += 180;

  if (usingCustomSeed.value) {
    usingCustomSeed.value = false;
  } else {
    seed.value = Math.floor(Math.random() * 1000000) + 1;
  }

  emits('generate', seed.value);
}

const phrase = await useProblemPhrase();

const containerElement = useTemplateRef('container');
const toggleElement = useTemplateRef('toggle');
const popupElement = useTemplateRef('popup');
const { popupVisible, popupStyles } = usePopup(
  containerElement,
  toggleElement,
  popupElement,
  {
    whileElementsMounted: autoUpdate,
    placement: 'top',
  },
);
</script>

<template>
  <div ref="container">
    <div ref="toggle" class="select-none">
      <ProblemButton @click="generate" class="flex items-center gap-[7px]">
        <EruditIcon
          :name="generateIcon"
          :style="{ transform: `rotate(${cogRotation}deg)` }"
          class="text-[1.3em] transition-[transform] backface-hidden"
        />
        <span>{{ phrase.action_generate }}</span>
      </ProblemButton>
    </div>
    <EruditTransition>
      <div v-if="popupVisible" ref="popup" :style="popupStyles" class="pb-2.5">
        <form
          class="shadow-border text-main-xs flex rounded bg-neutral-900
            text-white shadow-lg dark:bg-neutral-200 dark:text-black"
          @submit.prevent="generate"
        >
          <input
            type="text"
            v-model="seed"
            @input="usingCustomSeed = true"
            :title="phrase.seed_explain"
            @focus="($event as any).target.select()"
            class="max-w-[100px] flex-1 p-[5px] text-center outline-none"
          />
          <button
            v-if="seed !== DEFAULT_SEED"
            type="button"
            @click="
              seed = DEFAULT_SEED;
              usingCustomSeed = true;
              generate();
            "
            class="cursor-pointer pr-[3px]"
          >
            <EruditIcon
              :name="plusIcon"
              class="hocus:text-white dark:hocus:text-black rotate-45
                text-[1.3em] text-neutral-400 transition-[color]
                dark:text-neutral-600"
            />
          </button>
        </form>
      </div>
    </EruditTransition>
  </div>
</template>
