import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Cat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column('tinyint')
    age: number;

    @Column({ length: 100 })
    breed: string;

}
