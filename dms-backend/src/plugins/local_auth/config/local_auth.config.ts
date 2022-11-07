import { IsDefined, IsPositive, IsBoolean, IsString } from 'class-validator';

export class LocalAuthConfig{

    @IsDefined()
    @IsPositive()
    public readonly password_min_score: number = 2

}