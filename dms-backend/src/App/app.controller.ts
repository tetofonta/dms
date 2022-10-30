import { Controller, Get } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';

@Controller('/test')
export class AppController {
    @Get('no-auth')
    async get_no_auth() {
        return 'AAA';
    }
}
