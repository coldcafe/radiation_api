import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { ReportData } from './report_data';
import { User } from './user';
@Entity()
export class Report extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.reports)
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  delegateUnit: string;

  @Column({ nullable: true })
  measurePerson: string;

  @Column({ nullable: true })
  machineNO: string;

  @Column({ nullable: true })
  taskNO: string;

  @Column({ nullable: true })
  measuredAt: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  weather: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  contactPersonTel: string;

  @Column({ nullable: true })
  GPS: string;

  @Column({ nullable: true })
  sketchMap: string;

  @Column({ nullable: true })
  docTempId: number;

  @Column({ nullable: true })
  pictures: string;

  @Column({ nullable: true, type: 'text' })
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
