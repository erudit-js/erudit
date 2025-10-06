import { defineGlobalElement } from '../../globalElement';
import { H1, H2, H3, headingName, type HeadingSchema } from '.';

export default defineGlobalElement<HeadingSchema>()({
    name: headingName,
    tags: { H1, H2, H3 },
});
