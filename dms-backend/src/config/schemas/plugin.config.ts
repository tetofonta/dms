import { IsDefined, IsString } from 'class-validator';

export class PluginConfig {
    @IsDefined()
    @IsString()
    public readonly frontend_plugin_dir: string;
}
