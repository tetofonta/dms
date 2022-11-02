import { Injectable } from '@nestjs/common';
import { LocalAuthConfig } from './config/local_auth.config';

@Injectable()
export class LocalAuthService{

    constructor(private readonly config: LocalAuthConfig) {
        console.log(config)
    }

}