import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { Group, User } from "./users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "app",
      "password": "secret",
      "database": "users_app",
      "entities": ["dist/**/*.entity{.ts,.js}"],
      // "entities": [],
      "synchronize": true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Group]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
