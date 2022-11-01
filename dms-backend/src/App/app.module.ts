import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/Config.module';
import { AppController } from './app.controller';
import { PluginModule } from '../plugin.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        ConfigModule,
        PluginModule.forRoot(),
        PersistenceModule,
        DatabaseModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
