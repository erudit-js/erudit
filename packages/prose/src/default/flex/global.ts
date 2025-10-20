import { Flex, flexName, type FlexSchema } from '.';
import { defineGlobalElement } from '../../globalElement';

export default defineGlobalElement<FlexSchema>()({
    name: flexName,
    tags: { Flex },
});
