import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { WechatUser } from './wechatUser';
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column()
    age: number;

    @Column()
    mobile: string;

    @Column()
    sex: string;

    @Column()
    type: number;

    @Column()
    remark: number;

    @OneToMany(type => WechatUser, wechatUser => wechatUser.user)
    wechatUsers: WechatUser[];
}
