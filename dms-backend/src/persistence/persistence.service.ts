import { Injectable } from '@nestjs/common';
import { StorageProvider } from './storage_provider';
import { PluginService } from '../plugin.service';
import { PersistenceConfig } from '../config/schemas/persistence.config';
import { Readable, Writable } from 'stream';
import { ConfigurableStorageProvider } from './configurable_storage_provider';
import { Directory, FileOrDirectory, File } from './file';

@Injectable()
export class PersistenceService implements StorageProvider{
    private readonly provider: ConfigurableStorageProvider<any>;

    constructor(
        private readonly plugins: PluginService,
        private readonly config: PersistenceConfig,
    ) {
        this.provider = plugins.getStorageProvider(config.persistence_provider);
        this.provider.init(config.provider_config);
    }

    delete(fod: FileOrDirectory): Promise<boolean> {
        return this.provider.delete(fod);
    }

    existsDir(d: Directory): Promise<boolean> {
        return this.provider.existsDir(d);
    }

    existsFile(f: File): Promise<boolean> {
        return this.provider.existsFile(f);
    }

    list(d: Directory): Promise<FileOrDirectory[]> {
        return this.provider.list(d);
    }

    listDirs(d: Directory): Promise<Directory[]> {
        return this.provider.listDirs(d);
    }

    listFiles(d: Directory): Promise<File[]> {
        return this.provider.listFiles(d);
    }

    readStream(f: File): Promise<Readable> {
        return this.provider.readStream(f);
    }

    writeStream(f: File): Promise<Writable> {
        return this.provider.writeStream(f);
    }
}
