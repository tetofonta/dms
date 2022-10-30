import { DynamicModule, Logger, Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import * as fs from 'fs';
import * as path from 'path';

@Module({})
export class PluginModule {
    private static logger = new Logger('PluginLoader');
    private static instance: DynamicModule | null = null;

    static forRoot(): DynamicModule {
        if (this.instance === null) {
            const plugins = fs.readdirSync(path.join(__dirname, 'plugins'));
            const storage_providers = [];
            plugins.forEach((e) => {
                if (
                    fs.existsSync(
                        path.join(__dirname, 'plugins', e, 'plugin.js'),
                    )
                ) {
                    const descriptor = require(path.join(
                        __dirname,
                        'plugins',
                        e,
                        'plugin.js',
                    ));
                    const module_name = Object.keys(descriptor)[0];
                    if (!descriptor[module_name].type) {
                        this.logger.error(
                            `Malformed plugin ${e}: missing property type`,
                        );
                        return;
                    }

                    const module = descriptor[module_name];
                    switch (module.type) {
                        case 'storage_provider':
                            storage_providers.push(module);
                            break;
                        default:
                            this.logger.error(
                                `Unknown plugin type: ${module.type}`,
                            );
                            return;
                    }
                }
            });

            this.instance = {
                module: PluginModule,
                imports: storage_providers,
                providers: [
                    {
                        provide: 'storage_providers',
                        useValue: storage_providers.reduce(
                            (o, p) =>
                                Object.assign(o, {
                                    [p.provider.name]: p.provider,
                                }),
                            {},
                        ),
                    },
                    PluginService,
                ],
                exports: [PluginService],
            };
        }

        return this.instance;
    }
}
