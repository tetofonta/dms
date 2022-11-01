import { Column, Entity, JoinTable, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../database/entity/user.entity';

@Entity()
export class UserLocalAuthData{

    @PrimaryGeneratedColumn()
    public id: number

    @OneToOne(() => User)
    @JoinTable()
    public user: User

    @Column()
    public password: string
}

export default UserLocalAuthData