import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Group{

    @PrimaryColumn()
    public id: string

    @ManyToMany(type => User, user => user.id, {cascade: true})
    public users: User[]

}