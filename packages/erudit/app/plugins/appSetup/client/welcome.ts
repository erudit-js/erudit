import { brandColors, brandLogotype } from '@erudit-js/core/brand';

const emojies = [
    '😂',
    '❤️',
    '🤣',
    '🎉',
    '🔥',
    '💖',
    '👀',
    '✨',
    '💗',
    '💚',
    '💙',
    '🎁',
    '🌈',
];

const emoji = emojies[Math.floor(Math.random() * emojies.length)];

export async function setupWelcomeMessage() {
    const runtimeConfig = useRuntimeConfig();

    console.log(
        '%c' +
            brandLogotype +
            '\n%cv' +
            runtimeConfig.public.eruditVersion +
            ' ' +
            emoji +
            ' %cBeating heart of modern educational sites!\n\n%cLearn more: https://github.com/erudit-js/erudit\n ',
        `color: transparent; background: linear-gradient(to right, ${brandColors[0]}, ${brandColors[1]}); background-clip: text; -webkit-background-clip: text;`,
        'color: inherit;',
        'font-style: italic; color: #888;',
        'color: inherit;',
    );
}
