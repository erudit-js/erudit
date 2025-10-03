import type { MaybeMyIconName } from '#my-icons';

export interface BreadcrumbItem {
    icon: MaybeMyIconName;
    title: string;
    link: string;
}

export type Breadcrumbs = BreadcrumbItem[];
