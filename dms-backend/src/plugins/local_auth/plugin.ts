import { Module } from '@nestjs/common';
import './package.json'
import './package-lock.json'
import { directoryLoader, dotenvLoader, fileLoader, TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '../../config/schemas/config.schema';
import path from 'path';
import { LocalAuthConfig } from './config/local_auth.config';
import { LocalAuthService } from './local_auth.service';
import { LocalAuthController } from './local_auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entity/user.entity';
import UserLocalAuthData from './entities/user_local_data';
import { Role } from '../../database/entity/role.entity';
import { LocalAuthStrategy } from './local_auth.strategy';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypedConfigModule.forRootAsync({
            schema: LocalAuthConfig,
            load: [
                fileLoader({
                    searchFrom:
                        process.env.DMS_SETTINGS_FILE_PATH ||
                        path.join(process.cwd(), 'settings'),
                    basename: 'localauth',
                }),
                dotenvLoader(),
            ],
        }),
        TypeOrmModule.forFeature([User, UserLocalAuthData, Role]),
        PassportModule,
        AuthModule
    ],
    controllers: [LocalAuthController],
    providers: [LocalAuthService, LocalAuthStrategy],
    exports: [LocalAuthService],
})
export class LocalAuthModule {
    public static readonly type: string = 'std_module';
}
