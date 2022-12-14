import { DynamicModule, Logger, Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import * as fs from 'fs';
import * as path from 'path';
import { exec, execSync } from 'child_process';
import { StorageProviderClass } from './persistence/storage_provider';
import { ConfigModule } from './config/Config.module';
import { PluginController } from './plugin.controller';

@Module({})
export class PluginModule {
    private static logger = new Logger('PluginLoader');
    private static instance: DynamicModule | null = null;

    private static install_plugin_dependencies(pkg_name: string, pkg){
        if(pkg.dependencies && (!fs.existsSync(path.resolve(__dirname, 'plugins', pkg_name, 'node_modules')) || pkg.force)){
            this.logger.warn(`Dependencies for plugin ${pkg.name} are not installed, running npm install`)
            execSync("npm install", {
                cwd: path.resolve(__dirname, 'plugins', pkg_name),
                stdio: ['ignore', process.stdout, process.stdout]
            })
        }
    }

    private static modules: DynamicModule[] = []

    static forRoot(): DynamicModule {
        if (this.instance === null) {
            const plugins = fs.readdirSync(path.resolve(__dirname, 'plugins'));

            const db_entities = []

            const storage_providers: {[k: string]: StorageProviderClass} = {};

            plugins.forEach((e) => {
                if (fs.existsSync(path.resolve(__dirname, 'plugins', e, 'package.json'))) {
                    const pkg = require(path.resolve( __dirname, 'plugins', e, 'package.json'))

                    if(!pkg.main){
                        this.logger.warn(`No module entrypoint found. define package.json main property`)
                        return
                    }

                    this.install_plugin_dependencies(e, pkg)
                    const descriptor = require(path.resolve( __dirname, 'plugins', e, pkg.main));
                    const module_name = Object.keys(descriptor)[0];
                    if (!descriptor[module_name].type) {
                        this.logger.error(
                            `Malformed plugin ${e}: missing property type`,
                        );
                        return;
                    }

                    if(pkg.entities && Array.isArray(pkg.entities)){
                        pkg.entities.forEach(ent => {
                            db_entities.push(require(path.resolve(__dirname, 'plugins', e, ent)).default)
                        })
                    }

                    const module = descriptor[module_name];
                    switch (module.type) {
                        case 'storage_provider':
                            this.modules.push(module);
                            storage_providers[module.provider.name] = module.provider
                            break;
                        case 'std_module':
                            this.modules.push(module)
                            break;
                        default:
                            this.logger.error(
                                `Unknown plugin type: ${module.type}`,
                            );
                            return;
                    }
                    this.logger.log(`Loaded plugin ${pkg.name} v.${pkg.version}`)
                }
            });

            this.instance = {
                module: PluginModule,
                providers: [
                    {
                        provide: 'storage_providers',
                        useValue: storage_providers
                    },
                    {
                        provide: 'entities',
                        useValue: db_entities
                    },
                    PluginService,
                ],
                imports: [ConfigModule],
                controllers: [PluginController],
                exports: [PluginService],
            };
        }

        return this.instance;
    }

    static loadPluginModules(): DynamicModule {
        return {
            module: PluginModule,
            imports: this.modules
        }
    }
}
