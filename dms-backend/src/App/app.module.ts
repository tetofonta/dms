import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/Config.module';
import { AppController } from './app.controller';
import { PluginModule } from '../plugin.module';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
    imports: [ConfigModule, PluginModule.forRoot(), PersistenceModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
