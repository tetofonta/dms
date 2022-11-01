import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class User{

    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column()
    public username: string

    @ManyToMany(type => Group, group => group.id, {cascade: true})
    @JoinTable()
    public groups: Group[]
}