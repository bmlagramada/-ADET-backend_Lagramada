import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [RentController],
    providers: [RentService],
    exports: [RentService],
})
export class RentModule {}