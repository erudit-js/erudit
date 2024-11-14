import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { GroupType } from 'erudit-cog/schema';

@Entity('group')
export class DbGroup {
    @PrimaryColumn('varchar')
    contentId!: string;

    @Column('varchar')
    type!: GroupType;

    @Column('text', { nullable: true })
    content?: string;
}
