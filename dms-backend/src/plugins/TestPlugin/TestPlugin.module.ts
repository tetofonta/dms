import { Module } from '@nestjs/common';
import { directoryLoader, dotenvLoader, fileLoader, TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '../../config/schemas/config.schema';
import * as path from 'path';
import { TestConfigRoot } from './config/TestPlugin.schema';

@Module({
  imports: [
    TypedConfigModule.forRootAsync({
      schema: TestConfigRoot,
      load: [
        fileLoader({
          searchFrom: process.env.DMS_SETTINGS_FILE_PATH || path.join(process.cwd(), 'settings'),
          basename: process.env.DMS_SETTINGS_FILE_BASENAME || 'main',
        }),
        directoryLoader({
          directory: process.env.DMS_SETTINGS_DIR || process.env.DMS_SETTINGS_FILE_PATH || path.join(process.cwd(), 'settings.d'),
        }),
        dotenvLoader(),
      ],
    }),
  ]
})
export class TestPluginModule{}