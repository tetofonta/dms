import { Module } from '@nestjs/common';
import { directoryLoader, dotenvLoader, fileLoader, TypedConfigModule } from 'nest-typed-config';
import path from 'path';
import { LocalAuthConfig } from './config/local_auth.config';

import './package.json'
import './package-lock.json'

@Module({
    imports: [

    ],
    providers: [],
    exports: [],
})
export class LocalAuthModule {
    public static readonly type: string = 'std_module';
}
