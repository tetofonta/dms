import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../database/entity/user.entity';
import { Request } from 'express';
import { AuthConfig } from '../config/schemas/auth.schema';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly authService: AuthService,
        private readonly config: AuthConfig
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                if(req.cookies[this.config.jwt_cookie])
                    return req.cookies[this.config.jwt_header]
                return req.headers[this.config.jwt_header] || null
            },
            secretOrKey: config.secret_key,
            issuer: config.issuer
        });
    }

    async validate(payload: User): Promise<User> {
        const user = await this.authService.validateUser(payload.username);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}