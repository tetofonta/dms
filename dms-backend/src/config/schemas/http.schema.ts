import { IsString, IsInt, IsDataURI } from 'class-validator';

export class HttpConfig {

  @IsDataURI()
  public readonly base_url_path: string = "/";

  @IsInt()
  public readonly port: number = 3000

}