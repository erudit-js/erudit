<template>
    <div class="px-(--_pMainX) py-(--_pMainY)">
        <h1 class="font-serif dark:text-cyan-500">Hello, Erudit!</h1>
        <img :src="withBaseUrl('/public/project/ava.jpg')" />
        <img
            :src="
                withBaseUrl('/file/contributors/test-contributor-1/avatar.png')
            "
        />
        <div class="h-[3000px]"></div>
    </div>
</template>
