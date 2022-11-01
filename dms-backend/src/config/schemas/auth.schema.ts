import { IsString, IsPositive, IsDefined } from 'class-validator';

export class AuthConfig {

    @IsDefined()
    @IsString()
    public secret_key: string

    @IsDefined()
    @IsPositive()
    public expiry: number

    @IsDefined()
    @IsString()
    public issuer = "dms"

    @IsDefined()
    @IsString()
    public jwt_header = "Authentication"

    @IsDefined()
    @IsString()
    public jwt_cookie = "Authentication"

    @IsDefined()
    @IsString()
    public root_user = "root"

}
