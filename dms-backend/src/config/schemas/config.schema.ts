import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { HttpConfig } from './http.schema';

export class RootConfig{

  @IsDefined()
  @Type(() => HttpConfig)
  public readonly http!: HttpConfig;



}