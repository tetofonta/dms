import { Class } from '../@types';

export interface StorageProvider {
    readdir(...path: string[]): Promise<string[]>;
}

export type StorageProviderClass = Class<StorageProvider>;
