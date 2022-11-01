import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigurableStorageProvider } from './persistence/configurable_storage_provider';

@Injectable()
export class PluginService {
    constructor(
        @Inject('storage_providers')
        private readonly storage_providers: { [k: string]: string },

        @Inject('entities')
        private readonly entities: any,

        private readonly module: ModuleRef,
    ) {}

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
}
