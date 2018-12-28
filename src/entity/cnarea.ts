import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity()
export class Cnarea extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parent_id: number;

  @Column()
  level: number;

  @Column({ type: 'bigint' })
  area_code: number;

  @Column()
  zip_code: number;

  @Column()
  city_code: string;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column()
  merger_name: string;

  @Column()
  pinyin: string;

  @Column()
  lng: number;

  @Column()
  lat: number;

  items?: Cnarea[];
}
