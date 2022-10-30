import { Inject, Injectable } from '@nestjs/common';
import { StorageProvider } from '../../persistence/storage_provider';
import * as fs from 'fs';
import { PluginService } from '../../plugin.service';

@Injectable()
export class LocalFSProvider implements StorageProvider {
    readdir(...path: string[]): Promise<string[]> {
        return new Promise((res, rej) => {
            fs.readdir(path.join(...path), (err, files) => {
                if (err) rej(err);
                res(files);
            });
        });
    }
}
