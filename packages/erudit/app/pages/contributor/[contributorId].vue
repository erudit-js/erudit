<script lang="ts" setup>
const route = useRoute();
const contributorId = computed(() => String(route.params.contributorId));
const { data: pageContributor, error } = await useFetch(
    `/api/contributor/page/${contributorId.value}`,
    {
        key: 'page-contributor',
    },
);

console.log(pageContributor.value);

const color = stringColor(contributorId.value);
const phrase = await usePhrases('contributors');
</script>

<template>
    <MainGlow :color />
    <MainBreadcrumbs
        :breadcrumbs="[
            {
                icon: 'users',
                link: PAGES.contributors,
                title: phrase.contributors,
            },
        ]"
    />
    <div
        :style="{
            '--color': color,
            '--colorBorder':
                'color-mix(in srgb, var(--color), var(--color-border) 70%)',
            '--colorBg':
                'color-mix(in srgb, var(--color), var(--color-bg-main) 85%)',
            '--colorText':
                'color-mix(in srgb, var(--color), var(--color-text) 85%)',
            '--colorIcon':
                'color-mix(in srgb, var(--color), var(--color-text) 30%)',
        }"
        class="flex flex-col items-center gap-(--_pMainY) px-(--_pMainX)
            py-(--_pMainY)"
    >
        <div class="rounded-full ring-2 ring-(--colorBorder)">
            <SmartMedia
                :url="
                    pageContributor!.avatarUrl
                        ? withBaseUrl(pageContributor!.avatarUrl)
                        : 'user'
                "
                :style="{ '--mediaColor': color }"
                class="border-bg-main size-[60px] size-[110px] rounded-full
                    border-2 [box-shadow:0_0_16px_0_var(--color)]
                    transition-[border]"
            />
        </div>
        <div>
            <h1>
                <FancyBold
                    :text="pageContributor!.displayName ?? pageContributor!.id"
                    :color="color"
                    class="text-size-h1"
                />
            </h1>
        </div>
    </div>
    <h1>Contributor: {{ contributorId }}</h1>
</template>
