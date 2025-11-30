import { testContributor1 } from '#contributors';
import shady from '#project/contributors/test-contributor-1/shady.jpg';

import fooTopic from '../2-foo-group/1-foo-topic/article';
import fooGroup from '../2-foo-group/group';

export const myScript = defineProblemScript({
    initialSeed: 'aboba',
    isGenerator: true,
})(() => (
    <>
        <ProblemDescription>Hello World!</ProblemDescription>
    </>
));

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
        <P>
            This is a test page for <A to="formalism.com">Erudit</A>.{' '}
            <A to="formalism.com">Erudit</A>.
        </P>
        <Image
            $={uniques.shadyImage}
            src={shady}
            snippet={{ quick: true, title: 'Shady Image' }}
        >
            <Caption>My lovely Shadowheart</Caption>
        </Image>
        <P>{fooTopic.documentId}</P>
        <Problem title="Aboba" level="hard" script={myScript} />
        <BlockLink to={fooGroup}>I love Foo Group!</BlockLink>
    </>
));
