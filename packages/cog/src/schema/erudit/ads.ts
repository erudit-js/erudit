type AdsProvider = 'yandex' | 'custom';

interface AdsBannerBase {
    provider: AdsProvider;
}

//
//
//

export interface EruditAdsYandex extends AdsBannerBase {
    provider: 'yandex';
    blockId: string;
}

export interface EruditAdsCustomBottom extends AdsBannerBase {
    provider: 'custom';
    src: string;
}

export interface EruditAdsCustomAside extends AdsBannerBase {
    provider: 'custom';
    src: {
        full: string;
        mobile: string;
    };
}

//
//
//

export type EruditAdsBottom = EruditAdsYandex | EruditAdsCustomBottom;

export type EruditAdsAside = EruditAdsYandex | EruditAdsCustomAside;

export interface EruditAds {
    aside?: EruditAdsAside;
    bottom?: EruditAdsBottom;
}
