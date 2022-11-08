import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigurableStorageProvider } from './persistence/configurable_storage_provider';
import { PluginConfig } from './config/schemas/plugin.config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PluginService {

    private readonly frontend_plugins: {[family: string]: any[]} = {}
    private readonly logger = new Logger("PluginManager")

    constructor(
        @Inject('storage_providers')
        private readonly storage_providers: { [k: string]: string },
        @Inject('entities')
        private readonly entities: any,
        private readonly module: ModuleRef,
        private readonly config: PluginConfig
    ) {
        fs.readdirSync(path.resolve(config.frontend_plugin_dir)).forEach(e => {
            const descriptor_path = path.resolve(config.frontend_plugin_dir, e, "plugin.json")
            if(fs.existsSync(descriptor_path)){
                const descriptor = JSON.parse(fs.readFileSync(descriptor_path, {encoding: 'utf-8'}))
                this.logger.log(`Loading frontend plugin ${descriptor.name} v${descriptor.version}`)
                if(!descriptor?.plugin?.family){
                    this.logger.error("No plugin descriptor. missing family")
                    return;
                }
                if(!this.frontend_plugins[descriptor.plugin.family]) this.frontend_plugins[descriptor.plugin.family] = []
                this.frontend_plugins[descriptor.plugin.family].push({
                    name: descriptor.name,
                    entrypoints: descriptor.plugin.entrypoints
                })
            }
        })
    }

    public getStorageProvider(name: string): ConfigurableStorageProvider<any> {
        if (!this.storage_providers[name])
            throw new Error(
                `Cannot find storage provider ${name}. Available ones are ${Object.keys(
                    this.storage_providers,
                ).join(', ')}`,
            );
        return this.module.get(this.storage_providers[name], { strict: false });
    }

    public getAdditionalEntities(){
        return this.entities
    }

    public getFrontendPluginByFamily(family: string) {
        if(!family || !this.frontend_plugins[family])
            throw new BadRequestException()
        return this.frontend_plugins[family];
    }
}
