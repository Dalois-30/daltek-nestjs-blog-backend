import { Category } from "src/features/categories/models/category.model";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm"

// import { Token } from "./token.model";

@Entity()
export class Post { 
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        unique: true
    })
    public title: string;

    @Column()
    public content: string;

    @Column()
    public images: string;

    @Column()
    public stattus: boolean;

    @Column()
    public tags: string;

    @ManyToOne(() => Category, (category) => category.posts)
    public category: Category;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}