import eruditConfig from '#erudit/config';

export default defineNuxtPlugin({
    name: 'erudit-analytics',
    hooks: {
        'app:rendered': (context) => {
            if (!context.ssrContext || !eruditConfig.analytics) {
                return;
            }

            if (eruditConfig.analytics.yandex) {
                const yandex = eruditConfig.analytics.yandex;

                if (yandex.verification) {
                    context.ssrContext.head.push({
                        meta: [
                            {
                                name: 'yandex-verification',
                                content: yandex.verification,
                            },
                        ],
                    });
                }

                if (yandex.metricsId) {
                    context.ssrContext.head.push({
                        script: [
                            {
                                innerHTML: `
                                    (function(m,e,t,r,i,k,a){
                                        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                                        m[i].l=1*new Date();
                                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                                        k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                                    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                                    ym(${yandex.metricsId}, "init", {
                                            clickmap:true,
                                            trackLinks:true,
                                            accurateTrackBounce:true,
                                            webvisor:true
                                    });
                            `,
                            },
                        ],
                    });
                }
            }

            if (eruditConfig.analytics.google) {
                const google = eruditConfig.analytics.google;

                if (google.verification) {
                    context.ssrContext.head.push({
                        meta: [
                            {
                                name: 'google-site-verification',
                                content: google.verification,
                            },
                        ],
                    });
                }

                if (google.gtag) {
                    context.ssrContext.head.push({
                        script: [
                            {
                                src:
                                    'https://www.googletagmanager.com/gtag/js?id=' +
                                    google.gtag,
                                async: true,
                            },
                            {
                                innerHTML: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){window.dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${google.gtag}');
                            `,
                            },
                        ],
                    });
                }
            }
        },
    },
});
