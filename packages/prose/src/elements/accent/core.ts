import {
  defineSchema,
  ensureTagChildren,
  isRawElement,
  type ProseElement,
  type Schema,
  type ToProseElement,
  type ToRawElement,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';
import { paragraphWrap } from '../../shared/paragraphWrap.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElement } from '../../coreElement.js';

function validateTitle(tagName: string, title: string) {
  if (!title) {
    throw new EruditProseError(
      `<${tagName}> requires non-empty title attribute!`,
    );
  }
}

export interface AccentDefinition<
  TName extends string,
  TSectionNames extends readonly string[],
> {
  name: TName;
  sectionNames: TSectionNames;
}

export interface AccentMainSchema<
  AccentName extends string = string,
> extends Schema {
  name: `accentMain_${AccentName}`;
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: Schema[];
}

export function isAccentMainElement(
  element: ProseElement,
): element is ToProseElement<AccentMainSchema> {
  return element.schema.name.startsWith('accentMain_');
}

export interface AccentSectionSchema<
  AccentName extends string = string,
> extends Schema {
  name: `accentSection_${AccentName}`;
  type: 'block';
  linkable: false;
  Data: { type: 'named'; name: string } | { type: 'manual'; title: string };
  Storage: undefined;
  Children: Schema[];
}

export function isAccentSectionElement(
  element: ProseElement,
): element is ToProseElement<AccentSectionSchema> {
  return element.schema.name.startsWith('accentSection_');
}

export interface AccentSchema<
  AccentName extends string = string,
> extends Schema {
  name: `accent_${AccentName}`;
  type: 'block';
  linkable: true;
  Data: { title: string; layout: 'column' | 'row' };
  Storage: undefined;
  Children: [
    AccentMainSchema<AccentName>,
    ...AccentSectionSchema<AccentName>[],
  ];
  SectionNames: string[];
}

export function isAccentElement(
  element: any,
): element is ToProseElement<AccentSchema> {
  const name: string | undefined = element?.schema?.name;

  if (!name) {
    return false;
  }

  return name.startsWith('accent_');
}

export function defineAccentCore<
  const TName extends string,
  const TSectionNames extends string[],
>(definition: AccentDefinition<TName, TSectionNames>) {
  // Accent name must start with lowercase
  if (!/^[a-z]/.test(definition.name)) {
    throw new EruditProseError(
      `
Invalid accent name "${definition.name}"!
Accent names should start with lower case letter.
            `.trim(),
    );
  }

  for (const sectionName of definition.sectionNames) {
    if (sectionName === 'section' || sectionName === 'main') {
      throw new EruditProseError(
        `Section names "section" and "main" are reserved for accent "${definition.name}"!`,
      );
    }

    // Section name must start with lowercase
    if (!/^[a-z]/.test(sectionName)) {
      throw new EruditProseError(
        `
Invalid section name "${sectionName}" for accent "${definition.name}"!
Section names should start with lower case letter.
                `.trim(),
      );
    }
  }

  const Name = uppercaseFirst(definition.name) as UppercaseFirst<TName>;

  function applyBlockChildren(
    tagName: string,
    children: any,
    element: { children: any },
  ) {
    ensureTagChildren(tagName, children);
    element.children = paragraphWrap(children) ?? children;
  }

  //
  // Schemas
  //

  const mainSchema = defineSchema<AccentMainSchema<TName>>({
    name: `accentMain_${definition.name}` as `accentMain_${TName}`,
    type: 'block',
    linkable: false,
  });

  const sectionSchema = defineSchema<AccentSectionSchema<TName>>({
    name: `accentSection_${definition.name}` as `accentSection_${TName}`,
    type: 'block',
    linkable: false,
  });

  const baseAccentSchema = defineSchema<AccentSchema<TName>>({
    name: `accent_${definition.name}` as `accent_${TName}`,
    type: 'block',
    linkable: true,
  } as any);

  const accentSchema = baseAccentSchema as Omit<
    typeof baseAccentSchema,
    'SectionNames'
  > & {
    SectionNames: TSectionNames;
  };

  //
  // Tags
  //

  const mainTag = defineEruditTag({
    tagName: `${Name}Main` as `${UppercaseFirst<TName>}Main`,
    schema: mainSchema,
  })(({ tagName, element, children }) => {
    applyBlockChildren(tagName, children, element);
  });

  const sectionTag = defineEruditTag({
    tagName: `${Name}Section` as `${UppercaseFirst<TName>}Section`,
    schema: sectionSchema,
  })<{ title: string }>(({ tagName, element, props, children }) => {
    applyBlockChildren(tagName, children, element);

    const title = props.title.trim();
    validateTitle(tagName, title);

    element.data = { type: 'manual', title };
  });

  function createSuffixSectionTag<const TSuffix extends string>(
    suffix: TSuffix,
  ) {
    return defineEruditTag({
      tagName:
        `${Name}${uppercaseFirst(suffix)}` as `${UppercaseFirst<TName>}${UppercaseFirst<TSuffix>}`,
      schema: sectionSchema,
    })(({ tagName, element, children }) => {
      applyBlockChildren(tagName, children, element);
      element.data = { type: 'named', name: suffix };
    });
  }

  const namedSectionTags = Object.fromEntries(
    definition.sectionNames.map((sectionName) => [
      sectionName,
      createSuffixSectionTag(sectionName),
    ]),
  ) as {
    [K in TSectionNames[number]]: ReturnType<typeof createSuffixSectionTag<K>>;
  };

  const sectionTags = [sectionTag, ...Object.values(namedSectionTags)] as [
    typeof sectionTag,
    ...(typeof namedSectionTags)[TSectionNames[number]][],
  ];

  const accentTag = defineEruditTag({
    tagName: Name,
    schema: accentSchema,
  })<
    { title: string } & (
      | { row?: true; column?: undefined }
      | { row?: undefined; column?: true }
    )
  >(({ tagName, children, element, props }) => {
    ensureTagChildren(tagName, children);

    let hasMainSchema = false;
    let hasSectionSchema = false;
    let hasOtherSchema = false;

    for (const child of children) {
      if (isRawElement(child, mainSchema)) {
        if (hasMainSchema) {
          throw new EruditProseError(
            `<${tagName}> can only have one <${mainTag.tagName}> child element!`,
          );
        }
        hasMainSchema = true;
        continue;
      }

      if (isRawElement(child, sectionSchema)) {
        hasSectionSchema = true;
        continue;
      }

      hasOtherSchema = true;
    }

    if (hasOtherSchema) {
      if (hasMainSchema || hasSectionSchema) {
        throw new EruditProseError(
          `Cannot mix <${mainTag.tagName}> or <${sectionTag.tagName}> with other child elements inside <${tagName}>!`,
        );
      }

      element.children = [mainTag({ children })];
    } else {
      let mainChild: ToRawElement<AccentMainSchema> | undefined;
      let sectionChildren: ToRawElement<AccentSectionSchema>[] = [];

      for (const child of children) {
        if (isRawElement(child, mainSchema)) {
          mainChild = child;
        } else if (isRawElement(child, sectionSchema)) {
          sectionChildren.push(child);
        }
      }

      if (!mainChild) {
        throw new EruditProseError(
          `<${tagName}> requires a <${mainTag.tagName}> child element!`,
        );
      }

      element.children = [mainChild, ...sectionChildren] as any;
    }

    const title = props.title.trim();
    validateTitle(tagName, title);

    element.data = { title, layout: props.row === true ? 'row' : 'column' };
    element.title = title;
  });

  //
  // Core Elements
  //

  const mainCoreElement = defineProseCoreElement({
    schema: mainSchema,
    tags: [mainTag],
  });

  const sectionCoreElement = defineProseCoreElement({
    schema: sectionSchema,
    tags: [
      sectionTag,
      ...(Object.values(namedSectionTags) as any),
    ] as typeof sectionTags,
  });

  const accentCoreElement = defineProseCoreElement({
    schema: accentSchema,
    tags: [accentTag],
  });

  //
  // Return
  //

  return {
    _sectionNames: definition.sectionNames as TSectionNames,
    accent: {
      schema: accentSchema,
      tag: accentTag,
      coreElement: accentCoreElement,
    },
    main: {
      schema: mainSchema,
      tag: mainTag,
      coreElement: mainCoreElement,
    },
    section: {
      schema: sectionSchema,
      tags: sectionTags,
      coreElement: sectionCoreElement,
    },
  };
}
