import {IsEmpty, IsNotEmpty} from 'class-validator'

class createExampleDto{
    @IsNotEmpty()
    public prop:string;
    @IsNotEmpty()
    public prop2:string;

    public fileName:string
}

export default createExampleDto;