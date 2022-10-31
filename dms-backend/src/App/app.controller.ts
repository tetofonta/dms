import { Controller, Get } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';

@Controller('/test')
export class AppController {

    constructor(private readonly r: PersistenceService) {
    }

    @Get('no-auth')
    async get_no_auth() {

        // fs.createReadStream("./src/main.ts").pipe(await this.r.writeStream({name: "pippo", path: ["aa"]}));
        // (await this.r.readStream({name: "ciao.ts", path: []})).pipe(process.stdout)

        return 'ccc';
    }
}
