import { testContributor1 } from '#contributors';

import fooTopic from '../2-foo-group/1-foo-topic/article';

export const page = definePage({
    title: 'Test Page',
    contributors: {
        testContributor1,
    },
});

export default defineDocument()(() => (
    <>
        <H1>Test Page</H1>
        <P>This is a test page for Erudit.</P>
        <P>{fooTopic.documentId}</P>
    </>
));

console.log(fooTopic.documentId);
