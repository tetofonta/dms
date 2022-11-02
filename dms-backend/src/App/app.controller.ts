import { Controller, Get } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';

@Controller('/test')
export class AppController {

    constructor(private readonly r: PersistenceService) {
    }

    @Get('no-auth')
    async get_no_auth() {
        console.log(await this.r.list({path: ['aa']}))
        return 'ccc';
    }
}
