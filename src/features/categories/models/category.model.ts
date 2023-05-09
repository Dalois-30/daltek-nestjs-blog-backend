import { Post } from "src/features/posts/models/posts.model";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"

// import { Token } from "./token.model";

@Entity()
export class Category { 
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        unique: true
    })
    public name: string;

    @Column()
    public description: string;

    @Column()
    public image: string;

    @ManyToOne((type) => Category, (category) => category.children)
    parent: Category

    @OneToMany((type) => Category, (category) => category.parent)
    children: Category[]

    @OneToMany(() => Post, (post) => post.category)
    public posts: Post[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}