import { Entity, PrimaryColumn } from 'typeorm';

@Entity('contribution')
export class DbContribution {
    @PrimaryColumn('varchar')
    contentId!: string;

    @PrimaryColumn('varchar')
    contributorId!: string;
}
