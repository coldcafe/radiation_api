import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user';
@Entity()
export class WechatUser {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.wechatUsers)
    user: User;

    @Column()
    openid: string;

    @Column()
    unionid: number;

    @Column()
    sessionKey: string;

}
