import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Shop } from './shop';

@Entity()
export class Merchant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: number;

    @OneToMany(type => Shop, shop => shop.merchant)
    shops: Shop[];

}
