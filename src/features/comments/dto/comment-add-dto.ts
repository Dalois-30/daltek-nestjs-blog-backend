import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";


export class CommentsAddDto { 
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public content: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    user: string
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public post: string;
    @ApiProperty()
    parent?: string;
}