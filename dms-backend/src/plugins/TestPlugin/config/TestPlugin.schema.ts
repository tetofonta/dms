import { IsDefined, IsString } from 'class-validator';

export class TestConfigRoot{

  @IsString()
  public readonly aaa!: string;



}