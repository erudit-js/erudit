import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('contentId')
export class DbContentId {
    @PrimaryColumn('varchar')
    fullId!: string;

    @Column('varchar')
    @Index({ unique: true })
    shortId!: string;
}
