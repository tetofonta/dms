import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User{

    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column({unique: true})
    public username: string

    @ManyToMany(type => Role, role => role.id, {cascade: true})
    @JoinTable()
    public roles: Role[]
}