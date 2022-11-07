import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entity/user.entity';
import { Role } from '../database/entity/role.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/Config.module';
import { AuthConfig } from '../config/schemas/auth.schema';
import { AuthController } from './auth.controller';
import { JWTStrategy } from './jwt.strategy';

@Module({

    imports: [
        TypeOrmModule.forFeature([User, Role]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [AuthConfig],
            useFactory: (conf: AuthConfig) => {
                return {
                    secret: conf.secret_key,
                    signOptions: {
                        expiresIn: conf.expiry + "s",
                        issuer: conf.issuer
                    }
                }
            }
        })
    ],
    providers: [
        AuthService,
        JWTStrategy
    ],
    controllers: [AuthController],
    exports: [AuthService]

})
export class AuthModule{}