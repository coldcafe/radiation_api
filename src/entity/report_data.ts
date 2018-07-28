import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne} from 'typeorm';
import { Report } from './report';

@Entity()
export class ReportData extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Report, report => report.data)
    report: Report;

    @Column()
    measurePoint: string;

    @Column()
    K: number;

    @Column({})
    values: string;

}
