import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';
import { TrimPipe } from './common/trim.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.useGlobalPipes(new TrimPipe());
  await app.listen(config.port);
}
bootstrap();
