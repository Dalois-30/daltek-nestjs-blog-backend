import { User } from "src/auth/entities/user.entity";
import { Posts } from "src/features/posts/models/posts.model";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"

// import { Token } from "./token.model";

@Entity()
export class Comments { 
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        unique: true
    })
    public content: string;

    @ManyToOne((type) => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Posts, (post) => post.comments)
    public post: Posts;

    @ManyToOne((type) => Comments, (comment) => comment.children)
    parent: Comments

    @OneToMany((type) => Comments, (comment) => comment.parent)
    children: Comments[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}