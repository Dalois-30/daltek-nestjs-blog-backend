import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [
        UsersModule,
        SharedModule
    ]
})
export class FeaturesModule {}
