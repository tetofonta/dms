import { Module } from '@nestjs/common';
import './package.json'
import './package-lock.json'
import { directoryLoader, dotenvLoader, fileLoader, TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '../../config/schemas/config.schema';
import path from 'path';
import { LocalAuthConfig } from './config/local_auth.config';
import { LocalAuthService } from './local_auth.service';
import { LocalAuthController } from './local_auth.controller';

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
    ],
    controllers: [LocalAuthController],
    providers: [LocalAuthService],
    exports: [LocalAuthService],
})
export class LocalAuthModule {
    public static readonly type: string = 'std_module';
}
