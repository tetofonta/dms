import { Class } from '../@types';
import { Readable, Writable } from 'stream';
import LocalFSConfig from '../plugins/local_fs/local_fs.config';
import { validateSync } from 'nest-typed-config/dist/utils/imports.util';
import { ValidationError } from '@nestjs/common';
import { Directory, FileOrDirectory, File } from './file';

export interface StorageProvider {
    writeStream(f: File): Promise<Writable>;
    readStream(f: File): Promise<Readable>;

    delete(fod: FileOrDirectory): Promise<boolean>;

    existsDir(d: Directory): Promise<boolean>;
    existsFile(f: File): Promise<boolean>;

    list(d: Directory): Promise<FileOrDirectory[]>;
    listDirs(d: Directory): Promise<Directory[]>;
    listFiles(d: Directory): Promise<File[]>;
}

export type StorageProviderClass = Class<StorageProvider>;
