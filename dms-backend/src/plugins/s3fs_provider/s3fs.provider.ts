import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { StorageProvider } from '../../persistence/storage_provider';
import { PersistenceConfig } from '../../config/schemas/persistence.config';

@Injectable()
export class S3FSProvider implements StorageProvider {
    constructor(private readonly config: PersistenceConfig) {}

    readdir(...path: string[]): Promise<string[]> {
        return new Promise((res, rej) => {
            fs.readdir(path.join(...path), (err, files) => {
                if (err) rej(err);
                res(files);
            });
        });
    }
}
