//
// Block
//

export type AccentBlockDirection = 'row' | 'column';

export interface AccentBlockData {
    title: string;
    direction: AccentBlockDirection;
}

//
// Section
//

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
