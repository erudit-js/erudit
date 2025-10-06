import { defineAccentGlobal } from 'src/elements/accent/globalDefinition';
import { defineAccentSchema } from 'src/elements/accent/schema';
import { expect, test } from 'vitest';

const statementSchema = defineAccentSchema('Statement')('Proof');
const statementElement = defineAccentGlobal(statementSchema);

const Statement = statementElement[0].tags.Statement;
const StatementMain = statementElement[1].tags.StatementMain;
const StatementProof = statementElement[1].tags.StatementProof;
const StatementSection = statementElement[1].tags.StatementSection;

const doc = (
    <blocks>
        <Statement>
            <StatementSection title="Details">
                <p>Here are some additional details.</p>
            </StatementSection>
        </Statement>
    </blocks>
);

console.log(doc);

test(() => {
    expect('1').toBe('1');
});
