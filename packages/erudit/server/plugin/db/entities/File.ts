import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('file')
export class DbFile {
    @PrimaryColumn('varchar')
    path!: string;

    @Column('varchar', { unique: true })
    fullPath!: string;
}
