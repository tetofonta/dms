import { IsString } from 'class-validator';

export class PersistenceConfig {
    @IsString()
    public readonly persistence_provider: string = 'local_fs';

    public readonly provider_config: any;
}
