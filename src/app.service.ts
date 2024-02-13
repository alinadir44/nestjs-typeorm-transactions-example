import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import Users from './example.entity';
import User from './example.entity';

@Injectable()
export class AppService {

  constructor(
    private readonly dataSource:DataSource,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(){
    let users:User[];
    try {
      await this.userRepo.manager.transaction(async (manager)=>{
        //users=await manager.find(User);
        users=await manager.query('select * from users u where u.id=$1;',[90])
      })
      return users; 
    } catch (error) {
      // const conn=this.userRepo.manager.connection
      // const qry=conn.createQueryRunner();
      // // await qry.connect()
      // // await qry.startTransaction()
      return new HttpException(error,HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(id:number){
    const res=await this.userRepo.findOne({where:{id:id}});
    console.log(res);
    if(res){
      return res;//{...res,'type':typeof res};
    }
    // console.log('cant find it')
    //   throw new HttpException(`no record found!`,HttpStatus.NOT_FOUND)
  }

  async createUser(){
    const user=this.userRepo.create()
    await this.userRepo.manager.transaction(async (manager)=>{
      await manager.save(user)
    })
    return user;
    //await this.userRepo.save(user);
  }

  async updateProp(id:number,prop:string){
    // const conn=this.userRepo.manager.connection;
    // get a connection and create a new query runner 
    const qry = this.dataSource.createQueryRunner();

    try{
      await qry.connect()
      await qry.startTransaction();

      const user=await qry.manager.findOne(Users,{where:{id:id}});
        if (!user) throw new HttpException(`user does not exist`,HttpStatus.NOT_FOUND);
        if(user.isSet){
          throw new HttpException(`isSet already true! Can't perform again`,HttpStatus.NOT_FOUND);
        }
        await qry.manager.update(Users,{id:id},{isSet:true,prop:prop});
        await qry.commitTransaction();
        console.log('committed');
        return await qry.manager.findOne(Users,{where:{id:id}});


      //await qry.manager.update()
      // async (transactionalEntityManager: EntityManager) => {
      //   const user=await transactionalEntityManager.findOne(Users,{where:{id:id}});
      //   if (!user) throw new HttpException(`user does not exist`,HttpStatus.NOT_FOUND);
      //   if(user.isSet){
      //     throw new HttpException(`isSet already true! Can't perform again`,HttpStatus.NOT_FOUND);
      //   }
      //   await transactionalEntityManager.update(Users,{id:id},{isSet:true,prop:prop});
      //   await qry.commitTransaction();
      //   console.log('committed');
      //   return await transactionalEntityManager.findOne(Users,{where:{id:id}});
      // };
    } catch (err) {
      console.log(`error occurred: ${err}`)
      await qry.rollbackTransaction();
      console.log('transaction rolled back');
      throw err;
    } finally {
      console.log('transaction released');
      await qry.release()
    }
  }
  async createUserWithProp2WithTransaction(prop2:any){
    const qry = this.dataSource.createQueryRunner();
    try{
      await qry.connect();
      await qry.startTransaction();
      console.log('transaction started');

      const user=qry.manager.create(Users,{prop2:prop2});
      await qry.manager.save(user);
      await qry.commitTransaction();
      console.log('transaction committed');
      return user;

    } catch (err){
      await qry.rollbackTransaction();
      console.log('transaction rolled back');
      console.log(`Error: ${err}`)
      return err;
    } finally {
      await qry.release();
      console.log('transaction released');
    }
  }

  async createUserWithProp2WithoutTransaction(prop2:any){
    const obj = this.userRepo.create({prop2:prop2});
    await this.userRepo.save(obj);
    return obj;
  }

  async createUserWithLockInTransaction(prop2:any){
    const qry = this.dataSource.createQueryRunner();
    try{
      await qry.connect();
      await qry.startTransaction();
      console.log('transaction started');

      // const user=qry.manager.create(Users,{prop2:prop2});
      // await qry.manager.save(user);
      // get last index from db
      const user = await qry.manager.createQueryBuilder().setLock("pessimistic_write")
      .insert()
      .into(Users)
      .values({prop:"hehe",isSet:true,prop2:prop2})
      .execute()
      await qry.commitTransaction();
      console.log('transaction committed');
      return user;

    } catch (err){
      await qry.rollbackTransaction();
      console.log('transaction rolled back');
      console.log(`Error: ${err}`)
      return err;
    } finally {
      await qry.release();
      console.log('transaction released');
    }
  }
}
