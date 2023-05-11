import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class GetFileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    key: string;
}

