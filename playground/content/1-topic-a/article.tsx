import { Blocks, defineDocument, defineRefs, Paragraph, Text } from 'jsprose';

const refs = defineRefs({
    url: import.meta.url,
    defs: {
        tPifagor: Paragraph,
    },
});

export const article = defineDocument({
    refs,
    content: ({ tPifagor }) => (
        <Blocks>
            <Paragraph $ref={tPifagor}>Это тестовый параграф</Paragraph>

            <Paragraph>
                Еще один параграф с <Text>текстом</Text>!
            </Paragraph>

            {tPifagor}
        </Blocks>
    ),
});
