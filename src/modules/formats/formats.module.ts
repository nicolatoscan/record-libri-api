import { Module } from '@nestjs/common';
import { FormatsController } from './formats.controller';
import { FormatsService } from './formats.service';

@Module({
  providers: [FormatsService],
  controllers: [FormatsController],
  exports: [FormatsService],
})
export class FormatsModule {}
