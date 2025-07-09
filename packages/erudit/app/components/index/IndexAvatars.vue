<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

const props = defineProps<{
    label: string;
    link: string;
    max: number;
    icon: MyIconName;
    namesAvatars: [string, string?][];
}>();

const displayNamesAvatars = ref<[string, string?][]>([]);
const isLoaded = ref(false);

const remainingCount = computed(() => {
    return Math.max(0, props.namesAvatars.length - props.max);
});

onMounted(() => {
    const shuffled = [...props.namesAvatars];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    displayNamesAvatars.value = shuffled.slice(0, props.max);
    isLoaded.value = true;
});
</script>

<template>
    <div :class="$style.indexAvatars">
        <EruditLink :to="link" :class="$style.indexAvatarsLabel">{{
            label
        }}</EruditLink>
        <ul>
            <template v-if="isLoaded">
                <li
                    v-for="nameAvatar of displayNamesAvatars"
                    :class="$style.indexAvatar"
                >
                    <EruditLink :to="link">
                        <Avatar
                            :class="$style.indexAvatar"
                            :title="nameAvatar[0]"
                            :icon
                            :src="nameAvatar[1]"
                            :color="stringColor(nameAvatar[0])"
                        />
                    </EruditLink>
                </li>
                <li v-if="remainingCount > 0" :class="$style.remainingCounter">
                    <EruditLink :to="link" :class="$style.counterCircle">
                        +{{ remainingCount }}
                    </EruditLink>
                </li>
            </template>
            <template v-else>
                <li
                    v-for="i in Math.min(max, namesAvatars.length)"
                    :class="$style.indexAvatar"
                >
                    <div :class="$style.avatarPlaceholder"></div>
                </li>
                <li v-if="remainingCount > 0" :class="$style.remainingCounter">
                    <div :class="$style.counterPlaceholder"></div>
                </li>
            </template>
        </ul>
    </div>
</template>

<style lang="scss" module>
.indexAvatars {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    align-items: center;

    &:hover {
        .indexAvatarsLabel {
            color: var(--text);
        }
    }

    .indexAvatarsLabel {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--textMuted);
        text-decoration: none;

        @include transition(color);
    }

    > ul {
        list-style: none;
        padding: 0;
        margin: 0;

        display: flex;
        gap: var(--gapSmall);

        .indexAvatar {
            --avatarSize: 50px;
        }

        .remainingCounter {
            --avatarSize: 50px;
        }
    }
}

.avatarPlaceholder,
.counterPlaceholder {
    width: var(--avatarSize);
    height: var(--avatarSize);
    border-radius: 50%;
    background: var(--textDimmed);
    animation: avatarPlaceholder 500ms infinite ease-in-out alternate;
}

.counterCircle {
    width: var(--avatarSize);
    height: var(--avatarSize);
    border-radius: 50%;
    border: 3px dashed var(--textDimmed);
    color: var(--textMuted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95em;
    font-weight: 600;
    text-decoration: none;
}

@keyframes avatarPlaceholder {
    from {
        opacity: 0.625;
    }
    to {
        opacity: 0.4;
    }
}
</style>
