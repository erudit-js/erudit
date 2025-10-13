import { defineGlobalElement } from '../../globalElement';
import { Details, detailsName, type DetailsSchema } from '.';

export default defineGlobalElement<DetailsSchema>()({
    name: detailsName,
    tags: { Details },
});
