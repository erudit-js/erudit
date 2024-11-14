import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * TODO:
 * Create hash of Bitran content of content items and use it to distinguish between content item version.
 */

@Entity('hash')
export class DbHash {
    @PrimaryColumn('varchar')
    id!: string;

    @Column('varchar')
    hash!: string;
}
