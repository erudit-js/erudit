<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ToProseElement } from 'tsprose';

import Block from '../../app/shared/block/Block.vue';
import type { DependencySchema } from './dependency/core.js';
import { referenceSchema, type ReferenceSchema } from './reference/core.js';
import type { LinkStorage } from './storage.js';
import { useProseContext } from '../../app/composables/context.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { useFormatText } from '../../app/composables/formatText.js';
import { useElementPhrase } from '../../app/composables/language.js';
import { useElementIcon } from '../../app/composables/elementIcon.js';
import type { ReferencePhrases } from './reference/phrases.js';
import type { ElementPhrases } from '../../app/language/element.js';

const { element } = defineProps<{
  element: ToProseElement<ReferenceSchema> | ToProseElement<DependencySchema>;
}>();

const { EruditLink, EruditIcon, eruditIcons } = useProseContext();
const referencePhrase = (await useElementPhrase(
  referenceSchema.name,
)) as ReferencePhrases;
const linkStorage = (await useElementStorage(element as any)) as LinkStorage;
const formatText = useFormatText();

const elementPhrase = ref<ElementPhrases>();
const elementIcon = ref<string>();

if (linkStorage.type === 'unique') {
  elementPhrase.value = await useElementPhrase(linkStorage.schemaName);
  elementIcon.value = await useElementIcon(linkStorage.schemaName);
}

interface UIData {
  header: {
    icon: string;
    text: string;
  };
  main: string;
  footer?: {
    icon?: string;
    text: string;
  };
}

const uiData: UIData = await (async () => {
  switch (linkStorage.type) {
    case 'unique': {
      return {
        header: {
          icon: elementIcon.value!,
          text: linkStorage.elementTitle || elementPhrase.value!.element_name,
        },
        main: element.data.label,
        footer: linkStorage.content
          ? {
              icon: eruditIcons[
                linkStorage.content.contentType === 'topic'
                  ? linkStorage.content.topicPart
                  : linkStorage.content.contentType
              ],
              text: linkStorage.content.contentTitle,
            }
          : undefined,
      } as UIData;
    }
    case 'contentItem':
      return {
        header: {
          icon: eruditIcons[
            linkStorage.content.contentType === 'topic'
              ? linkStorage.content.topicPart
              : linkStorage.content.contentType
          ],
          text: linkStorage.content.contentTitle,
        },
        main: element.data.label,
      } as UIData;
    case 'external':
      return {
        header: {
          icon: 'arrow/outward-box',
          text: referencePhrase.external_link,
        },
        main: element.data.label,
      } as UIData;
    case 'error':
      return {
        header: {
          text: referencePhrase.broken_link,
        },
        main: element.data.label,
      } as UIData;
  }
})();

onMounted(() => {
  if (linkStorage.type === 'error') {
    console.warn(
      `Error in link element with id "${element.id}": ${linkStorage.error}`,
    );
  }
});
</script>

<template>
  <Block :element>
    <EruditLink
      target="_blank"
      :to="linkStorage.type === 'error' ? undefined : linkStorage.resolvedHref"
      :class="[
        `group hocus:bg-(--linkColor)/10 hocus:border-(--linkColor)/40 relative
        block rounded-xl border-2 border-dashed border-(--linkColor)/20
        bg-(--linkColor)/5 transition-[border,background]`,
        linkStorage.type === 'error'
          ? `cursor-not-allowed [--linkColor:var(--color-red-500)]
            dark:[--linkColor:var(--color-red-400)]`
          : '[--linkColor:var(--color-brand)]',
      ]"
    >
      <EruditIcon
        name="arrow/outward"
        class="group-hocus:text-(--linkColor)/20 p-small right-small float-right
          shrink-0 text-[80px] text-(--linkColor)/15"
      />
      <div class="p-(--proseAsideWidth)">
        <div
          class="group-hocus:text-(--linkColor) mb-small gap-small font-medium
            text-(--linkColor)/80 transition-[color]"
        >
          <EruditIcon
            v-if="uiData.header.icon"
            :name="uiData.header.icon"
            class="mr-small relative top-0.5 inline align-baseline text-[1.1em]"
          />
          <span>{{ formatText(uiData.header.text) }}</span>
        </div>
        <div class="text-text-muted">
          {{ formatText(uiData.main) }}
        </div>
        <div
          v-if="uiData.footer"
          class="text-text-dimmed mt-small text-main-xs"
        >
          <EruditIcon
            v-if="uiData.footer.icon"
            :name="uiData.footer.icon"
            class="mr-small relative top-0.5 inline align-baseline"
          />
          <span>{{ formatText(uiData.footer.text) }}</span>
        </div>
      </div>
    </EruditLink>
  </Block>
</template>
