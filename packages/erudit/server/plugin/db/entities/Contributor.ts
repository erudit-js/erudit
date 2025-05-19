import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contributor')
export class DbContributor {
    @PrimaryColumn('varchar')
    contributorId!: string;

    @Column('varchar', { nullable: true })
    displayName?: string;

    @Column('varchar', { nullable: true })
    slogan?: string;

    @Column('simple-json', { nullable: true })
    links?: Record<string, string>;

    @Column('text', { nullable: true })
    description?: string;

    @Column('varchar', { nullable: true })
    avatar?: string;

    @Column('boolean', { nullable: true })
    isEditor?: boolean;
}
