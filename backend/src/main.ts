import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Enable cookie parsing
  app.enableCors({
    origin: [process.env.url_front,"http://localhost:4200"], // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
    credentials: true, // Allows cookies and authorization headers
  });
  const config = new DocumentBuilder()

  .setTitle('Safae-BarberShop')
  .setDescription('The BarberShop Api Documentation')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();



