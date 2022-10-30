import { Inject, Injectable } from '@nestjs/common';
import { StorageProvider } from './storage_provider';
import { ModuleRef } from '@nestjs/core';
import { PluginService } from '../plugin.service';
import fn = jest.fn;

@Injectable()
export class PersistenceService implements StorageProvider {
    private readonly provider: StorageProvider;

    constructor(private readonly plugins: PluginService) {
        this.provider = plugins.getStorageProvider('S3FSProvider');
    }

    readdir(...path: string[]): Promise<string[]> {
        return this.provider.readdir(...path);
    }
}
