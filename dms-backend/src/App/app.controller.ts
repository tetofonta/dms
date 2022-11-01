import { Controller, Get } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';

@Controller('/test')
export class AppController {

    constructor(private readonly r: PersistenceService) {
    }

    @Get('no-auth')
    async get_no_auth() {
        this.r.delete({path: ['aa']})
        return 'ccc';
    }
}
