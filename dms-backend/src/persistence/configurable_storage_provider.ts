import { Class } from '../@types';
import { Readable, Writable } from 'stream';
import LocalFSConfig from '../plugins/local_fs/local_fs.config';
import { validateSync } from 'nest-typed-config/dist/utils/imports.util';
import { Logger, ValidationError } from '@nestjs/common';
import { StorageProvider } from './storage_provider';
import { Directory, FileOrDirectory, File } from './file';
import { Printer } from 'prettier';

export abstract class ConfigurableStorageProvider<T> implements StorageProvider{
    protected config: T
    protected readonly logger: Logger

    protected constructor(private readonly settings_class: Class<T>, class_name = "StorageProider") {
        this.logger = new Logger(class_name)
    }

    private formatValidationError(message: ValidationError | ValidationError[], indent= 0){
        if(Array.isArray(message)) message.forEach(m => this.formatValidationError(m, indent))
        else{
            this.logger.error(" ".repeat(indent*4) + `Field ${message.property} violates:`)
            Object.keys(message.constraints).forEach(e => this.logger.error(" ".repeat(indent*4) + `Type: ${e} - ${message.constraints[e]}`))
            message.children.forEach(e => this.formatValidationError(e, indent + 1))
        }
    }

    async init(config: any): Promise<void>{
        this.config = new this.settings_class()
        Object.getOwnPropertyNames(config).forEach(e => {
            this.config[e] = config[e]
        })
        const errors = validateSync(this.config as object)
        if(errors.length > 0){
            this.logger.error(`Wrong configuration found for object persistence.provider_config`)
            this.logger.error("Following errors occured:")
            this.formatValidationError(errors)
            throw new Error("Settings error")
        }
    }

    abstract delete(fod: FileOrDirectory): Promise<boolean>;

    abstract existsDir(d: Directory): Promise<boolean>;

    abstract existsFile(f: File): Promise<boolean>;

    abstract list(d: Directory): Promise<FileOrDirectory[]>;

    abstract listDirs(d: Directory): Promise<Directory[]>;

    abstract listFiles(d: Directory): Promise<File[]>;

    abstract readStream(f: File): Promise<Readable>

    abstract writeStream(f: File): Promise<Writable>;

}

export type ConfigurableStorageProviderClass = Class<ConfigurableStorageProvider<any>>;
