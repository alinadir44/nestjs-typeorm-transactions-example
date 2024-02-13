import { Controller, Get,Post,Body, Param, Put, Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers(){
    return await this.appService.getUsers();
  }

  @Get('user/:id')
  async getUser(@Param('id' ) id ){
    return await this.appService.findUser(Number(id));
  }
  
  @Post()
  async create(){
    return await this.appService.createUser();
  }

  @Post('user/transaction/:prop2/')
  async createWIthPropWithTransaction(@Param('prop2') prop2){
    return await this.appService.createUserWithProp2WithTransaction(String(prop2));
  }

  @Post('user/no-transaction/:prop2/')
  async createWIthPropWithoutTransaction(@Param('prop2') prop2){
    return await this.appService.createUserWithProp2WithoutTransaction(String(prop2));
  }

  @Post('user/transaction-lock/:prop2/')
  async createUserWithLockInTransaction(@Param('prop2') prop2){
    return await this.appService.createUserWithLockInTransaction(String(prop2));
  }

  @Patch('user/:id')
  async update(@Body() body,@Param('id' ) id ){
    console.log('inside route');
    return await this.appService.updateProp(Number(id),body.prop);
  }
}
