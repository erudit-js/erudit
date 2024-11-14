import type { MyIconName } from '#my-icons';

export type PreviewFooter = Partial<{
    iconName: MyIconName;
    iconSvg: string;
    secondary: string;
    primary: string;
    href: string;
}>;
