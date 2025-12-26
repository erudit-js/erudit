import shady from '#project/contributors/test-contributor-1/shady.jpg';
import nuxtSchemeDark from './nuxt-scheme-dark.png';

import myScript from '#project/content/2-foo-group/1-foo-topic/problems/myProblem/problem';

export const page = definePage({
    title: 'Test Page',
    description: 'This is a test page for Erudit.',
    contributors: [$CONTRIBUTOR.testContributor1],
});

export default defineDocument({
    uniques: {
        //shadyImage: Image,
        someMath: BlockMath,
    },
})(({ uniques }) => (
    <>
        <H1>Test Page</H1>
        <P>
            This is a <A to={$LINK.fooGroup.fooTopic}>test page</A> for Erudit.
        </P>
        <P>
            Самое <A to={$LINK.fooGroup}>обязательное время</A> сослаться на{' '}
            <A to={$LINK.fooGroup.fooTopic.article.$tastyHeading}>заголовок</A>!
        </P>
        <BlockLink to={$LINK.fooGroup}>I love Foo Group!</BlockLink>
        <BlockLink to={$LINK.fooGroup.fooTopic.article.$tastyHeading}>
            Очень вам рекомендую ознамиться!
        </BlockLink>
        <Gallery>
            <Image src={shady} width="400px">
                <Caption>My lovely Shadowheart</Caption>
            </Image>
            <Image src={nuxtSchemeDark} invert="light" />
        </Gallery>

        <Flex>
            <Image src={shady} width="400px">
                <Caption>My lovely Shadowheart</Caption>
            </Image>
            <Image src={nuxtSchemeDark} invert="light" width="300px" />
        </Flex>

        <P>Almost the end.</P>

        <Diagram>{`
            flowchart TB
                root[[**Подсчет комбинаций**]]
                root -->|Использовать базовые правила| rules[**Базовые правила**]
                root -->|Свести к типовым комбинациям| configurations[**Комбинаторные конфигруации**]

                rules[**Базовые правила**]
                rules -->|Разбить на группы| sumRule[Правило суммы]
                rules -->|Поочередно выбирать элементы| productRule[Правило произведения]

                configurations[**Комбинаторная конфигурация**] --> question{{Порядок элементов важен?}}

                question -->|Да| arrangement[**Размещение**]
                question -->|Нет| combination[**Сочетание**]

                arrangement -->|Без повторений| awr["$$ A_n^k = \\frac{n!}{(n-k)!} $$"]
                arrangement -->|С повторениями| ar["$$ \\bar{A}_n^k = n^k $$"]

                combination -->|Без повторений| cwr["$$ C_n^k = \\frac{n!}{(n-k)! \\ k!} $$"]
                combination -->|С повторениями| cr["$$ \\bar{C}_n^k = C_{n+k-1}^k $$"]

                awr -->|Используются все элементы| permutation[**Перестановка**]

                permutation -->|Без повторений| pwr["$$ P_n = n! $$"]
                permutation -.->|С повторениями$^*$| pr["$$ P_{n_1, \\ \\ldots, \\ n_k} = \\frac{n!}{n_1! \\ \\ldots \\ n_k!} $$"]

                class rules,configurations,arrangement,combination,permutation fill
        `}</Diagram>

        <Problem
            title="Aboba"
            level="hard"
            script={myScript({ superFormula: uniques.someMath })}
            inter
        />

        <Problems title="Много разных задач" pretty level="example">
            <P>Это моя радость!</P>
            <SubProblem label="Первая задача">
                <ProblemDescription>
                    Это текст <A to={uniques.someMath}>первой</A> задачи.
                </ProblemDescription>
            </SubProblem>
            <SubProblem>
                <ProblemDescription>
                    Это текст второй задачи.
                </ProblemDescription>
            </SubProblem>
        </Problems>
    </>
));
