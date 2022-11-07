import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from './user.decorator';
import { User } from '../database/entity/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller("auth")
export class AuthController{

    constructor(private readonly authService: AuthService){}

    @Get("/token/")
    async get_token(
        @Req() req,
        @ReqUser() user: User
    ){
        return {
            user_id: user.id,
            username: user.username,
            roles: user.roles.map(e => e.id)
        }
    }

}