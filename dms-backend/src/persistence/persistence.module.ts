import { Module } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { ConfigModule } from '../config/Config.module';
import { PluginModule } from '../plugin.module';

@Module({
    imports: [ConfigModule, PluginModule.forRoot()],
    providers: [PersistenceService],
    exports: [PersistenceService],
})
export class PersistenceModule {}
