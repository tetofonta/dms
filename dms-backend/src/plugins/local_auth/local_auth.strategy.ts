import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalAuthService } from './local_auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, "localauth"){

  constructor(
    private readonly localAuthService: LocalAuthService
  ) {
    super({
      usernameField: 'user',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string){
    const user = await this.localAuthService.validateUser(username, password);
    if (!user)
      throw new UnauthorizedException();
    return user;
  }


}