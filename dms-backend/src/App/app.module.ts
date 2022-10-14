import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/Config.module';
import { TestPluginModule } from '../plugins/TestPlugin/TestPlugin.module';

@Module({
  imports: [ConfigModule, TestPluginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
