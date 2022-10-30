import { IsInt, IsDataURI, IsIP } from 'class-validator';

export class HttpConfig {
    @IsDataURI()
    public readonly base_url_path: string = '/';

    @IsInt()
    public readonly port: number = 3000;

    @IsIP()
    public readonly bind: string = '127.0.0.1';
}
