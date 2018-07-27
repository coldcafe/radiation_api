import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity} from 'typeorm';

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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
