import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginModule } from '../plugin.module';
import { ConfigModule } from '../config/Config.module';
import { DatabaseConfig } from '../config/schemas/database.schema';
import { PluginService } from '../plugin.service';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { createDatabase } from 'typeorm-extension';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, PluginModule.forRoot()],
            inject: [DatabaseConfig, PluginService],
            useFactory: async (config: DatabaseConfig, plugins: PluginService) => {

                const connection_options: any = {
                    type: "postgres",
                    host: config.host,
                    username: config.user,
                    password: config.password,
                    port: config.port,
                    database: config.database,
                    synchronize: true,
                    //dropSchema: true,
                    entities: [User, Role, ...plugins.getAdditionalEntities()],
                    // logging: ["query"]
                }

                // await createDatabase({
                //     options: connection_options,
                //     ifNotExist: true,
                //     synchronize: true
                // })

                return connection_options
            }
        })
    ]
})
export class DatabaseModule{}