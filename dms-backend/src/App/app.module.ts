import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/Config.module';
import { AppController } from './app.controller';
import { PluginModule } from '../plugin.module';

@Module({
    imports: [ConfigModule, PluginModule.forRoot()],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
