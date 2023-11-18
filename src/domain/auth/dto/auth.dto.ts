import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class RegisterDTO extends LoginDTO {}
