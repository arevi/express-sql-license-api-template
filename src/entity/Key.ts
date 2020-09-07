import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("Keys")
export class Key {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", {
    length: 255,
    unique: true,
  })
  key!: string;

  @Column("varchar", {
    length: 255,
    nullable: true,
  })
  machineId!: string | null;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
