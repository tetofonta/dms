import { IsString, IsPort } from 'class-validator';

export class DatabaseConfig {

    @IsString()
    public readonly host!: string

    @IsPort()
    public readonly port!: number

    //todo other methods
    @IsString()
    public readonly user!: string
    @IsString()
    public readonly password!: string
    @IsString()
    public readonly database!: string
}
