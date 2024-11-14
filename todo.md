# TODO

## Content

- Allow to attach conteng flags ("dev", "advanced", "dependencies") on headings (display them at right corner of headings).

## Package

- Rewrite package and create all auto-generated files via Nuxt templates.
- Trigger content rebuild only when content is changed or changed `@erudit` folder.
- Provide contributor ids auto completions in content configs

## Universal

- Add Erudit config options to set brand color, site title and site slogan.
- Add ability to use custom favicons for "article", "summary", "practice" and "other" pages.

## Site general

- Create strict distinction between "Bitran Location" which is the place with Bitran content, "Content Location" which is everything related to `content/` folder.
- Unify and refactor SEO mess in different pages.
- Autogenerate content favicons (articles, summaries, practices, groups, books) from brand color gradient and inline them as base 64.
- For some reason first page loading is slow af after content regeneration. Could be related to nitro full reload... Investigate and fix.
- Loading bar with brand color at top of the screen when page is changed.

## Rest

<br>
<h2>В Bitran автоматический ID при production build (не во время dev) вычислять на основе хеша при переводе продукта в строку, а не порядкового номера. Так меньше вариантов, что он поменется даже если статья была изменена... В dev режиме можно просто порядковые номера...</h2>
<br>
<h2>Через Erudit Config можно настроить счетчики продуктов, их названия и цвета (термины, утверждения, задания и т.д)</h2>
<br>
<h2>Изменить описание на бусти. Откровенно рекламные сообщения запрещены. Если уж очень хочется прорекламиться, то нужно завуалировать максимально. Может вообще запретить и предлогать выкупить место в рекламных блоках только...</h2>
<h2>Попробовать transofrm с функцией просто ease и 0.3s</h2>
<pre>
    trackedProducts: {
        term: {
            title: "Термин",
            color: "green",
            products: ["definition", "axiom"],
            ...
        }
    }
</pre>
