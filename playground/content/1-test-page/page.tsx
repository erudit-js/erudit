import { testContributor1 } from '#contributors';
import shady from '#project/contributors/test-contributor-1/shady.jpg';

import fooTopic from '../2-foo-group/1-foo-topic/article';

export const page = definePage({
    title: 'Test Page',
    contributors: {
        testContributor1,
    },
});

export default defineDocument({
    uniques: {
        shadyImage: Image,
    },
})(({ uniques }) => (
    <>
        <H1>Test Page</H1>
        <P>This is a test page for Erudit.</P>
        <Image $={uniques.shadyImage} src={shady}>
            <Caption>My lovely Shadowheart</Caption>
        </Image>
        <P>{fooTopic.documentId}</P>
    </>
));
