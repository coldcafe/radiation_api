import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Merchant } from './merchant';

@Entity()
export class Shop {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: number;

    @ManyToOne(type => Merchant, merchant => merchant.shops)
    merchant: Merchant;
}
