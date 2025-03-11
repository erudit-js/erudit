import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type {
    ContentFlag,
    ContentReferences,
    ContentSeo,
    ContentType,
} from '@erudit-js/cog/schema';

import type { ImageData } from '@erudit/shared/image';

@Entity('content')
export class DbContent {
    @PrimaryColumn('varchar')
    contentId!: string;

    @Column('varchar')
    @Index({ unique: true })
    fullId!: string;

    @Column('varchar')
    type!: ContentType;

    @Column('varchar', { nullable: true })
    title?: string;

    @Column('varchar', { nullable: true })
    navTitle?: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column('simple-json', { nullable: true })
    flags?: Record<ContentFlag, boolean>;

    @Column('varchar', { nullable: true })
    decoration?: string;

    @Column('simple-json', { nullable: true })
    seo?: Partial<ContentSeo>;

    @Column('simple-json', { nullable: true })
    ogImage?: ImageData;

    @Column('simple-array', { nullable: true })
    dependencies?: string[];

    @Column('simple-json', { nullable: true })
    references?: ContentReferences;
}
