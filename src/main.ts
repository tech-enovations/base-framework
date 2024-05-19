import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './shared';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
// import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  // Cors Middleware
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply Session Request
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
    // passport.initialize(),
    // passport.session(),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT);
  Logger.log(`APP RUN ON PORT ${process.env.PORT}`);
}
bootstrap();
