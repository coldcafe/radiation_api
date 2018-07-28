import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, JoinColumn, OneToMany} from 'typeorm';
import { ReportData } from './report_data';
@Entity()
export class Report extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    measurePerson: string;

    @Column()
    machineNO: string;

    @Column()
    taskNO: string;

    @Column()
    measuredAt: number;

    @Column()
    type: string;

    @Column()
    weather: string;

    @Column()
    address: string;

    @Column()
    unit: string;

    @Column()
    contactPerson: string;

    @Column()
    contactPersonTel: string;

    @Column()
    GPS: string;

    @Column()
    pictures: string;

    @JoinColumn()
    @OneToMany(type => ReportData, reportData => reportData.report)
    data: ReportData[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
