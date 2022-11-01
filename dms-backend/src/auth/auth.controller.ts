import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decoraor.ta';

@UseGuards(AuthGuard('jwt'))
@Controller("auth")
export class AuthController{

    constructor(private readonly authService: AuthService){

    }

    @Get("/token/")
    async get_token(
        @User() user
    ){
        return user
    }

}