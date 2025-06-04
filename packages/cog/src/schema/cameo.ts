export interface Cameo {
    cameoId: string;
    name: string;
    icon: string;
    messages: string[];
    avatars?: string[];
    color?: string;
    link?: string;
}

export type CameoConfig = Omit<Cameo, 'cameoId' | 'avatars'>;
