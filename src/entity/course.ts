import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import { Shop } from './shop';

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Shop)
    @JoinColumn()
    shop: Shop;

    @Column()
    name: string;

    @Column()
    description: string;

}
