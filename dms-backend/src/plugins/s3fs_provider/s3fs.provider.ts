import { Injectable, Logger } from '@nestjs/common';
import { Readable, Writable } from 'stream';
import { Directory, FileOrDirectory, File } from '../../persistence/file';
import { ConfigurableStorageProvider } from '../../persistence/configurable_storage_provider';
import S3FSConfig from './s3.config';
import * as stream from 'stream';
import * as path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3FSProvider extends ConfigurableStorageProvider<S3FSConfig> {

    private client: S3 = null;

    constructor() {
        super(S3FSConfig, "S3FSProvider")
    }

    async init(config){
        await super.init(config)
        this.client = new S3({
            credentials:{
                accessKeyId: this.config.access_key,
                secretAccessKey: this.config.secret_key
            },
            endpoint: this.config.endpoint,
            forcePathStyle: true,
            region: this.config.region
        })


        const buckets = await this.client.listBuckets({});
        if(!buckets.Buckets.some(e => e.Name === this.config.bucket))
            await this.client.createBucket({Bucket: this.config.bucket})
    }

    async delete(fod: FileOrDirectory): Promise<boolean> {
        // console.log(await this.client.listObjectsV2({
        //     Bucket: this.config.bucket,
        //     Prefix: fod.path.join("/")
        // }))
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

    async readStream(f: File): Promise<Readable> {
        const res = await this.client.getObject({
            Bucket: this.config.bucket,
            Key: this.get_object_full_name(f)
        })
        return res.Body as unknown as Readable
    }

    async writeStream(f: File): Promise<Writable> {
        const s = new stream.PassThrough()

        const upload = new Upload({
            client: this.client,
            queueSize: 5,
            params: {
                Bucket: this.config.bucket,
                Key: this.get_object_full_name(f),
                Body: s
            }
        })

        upload.on("httpUploadProgress", (progress) => {
            this.logger.log(progress);
        });
        upload.done()
        return s;
    }

    private get_object_full_name(f: FileOrDirectory) {
        let pth = f.path
        if('name' in f)
            pth = [...f.path, f.name]
        return path.resolve('/', ...pth);
    }
}
