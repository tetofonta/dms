import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocalAuthConfig } from './config/local_auth.config';
import { User } from '../../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserLocalAuthData from './entities/user_local_data';
import * as zxcvbn from "zxcvbn"
import * as argon2 from "argon2"

@Injectable()
export class LocalAuthService{

    constructor(
        private readonly config: LocalAuthConfig,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserLocalAuthData)
        private readonly localAuthRepository: Repository<UserLocalAuthData>
    ) {}

    private async _set_user_password(user: User, password: string){
        const local_auth_ref = this.localAuthRepository.create({
            user,
            password: await argon2.hash(password)
        })
        await this.localAuthRepository.save(local_auth_ref)
    }

    async user_setup(user: User, password: string){
        const strength = zxcvbn(password)
        if(strength.score < this.config.password_min_score)
            throw new BadRequestException(`Password score too low: required ${this.config.password_min_score}, got ${strength.score}`)
        await this._set_user_password(user, password)
    }

    async user_first_setup(password: string){
        const root_users_with_password = await this.localAuthRepository.find({
            where: {
                user: {
                    roles: { id: "root" }
                }
            }
        })

        if(root_users_with_password.length > 0)
            throw new ForbiddenException("A root user local password has already been set up")

        const root_users = await this.userRepository.find({where: {roles: {id: "root"}}})
        if(root_users.length === 0)
            throw new InternalServerErrorException("No root user available.")
        await Promise.all(root_users.map(e => this.user_setup(e, password)))
    }

    async validateUser(username: string, password: string){
        const user = await this.localAuthRepository.findOne({
            where: {user: {username}},
            relations: {user: { roles: true }}
        })
        if(!user) return undefined
        if (await argon2.verify(user.password, password))
            return user.user
        return undefined
    }

}