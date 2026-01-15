<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const { personType, persons } = defineProps<{
    personType: 'contributor' | 'sponsor';
    title: string;
    link: string;
    persons: IndexPagePersons;
}>();

const changeInterval = 2500;

const personIds = Object.keys(persons);
const personsNumber = personIds.length;
const avatarsNumber = Math.min(4, personsNumber);
const moreNumber = personsNumber - avatarsNumber;

type DisplayedAvatar = {
    personId: string;
    url: string | undefined;
    color: string | undefined;
};

const displayedAvatars = ref<DisplayedAvatar[]>(
    Array.from({ length: avatarsNumber }, (_, i) => ({
        personId: `dummy-${i}`,
        url: undefined,
        color: undefined,
    })),
);

let intervalId: number | undefined;

function idToAvatarUrl(id: string, extension: string | 0) {
    if (extension === 0) {
        return personType === 'contributor' ? 'user' : 'diamond';
    }

    return withBaseUrl(`/file/${personType}s/${id}/avatar.${extension}`);
}

function getRandomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

onMounted(() => {
    const shuffled = [...personIds].sort(() => Math.random() - 0.5);
    const initialIds = shuffled.slice(0, avatarsNumber);

    displayedAvatars.value = initialIds.map((id) => ({
        personId: id,
        url: idToAvatarUrl(id, persons[id]!),
        color: stringColor(id),
    }));

    if (personsNumber <= avatarsNumber) return;

    intervalId = window.setInterval(() => {
        const usedIds = displayedAvatars.value.map((a) => a.personId);

        const hiddenIds = personIds.filter((id) => !usedIds.includes(id));

        if (!hiddenIds.length) return;

        const slotIndex = Math.floor(
            Math.random() * displayedAvatars.value.length,
        );

        const newPersonId = getRandomFrom(hiddenIds);

        displayedAvatars.value[slotIndex] = {
            personId: newPersonId,
            url: idToAvatarUrl(newPersonId, persons[newPersonId]!),
            color: stringColor(newPersonId),
        };
    }, changeInterval);
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<template>
    <EruditLink
        :to="link"
        class="group gap-normal flex flex-col items-center [--avatarSize:50px]"
    >
        <div
            class="group-hocus:text-brand text-text-muted text-main-lg
                font-semibold transition-[color]"
        >
            {{ title }}
        </div>
        <div class="flex gap-1.5">
            <SmartMedia
                v-for="data in displayedAvatars"
                :key="data.personId"
                :url="data.url"
                :style="{ '--mediaColor': data.color }"
                class="size-(--avatarSize) rounded-full"
            />
            <div
                v-if="moreNumber"
                class="group-hocus:text-brand group-hocus:border-brand
                    border-text-dimmed text-text-muted grid size-(--avatarSize)
                    place-items-center rounded-full border-3 border-dashed
                    text-[17px] leading-none font-semibold
                    transition-[color,border]"
            >
                {{ '+' + moreNumber }}
            </div>
        </div>
    </EruditLink>
</template>
