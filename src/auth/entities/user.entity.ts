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
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';
import { Role } from 'src/features/role/entities/role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => Comments, (comment) => comment.user)
  comments: Comments[]

  @OneToMany((type) => Posts, (post) => post.user)
  posts: Posts[]

  @Column()
  verified: boolean = false;

  @ManyToMany(() => Role, role => role.userRoles, { cascade: true })
  @JoinTable()
  userRoles: Role[];

  // @Column()
  // role: UserRoles;

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
