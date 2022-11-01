import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Group } from '../database/entity/group.entity';
import { AuthConfig } from '../config/schemas/auth.schema';

@Injectable()
export class AuthService{

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        private readonly jwtService: JwtService,
        private readonly config: AuthConfig
    ) {
        groupRepository.findOne({where: {id: config.root_user}}).then(res => {
            if(!res) return this.groupRepository.save(this.groupRepository.create({id: config.root_user}))
            return this.groupRepository.findOne({where: {id: this.config.root_user}})
        }).then(group => {
            this.userRepository.findOne({where: {username: config.root_user}}).then(res => {
                if(!res) {
                    const u = this.userRepository.create({username: config.root_user})
                    u.groups = [group]
                    return this.userRepository.save(u)
                }
            })
        })
    }

    async validateUser(username: string): Promise<User|undefined>{
        return this.userRepository.findOne({where: {username}, relations: {groups: true}})
    }

    async login(username: string): Promise<string>{
        const user = await this.validateUser(username)
        return this.jwtService.sign(user)
    }
}