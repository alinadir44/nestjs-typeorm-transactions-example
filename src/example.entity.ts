import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Users{
    @PrimaryGeneratedColumn()
    public id:number;

    @Column({nullable:true,type:'varchar',length:300})
    public prop:string;

    @Column({nullable:true,default:false})
    public isSet:boolean;

    @Column({nullable:true,unique:false})
    public prop2:string;

    @Column({type:'varchar',nullable:true})
    public fileName: string;
}

export default Users;