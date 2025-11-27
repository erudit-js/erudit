type AdsProvider = 'replacer' | 'yandex' | 'custom';

interface AdsBase {
    provider: AdsProvider;
}

export interface CustomAdsItem {
    src: string;
    link: string;
}

//
//
//

export interface EruditAdsReplacer extends AdsBase {
    provider: 'replacer';
}

export interface EruditAdsYandex extends AdsBase {
    provider: 'yandex';
    blockId: string;
}

export interface EruditAdsCustom extends AdsBase {
    provider: 'custom';
    banners: CustomAdsItem[];
}

export type EruditAds = EruditAdsReplacer | EruditAdsYandex | EruditAdsCustom;

//
//
//

export type EruditAdsAsideBanner =
    | EruditAdsReplacer
    | EruditAdsYandex
    | {
          provider: 'custom';
          banners: {
              full?: CustomAdsItem[];
              mobile?: CustomAdsItem[];
          };
      };

export type EruditAdsBottomBanner =
    | EruditAdsReplacer
    | EruditAdsYandex
    | EruditAdsCustom;

export interface EruditAdsBanners {
    aside?: EruditAdsAsideBanner;
    bottom?: EruditAdsBottomBanner;
}
