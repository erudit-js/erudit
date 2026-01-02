export interface Cameo {
    cameoId: string;
    name: string;
    icon: string;
    messages: string[];
    avatarExtension?: string;
    color?: string;
    link?: string;
}

export type CameoConfig = Omit<Cameo, 'cameoId' | 'avatarExtension'>;

export function defineCameo(cameo: CameoConfig) {
    return cameo;
}
