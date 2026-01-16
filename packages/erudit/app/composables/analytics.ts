import type {
    GoogleAnalytics,
    YandexAnalytics,
} from '@erudit-js/core/eruditConfig/analytics';

export function initAnalytics() {
    const analytics = ERUDIT.config.project.analytics;

    const analyticsEnabled = (() => {
        const debugValue = ERUDIT.config.project.debug.analytics;

        if (typeof debugValue === 'boolean') {
            return debugValue;
        }

        return ERUDIT.config.mode === 'generate' ? true : false;
    })();

    if (!analytics || !analyticsEnabled) {
        return;
    }

    if (analytics.google) {
        googleAnalytics(analytics.google);
    }

    if (analytics.yandex) {
        yandexAnalytics(analytics.yandex);
    }
}

function googleAnalytics(analytics: GoogleAnalytics) {
    if (analytics.gtag) {
        useHead({
            script: [
                {
                    key: 'google-analytics-script',
                    src: `https://www.googletagmanager.com/gtag/js?id=${analytics.gtag}`,
                    async: true,
                },
                {
                    key: 'google-analytics-inline-script',
                    innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analytics.gtag}');
                    `.trim(),
                },
            ],
        });
    }

    if (analytics.verification) {
        useHead({
            meta: [
                {
                    name: 'google-site-verification',
                    content: analytics.verification,
                },
            ],
        });
    }
}

function yandexAnalytics(analytics: YandexAnalytics) {
    if (analytics.metricsId) {
        useHead({
            script: [
                {
                    key: 'yandex-metrica-script',
                    innerHTML: `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],
    k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${analytics.metricsId}, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
});
                    `.trim(),
                },
            ],
        });
    }

    if (analytics.verification) {
        useHead({
            meta: [
                {
                    name: 'yandex-verification',
                    content: analytics.verification,
                },
            ],
        });
    }
}
