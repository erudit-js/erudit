import type { MyIconName } from '#my-icons';

export interface PopoverData {
    icon: MyIconName | (string & {});
    title: string;
    description: string;
    color: string;
}
