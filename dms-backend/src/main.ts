import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { HttpConfig } from './config/schemas/http.schema';
import { Logger } from '@nestjs/common';

(async function() {

  const app = await NestFactory.create(AppModule);

  const config: HttpConfig = app.get(HttpConfig)

  Logger.log(`Application starting, listening on port ${config.port} at ${config.base_url_path}`, "main")

  app.setGlobalPrefix(config.base_url_path)
  await app.listen(config.port);
})()
