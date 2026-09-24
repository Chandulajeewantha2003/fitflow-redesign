import { Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  AppController,
} from './app.controller.js';

import {
  AppService,
} from './app.service.js';

import {
  AuthModule,
} from './auth/auth.module.js';

@Module({
  imports: [
    // Load backend/.env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB Atlas connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        uri: configService.getOrThrow<string>(
          'MONGODB_URI',
        ),

        // Your MongoDB database name
        dbName: 'fit-flow',

        // Prefer IPv4
        family: 4,

        // Fail faster while testing
        serverSelectionTimeoutMS: 10000,
      }),
    }),

    // Authentication module
    AuthModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule { }