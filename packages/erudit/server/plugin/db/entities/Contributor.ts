import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contributor')
export class DbContributor {
    @PrimaryColumn('varchar')
    contributorId!: string;

    @Column('varchar', { nullable: true })
    displayName?: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column('varchar', { nullable: true })
    avatar?: string;
}
