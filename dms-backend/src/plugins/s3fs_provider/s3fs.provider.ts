import { Injectable } from '@nestjs/common';
import { StorageProvider } from '../../persistence/storage_provider';
import { Readable, Writable } from 'stream';
import { Directory, FileOrDirectory, File } from '../../persistence/file';

@Injectable()
export class S3FSProvider implements StorageProvider {
    delete(fod: FileOrDirectory): Promise<boolean> {
        return Promise.resolve(false);
    }

    existsDir(d: Directory): Promise<boolean> {
        return Promise.resolve(false);
    }

    existsFile(f: File): Promise<boolean> {
        return Promise.resolve(false);
    }

    list(d: Directory): Promise<FileOrDirectory[]> {
        return Promise.resolve([]);
    }

    listDirs(d: Directory): Promise<Directory[]> {
        return Promise.resolve([]);
    }

    listFiles(d: Directory): Promise<File[]> {
        return Promise.resolve([]);
    }

    readStream(f: File): Promise<Readable> {
        return Promise.resolve(undefined);
    }

    writeStream(f: File): Promise<Writable> {
        return Promise.resolve(undefined);
    }

}
