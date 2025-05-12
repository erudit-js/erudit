type AdsProvider = 'yandex' | 'custom';

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

export interface EruditAdsYandex extends AdsBase {
    provider: 'yandex';
    blockId: string;
}

export interface EruditAdsCustom extends AdsBase {
    provider: 'custom';
    banners: CustomAdsItem[];
}

export type EruditAds = EruditAdsYandex | EruditAdsCustom;

//
//
//

export type EruditAdsAsideBanner =
    | EruditAdsYandex
    | {
          provider: 'custom';
          banners: {
              full?: CustomAdsItem[];
              mobile?: CustomAdsItem[];
          };
      };

export type EruditAdsBottomBanner = EruditAdsYandex | EruditAdsCustom;

export interface EruditAdsBanners {
    aside?: EruditAdsAsideBanner;
    bottom?: EruditAdsBottomBanner;
}
