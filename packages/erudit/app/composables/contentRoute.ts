import type { ContentType, TopicPart } from '@erudit-js/cog/schema';

interface ContentRouteBase {
    type: ContentType;
    contentId: string;
}

interface TopicRoute extends ContentRouteBase {
    type: 'topic';
    topicPart: TopicPart;
}

interface ContentRoute extends ContentRouteBase {
    type: Exclude<ContentType, 'topic'>;
}

export function useContentRoute(): ComputedRef<
    TopicRoute | ContentRoute | undefined
> {
    const route = useRoute();
    return computed(() => {
        const match = route.path.match(/\/(.+?)\/(.+)/);

        if (!match || !match[1] || !match[2]) return undefined;

        switch (match[1]) {
            case 'article':
            case 'summary':
            case 'practice':
                return <TopicRoute>{
                    type: 'topic',
                    contentId: match[2],
                    topicPart: match[1],
                };
            case 'group':
            case 'book':
                return <ContentRoute>{
                    type: match[1],
                    contentId: match[2],
                };
        }

        return undefined;
    });
}
