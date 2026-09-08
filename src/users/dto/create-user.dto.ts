import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(120)
    name!: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @MaxLength(500)
    email!: string;
}
