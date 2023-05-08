import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../constant/user-roles';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  verified: boolean = false;

  @Column()
  role: UserRoles;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      const rounds = bcrypt.getRounds(this.password);
      if (rounds === 0) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    } catch (error) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

}
