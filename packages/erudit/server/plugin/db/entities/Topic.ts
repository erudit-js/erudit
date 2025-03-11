import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { TopicPart } from '@erudit-js/cog/schema';

@Entity('topic')
export class DbTopic {
    @PrimaryColumn('varchar')
    contentId!: string;

    @Column('simple-array')
    parts!: TopicPart[];

    @Column('text', { nullable: true })
    article?: string;

    @Column('text', { nullable: true })
    summary?: string;

    @Column('text', { nullable: true })
    practice?: string;
}
