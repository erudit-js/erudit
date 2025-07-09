import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stat')
export class DbStat {
    @PrimaryColumn('varchar')
    contentId!: string;

    @PrimaryColumn('varchar')
    elementName!: string;

    @Column('int')
    count!: number;
}
