import mobEffect from './mob-effect.png';
import ds2 from './ds2.mp4';
import blonde from './blonde.png';

import myScript from '#project/content/2-foo-group/1-foo-topic/problems/myProblem/problem';
import sumProblem from './problems/sumProblem';

export default defineDocument({
    uniques: {
        tastyHeading: H1,
        myP: P,
        _mathDetails: Details,
    },
})(({ uniques, autoUnique }) => (
    <>
        <H1 $={uniques.tastyHeading}>Foo Lol "Article"</H1>

        <P>
            Это моя <A to={$LINK.testPage.$someMath}>ссылка</A> на формулу
            внутри задачи в page.
        </P>

        <Problem
            title="Моя задача"
            level="medium"
            script={myScript({ superFormula: autoUnique })}
        />

        <Problems title="Сложение" level="hard">
            <SubProblem>
                <ProblemDescription>
                    Сколько будет 2 + 3? Не знаю!
                </ProblemDescription>
                <ProblemAnswer>5</ProblemAnswer>
            </SubProblem>

            <SubProblem script={sumProblem(autoUnique)} />
        </Problems>

        <P $={uniques.myP} toc="My Life!">
            This is a foo
            <Br />
            article!
        </P>
        <P>
            Aenean dictum mauris ligula, vitae{' '}
            <A to="https://google.com">varius nunc</A> rhoncus non. Aenean nec
            ipsum a lacus lobortis mollis. Aliquam erat volutpat. Aliquam sed
            turpis et ex <A to={uniques.myP}>lobortis cursus</A> non sed diam.
            Sed commodo porta hendrerit. Praesent non elementum est. Sed
            facilisis purus nec ex auctor dignissim. Etiam ultrices enim non
            mauris egestas, eget pellentesque orci condimentum. Etiam vehicula
            nulla id risus mollis lacinia. Nunc rhoncus dignissim tempor.
        </P>
        <Hr />
        <Image src={mobEffect} width="600px">
            <Caption>
                Mob Effect Image
                <CaptionSecondary>Some additional info!</CaptionSecondary>
            </Caption>
        </Image>
        <BlockMath freeze>{`
            A^2 + \\brand{B^{\\default{2}}} = C^2 >> (a+b)^1 >> (a+b)^5 >> (a+b)^10
        `}</BlockMath>
        <Term title="My Term Title" row>
            <TermMain>
                This is <B accent>term</B> main
            </TermMain>
            <TermSection title="Мой тайтл!">
                <P>Это ручная секция!</P>
                <BlockMath>{`
                    \\lim\\limits_{x \\to \\infty} \\frac{1}{x} = 0
                `}</BlockMath>
                <Term title="Sub Term">
                    <TermMain>Sub Term Main</TermMain>
                    <TermBar>
                        <P>First</P>
                        <P>
                            Second. Here is a little{' '}
                            <A to={uniques._mathDetails}>explanation</A> to help
                            you understand.
                        </P>
                        <Details
                            $={uniques._mathDetails}
                            title="Объяснение формулы"
                        >
                            <P>This is what I always wanted to say!</P>
                            <BlockMath>
                                {`
                                \\int\\limits_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
                            `}
                            </BlockMath>
                        </Details>
                        <P>Third</P>
                        <BlockMath>{`
                            e^{i\\pi} + 1 = 0
                        `}</BlockMath>
                    </TermBar>
                </Term>
            </TermSection>
            <TermBar>Hello World!</TermBar>
        </Term>
        <Table>
            <Tr>
                <Td> </Td>
                <Td>Cell 2</Td>
            </Tr>
            <Tr>
                <Td>Cell 3</Td>
                <Td>Cell 4</Td>
            </Tr>
            <Caption>My lovely table!</Caption>
        </Table>
        <Callout title="Blonde Blazer speech" icon={blonde}>
            <P>
                It is not this bad!
                <Br />
                Could be much worse...
            </P>
        </Callout>
        <List type="ol" start={3}>
            <Li>
                <B>
                    <I>Hello</I>
                </B>
                , My Honey!
            </Li>
            <Li>
                <P>Paragraph 1</P>
                <P>Paragraph 2</P>
            </Li>
        </List>
        <Video autoplay={true} src={ds2} width="400px" invert="dark">
            <Caption>DeathStranding 2</Caption>
        </Video>
        <P>This is my world!</P>
    </>
));

// export const myScript = defineProblemScript()(() => (
//     <>
//         <ProblemDescription>Здесь мой путь и кончается</ProblemDescription>
//     </>
// ));
