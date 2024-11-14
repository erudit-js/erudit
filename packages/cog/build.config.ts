import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    declaration: true,
    entries: [
        'src/schema/index',
        'src/kit/index',

        // Utils
        'src/utils/brand',
    ],
});
