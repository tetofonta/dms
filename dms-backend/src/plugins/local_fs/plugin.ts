import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/Config.module';
import { StorageProviderClass } from '../../persistence/storage_provider';
import { LocalFSProvider } from './local_fs.provider';
import "./package.json"

@Module({
    imports: [ConfigModule],
    providers: [LocalFSProvider],
    exports: [LocalFSProvider],
})
export class LocalFSModule {
    public static readonly type: string = 'storage_provider';
    public static readonly provider: StorageProviderClass = LocalFSProvider;
}
