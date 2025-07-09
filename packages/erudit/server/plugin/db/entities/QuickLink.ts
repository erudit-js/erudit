import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('quickLink')
export class DbQuickLink {
    @PrimaryColumn('varchar')
    label!: string;

    @PrimaryColumn('varchar')
    contentId!: string;

    @Column('varchar')
    contentType!: string;

    @Column('varchar')
    elementId!: string;

    @Column('varchar')
    elementName!: string;
}
