import { IsDefined, IsPositive } from 'class-validator';

export default class LocalAuthConfig{

    @IsDefined()
    @IsPositive()
    public readonly password_min_score: number = 2

}