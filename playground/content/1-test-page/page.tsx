import { testContributor1 } from '#contributors';

import fooTopic from '../2-foo-group/1-foo-topic/article';

export default definePage({
    title: 'Test Page',
    contributors: ['testContributor1'],
});

export const document = defineDocument()(() => (
    <>
        <H1>Test Page</H1>
        <P>This is a test page for Erudit.</P>
        <P>{fooTopic.documentId}</P>
    </>
));

console.log(fooTopic.documentId);
