import type { MyIconName } from '#my-icons';
import type { ContentFlag } from 'erudit-cog/schema';

interface FlagData {
    icon: MyIconName;
    title: EruditPhraseId;
}

export const flagsData: Record<ContentFlag, FlagData> = {
    //
    // Global Content Flags
    //

    dev: {
        icon: 'construction',
        title: 'flag_dev',
    },

    advanced: {
        icon: 'asterisk',
        title: 'flag_advanced',
    },

    secondary: {
        icon: 'puzzle',
        title: 'flag_secondary',
    },
};
