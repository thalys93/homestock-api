import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Home Stock Swagger")
    .setDescription("API para gerenciar estoque de uma residencia, incluindo categorias, produtos, endereços os e despesas")
    .setVersion('v1')
    .addApiKey({ type: 'apiKey', name: 'Authorization', in: 'header' }, 'key')    
    .setBasePath('/api/v1')
    .build()

  const document = SwaggerModule.createDocument(app, config);

  document.paths = Object.keys(document.paths).reduce((acc, path) => {
    acc[`/api/v1${path}`] = document.paths[path];
    return acc;
  }, {});

  SwaggerModule.setup('api/v1', app, document, {
    jsonDocumentUrl: 'api/docs/openapi.json',
    useGlobalPrefix: true,
  });

  app.setGlobalPrefix('api/v1')
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
