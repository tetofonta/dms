import { IsDataURI, IsDefined, IsString } from 'class-validator';
import * as path from 'path';

export default class LocalFSConfig {
    @IsDefined()
    @IsString()
    get storage_dir(): string {
        return this._storage_dir;
    }

    set storage_dir(value: string) {
        this._storage_dir = path.normalize(path.resolve(value));
    }

    private _storage_dir = '/';

}
