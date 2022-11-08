import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../database/entity/role.entity';
import { AuthConfig } from '../config/schemas/auth.schema';

@Injectable()
export class AuthService{

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly jwtService: JwtService,
        private readonly config: AuthConfig
    ) {
        roleRepository.findOne({where: {id: "root"}}).then(res => {
            if(!res) return this.roleRepository.save(this.roleRepository.create({id: "root"}))
            return this.roleRepository.findOne({where: {id: this.config.root_user}})
        }).then(role => {
            this.userRepository.findOne({where: {username: config.root_user}}).then(res => {
                if(!res) {
                    const u = this.userRepository.create({username: config.root_user})
                    u.roles = [role]
                    return this.userRepository.save(u)
                }
            })
        })
    }

    async validateUser(username: string): Promise<User|undefined>{
        return this.userRepository.findOne({where: {username}, relations: {roles: true}})
    }

    async login(user: User, res: any): Promise<string>{
        const token = this.jwtService.sign({
            id: user.id,
            username: user.username,
            roles: user.roles.map((e) => e.id)
        })
        res.cookie(this.config.jwt_cookie, token)
        return token
    }
}