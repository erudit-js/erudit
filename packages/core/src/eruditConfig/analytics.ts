export type YandexAnalytics = {
  metricsId?: string;
  verification?: string;
};

export type GoogleAnalytics = {
  gtag?: string;
  verification?: string;
};

export interface EruditAnalytics {
  google?: GoogleAnalytics;
  yandex?: YandexAnalytics;
}
