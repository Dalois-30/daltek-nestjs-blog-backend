import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly roleName: string;
}