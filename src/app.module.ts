import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { LibrariesModule } from './modules/libraries/libraries.module';
import { RecordTypesModule } from './modules/record-types/record-types.module';
import { RecordsModule } from './modules/records/records.module';
import { UsersModule } from './modules/users/users.module';
import { TagsModule } from './modules/tags/tags.module';
import { NonCompliancesModule } from './modules/non-compliances/non-compliances.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    LibrariesModule,
    RecordTypesModule,
    RecordsModule,
    TagsModule,
    NonCompliancesModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule {}
