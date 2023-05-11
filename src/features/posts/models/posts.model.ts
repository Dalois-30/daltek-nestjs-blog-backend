import { User } from "src/auth/entities/user.entity";
import { Category } from "src/features/categories/models/category.model";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"

// import { Token } from "./token.model";

@Entity()
export class Posts { 
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        unique: true
    })
    public title: string;

    @Column()
    public content: string;

    @Column()
    public image: string;

    @Column()
    public status: boolean;

    @Column()
    public tags?: string;

    @ManyToOne(() => Category, (category) => category.posts)
    public category: Category;

    @ManyToOne(() => User, (category) => category.posts)
    public user: User;

    @OneToMany(() => Posts, (post) => post.category)
    public comments: Comment[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}