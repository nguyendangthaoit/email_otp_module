import {
    IsEmail, IsDefined,
} from 'class-validator';

export class AccountCreateVal {

    @IsEmail()
    email: string;

}







