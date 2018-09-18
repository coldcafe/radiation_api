import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { ReportData } from './report_data';
import { User } from './user';
@Entity()
export class Report extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.reports)
  user: User;

  @Column()
  name: string;

  @Column()
  delegateUnit: string;

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
  sketchMap: string;

  @Column()
  docTempId: number;

  @Column()
  pictures: string;

  @Column('text')
  result: string;

  @OneToMany(type => ReportData, reportData => reportData.report, {
    cascade: true,
  })
  data: ReportData[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}
