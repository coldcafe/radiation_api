import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

process.on('exit', () => {
  console.log('exit');
});

process.on('SIGHUP', () => {
  console.log('SIGHUP');
  setTimeout(() => {
    process.exit();
  }, 8000);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  setTimeout(() => {
    process.exit();
  }, 8000);
});

process.on('SIGINT', () => {
  console.log('SIGINT');
  setTimeout(() => {
    process.exit();
  }, 8000);
});
