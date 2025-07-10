import type { MyIconName } from '#my-icons';

export type StatType = 'custom' | 'element';

interface StatBase {
    type: StatType;
    count: number;
}

export interface CustomStat extends StatBase {
    type: 'custom';
    icon: MyIconName | (string & {});
    label: string;
}

export interface ElementStat extends StatBase {
    type: 'element';
    elementName: string;
}

export type Stat = ElementStat | CustomStat;
export type ElementStats = ElementStat[];
export type Stats = Stat[];
