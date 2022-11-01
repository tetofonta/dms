import { Injectable } from '@nestjs/common';
import * as stream from 'stream';
import { Readable, Writable } from 'stream';
import { Directory, File, FileOrDirectory } from '../../persistence/file';
import { ConfigurableStorageProvider } from '../../persistence/configurable_storage_provider';
import S3FSConfig from './s3.config';
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

    async existsDir(d: Directory): Promise<boolean> {
        return (await this.list(d)).length > 0;
    }

    async existsFile(f: File): Promise<boolean> {
        const my_f = {path: f.path}
        return (await this.list(my_f)).some(e => 'name' in e && e.name === f.name);
    }

    async list(d: Directory): Promise<FileOrDirectory[]> {
        const list = await this.client.listObjectsV2({
            Bucket: this.config.bucket,
            Prefix: this.get_object_full_name(d) + (d.path.length > 0 ? "/" : ""),
            Delimiter: "/"
        })
        const common_prefixes = list.CommonPrefixes ? list.CommonPrefixes.map(e => this.reference_from_string(e.Prefix)) : []
        const contents = list.Contents ? list.Contents.map(e => this.reference_from_string(e.Key)) : []
        return [...common_prefixes, ...contents];
    }

    async listDirs(d: Directory): Promise<Directory[]> {
        const list = await this.client.listObjectsV2({
            Bucket: this.config.bucket,
            Prefix: this.get_object_full_name(d) + "/",
            Delimiter: "/"
        })
        return list.CommonPrefixes ? list.CommonPrefixes.map(e => this.reference_from_string(e.Prefix)) : [];
    }

    async listFiles(d: Directory): Promise<File[]> {
        const list = await this.client.listObjectsV2({
            Bucket: this.config.bucket,
            Prefix: this.get_object_full_name(d) + "/",
            Delimiter: "/"
        })
        return list.Contents ? list.Contents.map(e => this.reference_from_string(e.Key) as File) : [];
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

    private reference_from_string(pth: string): FileOrDirectory{
        const arr = pth.split('/')
        if(pth.endsWith('/'))
            return {path: arr.slice(0, arr.length - 1)}
        return {name: arr.pop(), path: arr}
    }
}
