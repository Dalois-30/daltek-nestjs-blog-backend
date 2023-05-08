import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}

export class ResetPassWordDto {
  @ApiProperty()
  @IsString()
  readonly actualPassword: string;
  @ApiProperty()
  @IsString()
  readonly newPassword: string;
}

// export class CreateMarchandDto {
 
  
//   // @ApiProperty()
//   // @IsString()
//   // @IsNotEmpty()
//   // readonly name: string;

//   // @ApiProperty()
//   // @IsString()
//   // @IsNotEmpty()
//   // readonly address: string;  
  
//   // @ApiProperty()
//   // @IsString()
//   // @IsNotEmpty()
//   // readonly tel: string;  
  
//   @ApiProperty()
//   @IsNotEmpty()
//   @IsEmail()
//   readonly email: string;

//   @ApiProperty()
//   @IsString()
//   readonly password: string;
// }
