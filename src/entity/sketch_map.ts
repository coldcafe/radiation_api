import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity()
export class SketchMap extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pic: string;
}
