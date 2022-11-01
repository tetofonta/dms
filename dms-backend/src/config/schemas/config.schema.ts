import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { HttpConfig } from './http.schema';
import { PersistenceConfig } from './persistence.config';
import { DatabaseConfig } from './database.schema';
import { AuthConfig } from './auth.schema';

export class RootConfig {
    @IsDefined()
    @Type(() => HttpConfig)
    public readonly http!: HttpConfig;

    @IsDefined()
    @Type(() => PersistenceConfig)
    public readonly persistence!: PersistenceConfig;

    @IsDefined()
    @Type(() => DatabaseConfig)
    public readonly database!: DatabaseConfig;

    @IsDefined()
    @Type(() => AuthConfig)
    public readonly auth!: AuthConfig;
}
