<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
import type { BreadcrumbItem } from '@shared/breadcrumb';
import type { Context } from '@shared/content/context';

defineProps<{ context: Context }>();
</script>

<template>
    <MainBreadcrumb
        v-if="context?.length > 1"
        :items="
            context.reduce((acc, item, i, arr) => {
                if (item.hidden || i === arr.length - 1) {
                    return acc;
                }

                acc.push({
                    title: item.title,
                    icon: item.icon as MyIconName,
                    link: item.href,
                });

                return acc;
            }, [] as BreadcrumbItem[])
        "
    />
</template>
