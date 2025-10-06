export interface AccentSectionDataMain {
    type: 'main';
}

export interface AccentSectionDataCustom {
    type: 'custom';
    title: string;
}

export interface AccentSectionSuffix {
    type: 'suffix';
    suffix: string;
}

export type AccentSectionData =
    | AccentSectionDataMain
    | AccentSectionDataCustom
    | AccentSectionSuffix;
