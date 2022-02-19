import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';
import { TrimPipe } from './common/trim.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.useGlobalPipes(new TrimPipe());
  
  const swConfig = new DocumentBuilder()
    .setTitle('LL API')
    .setDescription('The LL API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
}
bootstrap();
