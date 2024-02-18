import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import User from './example.entity';
import { join } from 'path';
import {ServeStaticModule} from '@nestjs/serve-static'

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([User]),ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    serveRoot: '/public/'
}),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
