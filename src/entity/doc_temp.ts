import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity()
export class DocTemp extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  tel: string;

  @Column()
  facsimile: string;

  @Column()
  email: string;
}
