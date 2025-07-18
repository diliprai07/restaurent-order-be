import slugify from "slugify";
import { AfterUpdate, BeforeInsert, Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoryV2 {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    slug: string;

    @DeleteDateColumn()
    deletedDate: Date;

    @ManyToOne(() => CategoryV2, (c) => c.children)
    parent: CategoryV2;

    @OneToMany(() => CategoryV2, (c) => c.parent) // We need to change this to product as children
    children: CategoryV2[];

    @BeforeInsert()
    @AfterUpdate()
    generateSlug() {
        const date = new Date();
        
        this.slug = `${slugify(this.name)}-${date.getTime()}`;
    }
}