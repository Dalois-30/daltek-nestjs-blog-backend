import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('APP_PORT');

  const options = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription(
      'Full api management system of the daltek enterprise',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000, () =>
    console.log(`Application bootstrap on port ${PORT} 💆😇️ `),
  );
}
bootstrap();
