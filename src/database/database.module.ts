import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import User from 'src/example.entity';

@Module({
    imports:[TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database:'transactions',
        username:'test',
        password: '123',
        entities:[User],
        synchronize:true,
        autoLoadEntities:true
    })]
})
export class DatabaseModule {}
