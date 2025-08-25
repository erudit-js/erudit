export type EruditRepositoryType = 'custom' | 'github';

export interface EruditRepositoryCustom {
    type: 'custom';
    link: string;
}

export interface EruditRepositoryGitHub {
    type: 'github';
    name: string;
    branch: string;
}

export type EruditRepository = EruditRepositoryCustom | EruditRepositoryGitHub;
