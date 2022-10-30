import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/Config.module';
import { S3FSProvider } from './s3fs.provider';
import { StorageProviderClass } from '../../persistence/storage_provider';

@Module({
    imports: [ConfigModule],
    providers: [S3FSProvider],
    exports: [S3FSProvider],
})
export class S3FSModule {
    public static readonly type: string = 'storage_provider';
    public static readonly provider: StorageProviderClass = S3FSProvider;
}
