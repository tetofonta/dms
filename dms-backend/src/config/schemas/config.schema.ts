import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { HttpConfig } from './http.schema';
import { PersistenceConfig } from './persistence.config';

export class RootConfig {
    @IsDefined()
    @Type(() => HttpConfig)
    public readonly http!: HttpConfig;

    @IsDefined()
    @Type(() => PersistenceConfig)
    public readonly persistence!: PersistenceConfig;
}
