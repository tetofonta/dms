import {  Injectable } from '@nestjs/common';
import { ConfigurableStorageProvider } from '../../persistence/configurable_storage_provider';
import LocalFSConfig from './local_fs.config';
import { Readable, Writable } from 'stream';
import { Directory, File, FileOrDirectory } from '../../persistence/file';
import * as fs from 'fs';
import * as path from 'path';
import { Dir } from 'fs';

function to_promise<T>(fn: (...args: any[]) => void, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        fn(...args, (err: Error | undefined, ret: T) => {
            if (err) reject(err);
            resolve(ret);
        });
    });
}

@Injectable()
export class LocalFSProvider extends ConfigurableStorageProvider<LocalFSConfig> {

    constructor() {
        super(LocalFSConfig, "LocalFSProvider")
    }

    private get_full_path(name: string, ...pth: string[]){
        let pt = pth
        if(name) pt = [...pt, name]

        const p = path.normalize(path.resolve(this.config.storage_dir, ...pt))
        if(!p.startsWith(this.config.storage_dir))
            throw new Error(`Path traversal attempted. ${p} is outside ${this.config.storage_dir}`)
        return p
    }

    init(config: any) {
        super.init(config);
        if(!fs.existsSync(this.config.storage_dir)){
            this.logger.warn(`Storage data dir not existing: creating ${this.config.storage_dir}`)
            fs.mkdirSync(this.config.storage_dir, {recursive: true})
        } else if (fs.statSync(this.config.storage_dir).isFile()){
            throw new Error("Cannot create directory in place of a file.")
        } else {
            this.logger.log(`Using directory ${this.config.storage_dir}`)
        }
    }

    async delete(f: FileOrDirectory): Promise<boolean> {
        if(await this.exists(f)){
            await to_promise(fs.unlink, this.get_full_path('name' in f ? f.name : undefined, ...f.path))
            return true
        }
        return false;
    }

    private exists(f: FileOrDirectory): Promise<boolean> {
        return to_promise<boolean>(fs.exists, this.get_full_path('name' in f ? f.name : undefined, ...f.path));
    }

    async existsDir(d: Directory): Promise<boolean> {
        if(!await this.exists(d)) return false
        return fs.statSync(this.get_full_path(undefined, ...d.path)).isDirectory()
    }

    async existsFile(d: Directory): Promise<boolean> {
        if(!await this.exists(d)) return false
        return fs.statSync(this.get_full_path(undefined, ...d.path)).isFile()
    }

    async list({path}: Directory): Promise<FileOrDirectory[]> {
        return (await to_promise<string[]>(fs.readdir, this.get_full_path(undefined, ...path))).map(e => {
            if(fs.statSync(this.get_full_path(e, ...path)).isFile()) return {name: e, path}
            if(fs.statSync(this.get_full_path(e, ...path)).isDirectory()) return {path: [...path, e]}
            return undefined
        }).filter(e => !!e)
    }

    async listDirs(d: Directory): Promise<Directory[]> {
        return (await this.list(d)).filter(e => !('name' in e));
    }

    async listFiles(d: Directory): Promise<File[]> {
        return (await this.list(d)).filter(e => 'name' in e) as File[];
    }

    async readStream({name, path}: File): Promise<Readable> {
        return fs.createReadStream(this.get_full_path(name, ...path));
    }

    async writeStream({name, path}: File): Promise<Writable> {
        return fs.createWriteStream(this.get_full_path(name, ...path));
    }

}
