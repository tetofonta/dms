import { Body, Controller, Patch, Post, Res, Response, UseGuards } from '@nestjs/common';
import { LocalAuthService } from './local_auth.service';
import { ReqUser } from '../../auth/user.decorator';
import { User } from '../../database/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';
import express from "express"

@Controller("/auth/local")
export class LocalAuthController{


  constructor(
    private readonly localAuthService: LocalAuthService,
    private readonly authService: AuthService
  ) {
  }

  @Patch("/first_setup")
  async user_first_setup(
    @Body("password") password: string
  ){
    await this.localAuthService.user_first_setup(password)
    return true
  }

  @Post("/login")
  @UseGuards(AuthGuard('localauth'))
  async user_login(
    @ReqUser() user: User,
    @Response() res: express.Response
  ){
    const token = await this.authService.login(user, res)
    res.json({
      user,
      token
    })
  }

  // @Patch("/setup")
  // async user_setup(
  //   @Body("password") password: string
  // ){
  //   await this.localAuthService.user_first_setup(password)
  //   return true
  // }




}