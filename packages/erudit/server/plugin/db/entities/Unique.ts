import { Column, Entity, PrimaryColumn } from 'typeorm';

import type { BitranContext } from '@erudit/shared/bitran/context';

@Entity('unique')
export class DbUnique {
    @PrimaryColumn('varchar')
    location!: string;

    @Column('varchar')
    productName!: string;

    @Column('text')
    content!: string;

    @Column('simple-json')
    context!: BitranContext;

    @Column('varchar', { nullable: true })
    title?: string;
}
