 import { Module } from '@nestjs/common';
 import { UsersModule } from './users/users.module';
 import { AuthModule } from './auth/auth.module';
 import { DatabaseModule } from './database/database.module';
import { RoomModule } from './room/room.module';
import { RentModule } from './rent/rent.module';

// @Module({
//    imports: [DatabaseModule, UsersModule, AuthModule, RentalModule],
// })

@Module({
   imports: [DatabaseModule, UsersModule, AuthModule, RoomModule, RentModule],
})

export class AppModule {}
