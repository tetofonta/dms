import { IsString } from 'class-validator';

export default class S3FSConfig {

    @IsString()
    public readonly endpoint!: string

    @IsString()
    public readonly access_key!: string

    @IsString()
    public readonly secret_key!: string

    @IsString()
    public readonly bucket: string = "dms"

    @IsString()
    public readonly region: string = "us-east-1"

}