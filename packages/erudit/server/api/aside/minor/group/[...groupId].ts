import {
    getAsideMinorContentNode,
    getAsideMinorContentBase,
} from '@server/repository/asideMinor';

import type { AsideMinorGroup } from '@erudit/shared/aside/minor';

export default defineEventHandler(async (event) => {
    const groupNavNode = getAsideMinorContentNode(
        'group',
        event.context.params?.groupId,
    );

    return {
        type: 'group',
        ...(await getAsideMinorContentBase(groupNavNode)),
    } satisfies AsideMinorGroup;
});
