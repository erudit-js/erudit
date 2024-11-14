import { Entity, PrimaryColumn } from 'typeorm';

@Entity('book')
export class DbBook {
    @PrimaryColumn('varchar')
    contentId!: string;
}
