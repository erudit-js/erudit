import { H1 } from '../src/default/heading';
import { createProseDocument } from '../src/document';
import { Paragraph } from '../src/default/paragraph';
import { parseJsxContent } from '../src/parse';

const myDoc = createProseDocument({
    url: 'testDocument',
    uniques: {
        myP: Paragraph,
        myH: H1,
    },
})(({ uniques }) => (
    <blocks>
        <h1 $={uniques.myH}>Привет мир!</h1>
        {uniques.myP}
        <p $={uniques.myP}>My P</p>
        <p>Доблаеб?</p>
        <p>Доблаеб?</p>
        {uniques.myH}
    </blocks>
));

//console.log(JSON.stringify(myDoc.content, null, 2));

// console.log(
//     JSON.stringify(
//         await parseJsxContent({
//             content: myDoc.content,
//             context: { language: 'ru' },
//         }),
//         null,
//         2,
//     ),
// );
