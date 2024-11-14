export interface ContextItem {
    type: string;
    icon: string;
    title: string;
    href: string;
    hidden: boolean;
}

export type Context = ContextItem[];
