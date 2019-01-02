import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany} from 'typeorm';
import { Report } from './report';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    nickname: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(type => Report, report => report.user)
    reports: Report[];

    @Column({ default: 0 })
    areaId: number;

    @Column({ default: 0 })
    campanyId: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
